import { checkDownloadFile, completeDownload } from '../../api/modules/common.js';
import { db } from '../db/db.js';
import { logger } from '../logger.js';
import { ChunkDownloader } from './chunkDownloader.js';
import { NetworkMonitor } from './networkMonitor.js';

/**
 * 单个文件下载任务管理器
 */
export class DownloadTaskManager {
  constructor(taskId, fileId, config) {
    this.taskId = taskId;
    this.fileId = fileId; // 使用文件ID而不是文件名

    this.chunkSize = config.chunkSize;

    // 任务记录
    this.task = {
      id: taskId,
      fileId: fileId, // 存储文件ID
      fileName: '', // 文件名将在检查文件信息后设置
      status: 'pending',
      progress: 0,
      chunks: [],
      totalChunks: 0,
      downloadedChunks: [],
      speed: 0,
      fileUrl: '',
      startTime: Date.now(),
      fileSize: 0
    };

    // 工具实例
    this.chunkDownloader = new ChunkDownloader({
      maxRetries: config.maxRetries,
      taskId: this.taskId
    }, this.addCancelFn.bind(this));

    this.networkMonitor = new NetworkMonitor();

    // 状态记录
    this.isPaused = false;
    this.isCancelled = false;
    this.eventCallbacks = new Map();
    this.cancelFns = [];

    // 绑定事件
    this.setupEventListeners();
  }

  addCancelFn(cancelFn) {
    if (typeof cancelFn === 'function' && !this.cancelFns.includes(cancelFn)) {
      this.cancelFns.push(cancelFn);
    }
  }

  cancelAllRequests() {
    this.cancelFns.forEach(cancelFn => {
      try {
        cancelFn();
      } catch (error) {
        logger.error(`任务[${this.taskId}]取消请求失败：`, error);
      }
    });
    this.cancelFns = [];
  }

  setupEventListeners() {
    this.chunkDownloader.on('chunkSuccess', this.handleChunkSuccess.bind(this));
    this.chunkDownloader.on('chunkError', this.handleChunkError.bind(this));
    this.chunkDownloader.on('complete', this.handleDownloadComplete.bind(this));
  }

