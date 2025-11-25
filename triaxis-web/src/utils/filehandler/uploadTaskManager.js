import { checkFile, merge, uploadFile } from '../../api/modules/common.js';
import { db } from '../db/db.js';
import { logger } from '../logger.js';
import { HashCalculator } from './hash-calculator.js';
import { ChunkUploader } from './chunkUploader.js';
import { NetworkMonitor } from './networkMonitor.js';
import { converBytes } from '../convertUnit.js';
/**
 * 单个文件上传任务管理器：处理文件上传全流程（哈希计算、秒传检查、分片上传、状态管理等）
 */
export class UploadTaskManager {
  constructor(taskId, file, config) {
    this.taskId = taskId; // 任务唯一ID
    this.smallFileThreshold = config.smallFileThreshold;
    this.chunkSize = config.chunkSize;

    // 任务记录
    this.task = {
      id: taskId,
      file,
      fileHash: '',
      status: 'pending',
      progress: 0,
      chunks: [],
      totalChunks: Math.ceil(file.size / this.chunkSize),
      uploadedChunks: [],
      speed: 0,
      fileUrl: '',
      startTime: Date.now()
    };

    // 工具实例
    // 哈希计算器实例
    this.hashCalculator = new HashCalculator();
    // 分片上传器实例
    this.chunkUploader = new ChunkUploader({
      maxRetries: config.maxRetries,
      taskId: this.taskId // 把当前任务ID传给 ChunkUploader
    },
      this.addCancelFn.bind(this) // 注入“存储取消函数”的方法（绑定当前实例）
    );
    this.networkMonitor = new NetworkMonitor()

    // 状态记录
    this.isPaused = false;
    this.isCancelled = false;

    // 事件回调存储
    this.eventCallbacks = new Map();

    // 绑定分片上传器的事件
    this.setupEventListeners();
    this.cancelFns = []
  }
  addCancelFn(cancelFn) {
    if (typeof cancelFn === 'function' && !this.cancelFns.includes(cancelFn)) {
      this.cancelFns.push(cancelFn);
    }
  }

  // 新增：批量执行所有取消函数
  cancelAllRequests() {
    this.cancelFns.forEach(cancelFn => {
      try {
        cancelFn();
      } catch (error) {
        logger.error(`任务[${this.taskId}]取消请求失败：`, error);
      }
    });
    this.cancelFns = []; // 清空已执行的取消函数
  }
  // 绑定分片上传器的事件
  setupEventListeners() {
    this.chunkUploader.on('progress', this.handleChunkProgress.bind(this));
    this.chunkUploader.on('chunkSuccess', this.handleChunkSuccess.bind(this));
    this.chunkUploader.on('chunkError', this.handleChunkError.bind(this));
    this.chunkUploader.on('error', this.handleUploadError.bind(this));
    this.chunkUploader.on('complete', this.handleUploadComplete.bind(this));
  }

