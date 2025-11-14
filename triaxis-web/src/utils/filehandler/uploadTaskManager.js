import { checkFile, merge, uploadFile } from '../../api/modules/common.js';
import { db } from '../db/db.js';
import { logger } from '../logger.js';
import { HashCalculator } from './hash-calculator.js';
import { ChunkUploader } from './chunkUploader.js';
import { NetworkMonitor } from './networkMonitor.js';
// 单个文件上传函数
export class UploadTaskManager {
  constructor(taskId, file, config) {
    this.concurrency = config.concurrency;
    this.smallFileThreshold = config.smallFileThreshold;
    this.chunkSize = config.chunkSize;
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
    // 哈希计算器实例
    this.hashCalculator = new HashCalculator();
    // 分片上传器实例
    this.chunkUploader = new ChunkUploader({ maxRetries: config.maxRetries, concurrency: this.concurrency });
    this.isPaused = false;
    this.isCancelled = false;
    this.eventCallbacks = new Map();

    this.setupEventListeners();
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
    //只有未上传状态才能上传
    if (this.task.status !== 'pending') {
      return;
    }

    try {
      this.task.status = 'uploading';
      // 更新数据库
      await this.updateDatabase();

      logger.debug(`开始计算文件hash: ${this.task.file.name}`);
      this.task.fileHash = await this.hashCalculator.calculateHash(
        this.task.file,
        this.task.file.name
      );

      logger.debug(`秒传检查: ${this.task.fileHash}`);
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
      // 断点续传恢复
      await this.restoreUploadedChunks(checkResult.uploadedChunks || []);
      // 创建切片
      this.createChunks();
      // 文件大小判断
      if (this.task.file.size <= this.smallFileThreshold) {
        // 小文件上传
        await this.uploadSmallFile();
      } else {
        // 分片上传
        await this.uploadLargeFile();
      }

    } catch (error) {
      logger.debug(`文件上传失败，文件Id是 ${this.task.id}:`, error);
      this.task.status = 'error';
      // 失败更新数据库，出发啊回调函数
      await this.updateDatabase();
      this.emit('error', error, this.task);
    }
  }
  // 暂停上传文件，修改文件状态、暂停切片上传、更新数据库，触发回调函数
  async pause() {
    this.isPaused = true;
    this.task.status = 'paused';
    this.chunkUploader.pause();
    await this.updateDatabase();
    this.emit('paused', this.task);
  }
  // 恢复上传，修改文件状态、更新数据库，重新判断文件大小开启上传任务，触发回调函数
  async resume() {
    this.isPaused = false;
    this.task.status = 'uploading';
    await this.updateDatabase();

    if (this.task.file.size <= this.config.smallFileThreshold) {
      await this.uploadSmallFile();
    } else {
      await this.uploadLargeFile();
    }

    this.emit('resumed', this.task);
  }
  // 失败后的重新上传，重置状态，更新数据库、重新上传单个文件，并执行回调
  async retry() {
    this.isPaused = false;
    this.isCancelled = false;
    this.task.status = 'uploading';
    this.task.progress = 0;
    this.task.uploadedChunks = [];
    this.task.speed = 0;
    this.task.startTime = Date.now();

    await this.updateDatabase();
    await this.start();

    this.emit('retry', this.task);
  }
  // 取消上传，修改状态，取消分片列表上传，出发回调
  async cancel() {
    this.isCancelled = true;
    this.isPaused = false;
    this.chunkUploader.cancel();
    this.emit('cancelled', this.task);
  }
  // 秒传检查
  async checkInstantUpload() {
    try {
      const response = await checkFile({
        hash: this.task.fileHash,
        fileName: this.task.file.name,
        size: this.task.file.size
      })
      return response;
    } catch (error) {
      logger.debug('秒传检查失败', error);
      return { exists: false, needUpload: true, uploadedChunks: [] };
    }
  }
  // 断点续传
  async restoreUploadedChunks(uploadedChunks) {
    // 恢复本地记录，主要是已上传的chunks列表
    const record = await db.getUploadRecord(this.task.fileHash);
    if (record) {
      this.task.uploadedChunks = record.uploadedChunks || [];
    } else {
      this.task.uploadedChunks = uploadedChunks;
    }

    await this.updateDatabase();
  }
  // 创建chunks
  createChunks() {
    const chunks = [];
    const chunkSize = this.chunkSize;

    for (let i = 0; i < this.task.totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(this.task.file.size, start + chunkSize);
      const blob = this.task.file.slice(start, end);

      chunks.push({
        index: i,
        start,
        end,
        blob,
        status: this.task.uploadedChunks.includes(i) ? 'success' : 'pending',
        retryCount: 0
      });
    }

    this.task.chunks = chunks;
  }
  // 上传小文件
  async uploadSmallFile() {
    const formData = new FormData();
    formData.append('file', this.task.file);
    formData.append('hash', this.task.fileHash);
    formData.append('fileName', this.task.file.name);

    try {
      const response = await uploadFile({
        formData, ononUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            this.updateProgress(progress);
          }
        }
      })
      this.task.status = 'success';
      this.task.progress = 100;
      this.task.fileUrl = response || '';
      await this.updateDatabase();
      this.emit('success', this.task);
    } catch (error) {
      throw new Error(`小文件上传失败: ${error.message}`);
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
      await this.mergeChunks();
      return;
    }
    // 上传需要上传的chunks列表
    await this.chunkUploader.uploadChunks(
      pendingChunks,
      this.task.fileHash,
      this.task.file.name
    );
  }
  // 通知后端合并文件
  async mergeChunks() {
    try {
      const response = await merge({
        hash: this.task.fileHash,
        fileName: this.task.file.name,
        chunksCount: this.task.totalChunks
      })
      this.task.status = 'success';
      console.log("当前状态", this.task.status)
      this.task.progress = 100;
      this.task.fileUrl = response || '';
      await this.updateDatabase();
      this.emit('success', this.task);
    } catch (error) {
      throw new Error(`后端文件合并失败: ${error.message}`);
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
    }

    this.updateProgress((this.task.uploadedChunks.length / this.task.totalChunks) * 100);
    this.updateDatabase();
  }

  handleChunkError(chunkIndex, error) {
    logger.debug(`Chunk ${chunkIndex} upload failed:`, error);
  }

  handleUploadError(error) {
    this.task.status = 'error';
    this.updateDatabase();
    this.emit('error', error, this.task);
  }

  handleUploadComplete() {
    if (
      this.task.uploadedChunks.length === this.task.totalChunks &&
      !this.isCancelled &&
      !this.isPaused
    ) {
      this.mergeChunks().catch(error => {
        logger.debug('分片合并失败:', error);
        this.handleUploadError(error);
      });
    }
  }
  // 更新任务进度
  updateProgress(progress) {
    this.task.progress = Math.min(100, Math.max(0, progress));
    this.emit('progress', this.task.progress, this.task);
  }
  // 同步任务状态到数据库
  async updateDatabase() {
    try {
      await db.updateUploadProgress(
        this.task.id,
        this.task.progress,
        this.task.uploadedChunks
      );
      console.log("当前状态", this.task.status)
      await db.updateUploadStatus(this.task.id, this.task.status);
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
          logger.debug(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }
}