  // 启动下载任务
  async start() {
    if (this.task.status !== 'pending' && !this.isCancelled && !this.isPaused) {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法启动`);
      return;
    }

    try {
      this.task.status = 'downloading';
      await this.updateDatabase();
      this.emit('start', this.task);

      // 检查文件信息
      logger.debug(`任务[${this.taskId}]开始检查文件：${this.fileId}`);
      const checkResult = await this.checkDownloadFile();
      // 构建真实分片Map（从本地恢复）
      // 更新文件信息
      this.task.fileName = checkResult.fileName; // 从后端获取原始文件名
      this.task.fileSize = checkResult.fileSize;
      this.task.totalChunks = checkResult.totalChunks;

      // 断点续传恢复
      await this.restoreDownloadedChunks(checkResult.downloadedChunks || []);
      // 如果不需要下载（已完整），直接完成
      if (!checkResult.needDownload) {
        await this.handleDownloadComplete(new Map());
        return;
      }

      // 创建分片元数据
      this.createChunks();
      // 开始分片下载
      await this.downloadFile();

    } catch (error) {
      logger.error(`任务[${this.taskId}]下载失败：`, error);
      this.task.status = 'error';
      await this.updateDatabase();
      this.emit('error', error, this.task);
    }
  }

  async checkDownloadFile() {
    try {
      const response = await checkDownloadFile({
        id: this.fileId, // 传递文件ID
        taskId: this.taskId,
        chunkSize: this.chunkSize
      }, (onCancelFunc) => {
        this.addCancelFn(onCancelFunc);
      });
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.debug(`任务[${this.taskId}]文件检查请求已取消`);
        throw error;
      }
      logger.error(`任务[${this.taskId}]文件检查失败：`, error);
      throw error;
    }
  }

  async restoreDownloadedChunks(serverDownloadedChunks) {
    const localRecord = await db.getDownloadRecord(this.taskId);
    if (localRecord && localRecord.downloadedChunks?.length) {
      this.task.downloadedChunks = localRecord.downloadedChunks;
      logger.debug(`任务[${this.taskId}]从本地恢复已下载分片：${this.task.downloadedChunks.length}个`);
    } else {
      this.task.downloadedChunks = serverDownloadedChunks;
      logger.debug(`任务[${this.taskId}]从后端恢复已下载分片：${this.task.downloadedChunks.length}个`);
    }
    await this.updateDatabase();
  }

  createChunks() {
    const chunks = [];
    for (let i = 0; i < this.task.totalChunks; i++) {
      chunks.push({
        index: i,
        status: this.task.downloadedChunks.includes(i) ? 'success' : 'pending',
        retryCount: 0
      });
    }
    this.task.chunks = chunks;
    logger.debug(`任务[${this.taskId}]创建分片元数据完成：共${this.task.totalChunks}个`);
  }

  async downloadFile() {
    const pendingChunks = this.task.chunks.filter(
      chunk => chunk.status !== 'success' && !this.isCancelled && !this.isPaused
    );

    if (pendingChunks.length === 0) {
      logger.debug(`任务[${this.taskId}]无待下载分片，直接完成`);
      await this.handleDownloadComplete(new Map());
      return;
    }
    logger.debug(`任务[${this.taskId}]开始下载分片：共${pendingChunks.length}个`);
    // 等待分片下载完成后，获取真实分片数据
    await this.chunkDownloader.downloadChunks(
      pendingChunks,
      this.fileId,
      this.taskId,
      this.chunkSize
    );
  }

  handleChunkSuccess(chunkIndex) {
    if (!this.task.downloadedChunks.includes(chunkIndex)) {
      this.task.downloadedChunks.push(chunkIndex);
      logger.debug(`任务[${this.taskId}]分片[${chunkIndex}]下载成功，累计已下载${this.task.downloadedChunks.length}个`);
    }

    this.updateProgress((this.task.downloadedChunks.length / this.task.totalChunks) * 100);
    this.updateDatabase();
  }

  handleChunkError(chunkIndex, error) {
    logger.error(`任务[${this.taskId}]分片[${chunkIndex}]下载失败：`, error);
    this.emit('chunkError', chunkIndex, error, this.task);
    this.emit('error', error, this.task)
  }

  async handleDownloadComplete(downloadedChunksMap) {
    try {
      // 在客户端合并所有分片
      const mergedBlob = await this.mergeChunks(downloadedChunksMap);

      // 生成下载URL
      this.task.fileUrl = URL.createObjectURL(mergedBlob);
      this.task.status = 'success';
      this.task.progress = 100;

      // 标记下载完成
      await completeDownload({
        taskId: this.taskId,
        fileId: this.fileId
      });

      await this.updateDatabase();
      await db.deleteDownloadRecord(this.taskId); // 清理数据库记录

      this.emit('success', this.task);
      logger.debug(`任务[${this.taskId}]下载完成`);

    } catch (error) {
      logger.error(`任务[${this.taskId}]分片合并失败：`, error);
      this.handleDownloadError(error);
    }
  }

  async mergeChunks(downloadedChunksMap) {
    // 按索引顺序合并所有分片
    const chunks = [];
    for (let i = 0; i < this.task.totalChunks; i++) {
      const chunkBlob = downloadedChunksMap.get(i);
      // if (!chunkBlob) {
      //   throw new Error(`分片${i}数据缺失`);
      // }
      chunks.push(chunkBlob);
    }

    return new Blob(chunks, { type: 'application/octet-stream' });
  }

  handleDownloadError(error) {
    this.task.status = 'error';
    this.updateDatabase();
    this.emit('error', error, this.task);
  }

  updateProgress(progress) {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    this.task.progress = clampedProgress;
    this.task.speed = this.networkMonitor.getCurrentSpeed();
    this.emit('progress', clampedProgress, this.task);
  }

  // 暂停、恢复、重试、取消方法
  async pause() {
    if (this.task.status !== 'downloading') {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法暂停`);
      return;
    }
    this.cancelAllRequests();
    this.isPaused = true;
    this.task.status = 'paused';
    this.chunkDownloader.pause(this.taskId);
    await this.updateDatabase();
    this.emit('paused', this.task);
    logger.debug(`任务[${this.taskId}]已暂停`);
  }

  async resume() {
    if (this.task.status !== 'paused') {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法恢复`);
      return;
    }
    this.isPaused = false;
    this.isCancelled = false;
    this.task.status = 'pending';
    this.task.speed = 0;
    this.task.startTime = Date.now();
    this.chunkDownloader.retry();
    await this.updateDatabase();
    this.emit('resumed', this.task);
  }

  async retry() {
    if (['success', 'cancelled'].includes(this.task.status)) {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无法重试`);
      return;
    }
    this.isPaused = false;
    this.isCancelled = false;
    this.task.status = 'pending';
    this.task.progress = 0;
    this.task.speed = 0;
    this.task.startTime = Date.now();
    this.chunkDownloader.retry();
    await this.updateDatabase();
    this.emit('retry', this.task);
  }

  async cancel() {
    if (this.task.status === 'success' || this.task.status === 'cancelled') {
      logger.warn(`任务[${this.taskId}]状态为${this.task.status}，无需取消`);
      return;
    }
    this.cancelAllRequests();
    this.isCancelled = true;
    this.isPaused = false;
    this.task.status = 'cancelled';
    this.chunkDownloader.cancel(this.taskId);
    await this.updateDatabase();
    this.emit('cancelled', this.task);
  }

  async updateDatabase() {
    try {
      await db.updateDownloadProgress(
        this.task.id,
        this.task.progress,
        this.task.downloadedChunks,
      );
      await db.updateDownloadStatus(this.task.id, this.task.status);

      // 更新文件信息
      if (this.task.fileName && this.task.fileSize > 0) {
        await db.updateDownloadFileInfo(
          this.task.id,
          this.task.fileId,
          this.task.fileName,
          this.task.fileSize,
          this.task.totalChunks
        );
      }
    } catch (error) {
      logger.debug('更新下载数据库失败:', error);
    }
  }

  // 事件系统
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