  // 启动上传任务
  async start() {
    // 仅pending状态可启动
    if (this.task.status !== 'pending' && !this.isCancelled && !this.isPaused) {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法启动`);
      return;
    }

    try {
      this.task.status = 'uploading';
      // 更新数据库
      await this.updateDatabase();
      this.emit('start', this.task);

      //计算文件哈希
      logger.debug(`任务[${this.taskId}]开始计算文件哈希：${this.task.file.name}`);
      this.task.fileHash = await this.hashCalculator.calculateHash(
        this.task.file,
        this.task.file.name
      );

      // 秒传检查（后端判断文件是否已存在）
      logger.debug(`任务[${this.taskId}]秒传检查：${this.task.fileHash}`);
      const checkResult = await this.checkInstantUpload();
      // 秒传结果不需要上传直接成功
      if (!checkResult.needUpload) {
        this.task.status = 'success';
        this.task.progress = 100;
        this.task.fileUrl = checkResult.url || '';
        // 更新数据库，触发成功回调
        await this.updateDatabase();
        this.emit('success', this.task);
        return;
      }

      logger.debug(`任务[${this.taskId}]文件大小是：${converBytes(this.task.file.size)}`);
      // 文件大小判断选择上传方式
      if (this.task.file.size <= this.smallFileThreshold) {
        // 小文件上传
        await this.uploadSmallFile();
      } else {
        // 分片上传
        // 断点续传恢复
        await this.restoreUploadedChunks(checkResult.uploadedChunks || []);
        // 创建切片
        if (this.task.chunks.length === 0) {
          this.createChunks();
        }
        await this.uploadLargeFile();
      }

    } catch (error) {
      logger.error(`任务[${this.taskId}]上传失败：`, error);
      this.task.status = 'error';
      // 更新数据库
      await this.updateDatabase();
      this.emit('error', error, this.task);
    }
  }


  // 暂停上传文件，修改文件状态、暂停切片上传、更新数据库，触发回调函数
  async pause() {
    if (this.task.status !== 'uploading') {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法暂停`);
      return;
    }
    this.cancelAllRequests();
    this.isPaused = true;
    this.task.status = 'paused';
    this.chunkUploader.pause(this.taskId);
    // 更新数据库
    await this.updateDatabase();
    this.emit('paused', this.task);
    logger.debug(`任务[${this.taskId}]已暂停`);
  }


  // 恢复上传，修改文件状态、更新数据库，重新判断文件大小开启上传任务，触发回调函数
  async resume() {
    // if (this.task.status !== 'paused') {
    //   logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法恢复`);
    //   return;
    // }

    this.isPaused = false;
    this.isCancelled = false;
    this.task.status = 'pending';
    this.task.speed = 0;
    this.task.startTime = Date.now();
    this.chunkUploader.retry();
    await this.updateDatabase();
    logger.debug(`任务[${this.taskId}]已恢复上传`);
    this.emit('resumed', this.task);
  }


  // 失败后的重新上传，重置状态，更新数据库、重新上传单个文件，并执行回调
  async retry() {
    if (['success', 'cancelled'].includes(this.task.status)) {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法重试`);
      return;
    }
    // 重置状态
    this.isPaused = false;
    this.isCancelled = false;
    this.task.status = 'pending';
    this.task.progress = 0;
    this.task.speed = 0;
    this.task.startTime = Date.now();
    this.chunkUploader.retry();
    await this.updateDatabase();
    this.emit('retry', this.task);
    logger.debug(`任务[${this.taskId}]已重试`);
  }


  // 取消上传，修改状态，取消分片列表上传，出发回调
  async cancel() {
    if (this.task.status === 'success' || this.task.status === 'cancelled') {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无需取消`);
      return;
    }
    // this.cancelAllRequests();

    this.isCancelled = true;
    this.isPaused = false;
    this.task.status = 'cancelled';
    this.chunkUploader.cancel(this.taskId); // 通知分片上传器取消（清空连接池请求）
    await this.updateDatabase(); // 同步状态到数据库
    this.emit('cancelled', this.task);
    logger.debug(`任务[${this.taskId}]已取消`);
  }

  // 秒传检查
  async checkInstantUpload() {
    try {
      const response = await checkFile({
        hash: this.task.fileHash,
        fileName: this.task.file.name,
        size: this.task.file.size
      }, (onCancelFunc) => {
        // 在调用接口的同时，相当于同时调用了传入的这个函数，又能同时拿到返回的取消方法去赋值
        this.addCancelFn(onCancelFunc);
      })
      return response;
    } catch (error) {
      // 捕获取消错误，避免任务状态异常
      if (error.name === 'AbortError') {
        logger.debug(`任务[${this.taskId}]秒传检查请求已取消`);
        return { needUpload: true, uploadedChunks: [] };
      }
      logger.error(`任务[${this.taskId}]秒传检查失败：`, error);
      return { needUpload: true, uploadedChunks: [] };
    }
  }

  // 断点续传
  async restoreUploadedChunks(serverUploadedChunks) {
    // 优先从本地数据库恢复（更全），本地没有则用后端返回的
    const localRecord = await db.getUploadedChunksById(this.taskId);
    if (localRecord && localRecord.uploadedChunks?.length) {
      this.task.uploadedChunks = localRecord.uploadedChunks || [];
      this.task.chunks = localRecord.chunks || [];
      logger.debug(`任务[${this.taskId}]从本地恢复已上传分片：${this.task.uploadedChunks.length}个`);
    } else {
      this.task.uploadedChunks = serverUploadedChunks || [];
      logger.debug(`任务[${this.taskId}]从后端恢复已上传分片：${this.task.uploadedChunks.length}个`);
    }
    await this.updateDatabase(); // 同步到数据库
  }
  /**
   * 流式创建分片：只存储分片元数据（索引、起止位置），不上传时不生成Blob
   */
  createChunks() {
    const chunks = [];
    const chunkSize = this.chunkSize;
    const fileSize = this.task.file.size;

    // 只循环生成分片元数据（无Blob），内存占用可忽略
    for (let i = 0; i < this.task.totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(fileSize, start + chunkSize);

      chunks.push({
        index: i,
        start,
        end,
        // 移除提前生成的blob，改为上传时动态创建
        status: this.task.uploadedChunks.includes(i) ? 'success' : 'pending',
        retryCount: 0
      });
    }

    this.task.chunks = chunks;
    logger.debug(`任务[${this.taskId}]流式创建分片元数据完成：共${this.task.totalChunks}个，未预生成Blob`);
  }
  // 上传小文件
  async uploadSmallFile() {
    const formData = new FormData();
    formData.append('file', this.task.file);
    formData.append('hash', this.task.fileHash);
    formData.append('fileName', this.task.file.name);

    try {
      const response = await uploadFile(
        formData, (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            this.updateProgress(progress);
          }
        }, (onCancelFunc) => {
          // 在调用接口的同时，相当于同时调用了传入的这个函数，又能同时拿到返回的取消方法去赋值
          this.addCancelFn(onCancelFunc)
        }
      )
      this.task.status = 'success';
      this.task.progress = 100;
      this.task.fileUrl = response || '';
      await this.updateDatabase();
      //删除数据库的内容
      await db.deleteUploadRecord(this.taskId);
      this.emit('success', this.task);
      logger.debug(`任务[${this.taskId}]小文件上传成功`);
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.debug(`任务[${this.taskId}]小文件上传请求已取消`);
        return { needUpload: true, uploadedChunks: [] };
      }
      logger.error(`任务[${this.taskId}]小文件上传失败：`, error);
      throw new Error("文件上传失败")
    }
  }
  // 分片上传
  async uploadLargeFile() {
    // 过滤没上传成功的为待上传列表
    const pendingChunks = this.task.chunks.filter(
      chunk => chunk.status !== 'success' && !this.isCancelled && !this.isPaused
    );
    // 待上传为0就合并文件通知后端
    if (pendingChunks.length === 0) {
      logger.debug(`任务[${this.taskId}]无待上传分片，直接合并`);
      await this.mergeChunks();
      return;
    }
    // 上传需要上传的chunks列表
    logger.debug(`任务[${this.taskId}]开始上传分片：共${pendingChunks.length}个`);
    await this.chunkUploader.uploadChunks(
      pendingChunks,
      this.task.fileHash,
      this.task.file.name,
      this.task.file
    );
  }
  // 通知后端合并文件
  async mergeChunks() {
    try {
      const response = await merge({
        hash: this.task.fileHash,
        fileName: this.task.file.name,
        chunksCount: this.task.totalChunks
      }, (onCancelFunc) => {
        // 在调用接口的同时，相当于同时调用了传入的这个函数，又能同时拿到返回的取消方法去赋值
        this.task.cancel = onCancelFunc
      })

      // 合并成功
      this.task.status = 'success';
      this.task.progress = 100;
      this.task.fileUrl = response || '';
      await this.updateDatabase();
      //删除数据库的内容
      await db.deleteUploadRecord(this.taskId);
      this.emit('success', this.task);
      logger.debug(`任务[${this.taskId}]分片合并成功`);


    } catch (error) {
      if (error.name === 'AbortError') {
        logger.debug(`任务[${this.taskId}]后端合并请求已取消`);
        return { needUpload: true, uploadedChunks: [] };
      }
      logger.error(`任务[${this.taskId}]后端合并失败：`, error);
      throw new Error("文件上传失败")
    }
  }
  //计算分片进度
  handleChunkProgress(uploaded, total) {
    const chunkProgress = (uploaded / total) * 100;
    const overallProgress = (this.task.uploadedChunks.length + chunkProgress / 100) / this.task.totalChunks * 100;

    this.updateProgress(overallProgress);
  }

  // 处理分片上传成功，将分片索引加入uploadedChunks，更新整体进度和数据库
  handleChunkSuccess(chunkIndex) {
    if (!this.task.uploadedChunks.includes(chunkIndex)) {
      this.task.uploadedChunks.push(chunkIndex);
      logger.debug(`任务[${this.taskId}]分片[${chunkIndex}]上传成功，累计已传${this.task.uploadedChunks.length}个`);
    }

    this.updateProgress((this.task.uploadedChunks.length / this.task.totalChunks) * 100);
    this.updateDatabase();
  }
  // 处理上传分片失败
  handleChunkError(chunkIndex, error) {
    logger.error(`任务[${this.taskId}]分片[${chunkIndex}]上传失败：`, error);
    this.emit('chunkError', chunkIndex, error, this.task);
  }
  // 处理上传整体失败
  handleUploadError(error) {
    this.task.status = 'error';
    this.updateDatabase();
    this.emit('error', error, this.task);
  }
  // 处理所有分片上传完成
  handleUploadComplete() {
    if (
      this.task.uploadedChunks.length === this.task.totalChunks &&
      !this.isCancelled &&
      !this.isPaused
    ) {
      logger.debug(`任务[${this.taskId}]所有分片上传完成，开始合并`);
      this.mergeChunks().catch(error => {
        logger.error(`任务[${this.taskId}]合并失败：`, error);
        this.handleUploadError(error);
      });
    }
  }
  // 更新任务进度
  updateProgress(progress) {
    const clampedProgress = Math.min(100, Math.max(0, progress)); // 限制在0-100
    this.task.progress = clampedProgress;
    this.task.speed = this.networkMonitor.getCurrentSpeed(); // 更新速度
    this.emit('progress', clampedProgress, this.task);
  }
  // 同步任务状态到数据库
  async updateDatabase() {
    try {
      await db.updateUploadProgress(
        this.task.id,
        this.task.progress,
        this.task.uploadedChunks,
      );
      await db.updateUploadStatus(this.task.id, this.task.status);
      // 更新文件URL（成功时）
      if (this.task.status === 'success' && this.task.fileUrl) {
        await db.updateUploadFileUrl(this.taskId, this.task.fileUrl);
      }
    } catch (error) {
      logger.debug('Failed to update database:', error);
    }
  }

  //事件订阅与取消
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }

  off(event, callback) {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, ...args) {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          logger.error(`任务[${this.taskId}]事件[${event}]回调失败：`, error);
        }
      });
    }
  }
}