import { db } from '../db/db.js';
import { UploadTaskManager } from './uploadTaskManager.js';
import { NetworkMonitor } from './networkMonitor.js';
import { logger } from '../logger.js';

export class UploadManager {
  constructor() {
    this.config = {
      smallFileThreshold: 100 * 1024 * 1024, // 100MB
      maxRetries: 3,
      chunkSize: 10 * 1024 * 1024,
      concurrency: 3
    };
    // 核心新增：文件级最大并发数（控制同时上传的文件总数，比如最多3个文件并行）
    this.fileMaxConcurrent = 3;
    this.tasks = new Map(); // 所有任务
    this.activeFileTasks = new Set(); // 正在上传的文件任务
    this.pendingFileTasks = []; // 排队等待的文件任务
    this.isInitialized = false;
    this.networkMonitor = new NetworkMonitor();
  }

  // 初始化
  async initialize() {
    if (this.isInitialized) return;
    await this.restorePendingTasks();
    this.isInitialized = true;
    logger.debug('任务管理器初始化');
  }

  // 断点续传恢复,页面刷新/重新打开时从数据库加载
  async restorePendingTasks() {
    try {
      const pendingRecords = await db.getAllActiveUploads();
      for (const record of pendingRecords) {
        logger.debug('恢复上传的文件', record);
        // 恢复任务到“暂停”状态,避免自动开始
        await db.updateUploadStatus(record.id, 'paused');
      }
    } catch (error) {
      logger.debug('断点续传失败', error);
    }
  }

  // 添加文件到队列，按文件并发数控制启动
  async addFile(file) {
    if (file.size === 0) {
      throw new Error('不能上传空文件');
    }

    // 动态计算当前文件的chunkSize
    this.networkMonitor.reset();
    this.networkMonitor.setFileTotalSize(file.size);
    const { chunkSize, concurrency } = this.networkMonitor.getCalculationResult();
    this.config.chunkSize = chunkSize; // 自动更新chunk大小
    this.config.concurrency = concurrency;
    logger.debug("当前chunkSize是", chunkSize);
    logger.debug("当前chunk并发数量是", concurrency);
    // 创建文件任务
    const taskId = this.generateTaskId();
    const taskManager = new UploadTaskManager(
      taskId,
      file,
      this.config
    );
    this.tasks.set(taskId, taskManager);
    const totalChunks = Math.ceil(file.size / this.config.chunkSize);

    // 保存数据库
    await db.saveUploadRecord({
      id: taskId,
      fileHash: '',
      fileName: file.name,
      fileSize: file.size,
      totalChunks: totalChunks,
      uploadedChunks: [],
      status: 'pending',
      progress: 0,
      fileUrl: '',
      chunkSize: chunkSize
    });

    // 添加到文件等待队列，触发队列处理
    this.pendingFileTasks.push(taskManager);
    logger.debug(`文件 ${file.name} 加入上传队列，当前排队数：${this.pendingFileTasks.length}`);
    this._processFileQueue(); // 处理队列，按并发数启动任务

    return taskManager;
  }

  // 处理文件队列，控制同时上传的文件数
  async _processFileQueue() {
    // 正在上传的文件数 < 最大文件并发数，且有排队任务
    while (this.activeFileTasks.size < this.fileMaxConcurrent && this.pendingFileTasks.length > 0) {
      const taskManager = this.pendingFileTasks.shift(); // 取出第一个排队任务
      this.activeFileTasks.add(taskManager); // 标记为活跃任务
      const taskId = taskManager.task.id;
      logger.debug(`启动文件上传：${taskManager.task.file.name}，当前活跃文件数：${this.activeFileTasks.size}`);

      //启动任务，监听完成/失败/取消事件，触发下一个任务
      try {
        await taskManager.start(); // 启动文件上传（内部已控制chunk并发）
        logger.debug(`文件上传成功：${taskManager.task.file.name}`);
      } catch (error) {
        logger.debug(`文件上传失败：${taskManager.task.file.name}`, error);
      } finally {
        // 任务结束，从活跃队列移除，继续处理下一个
        this.activeFileTasks.delete(taskManager);
        logger.debug(`文件上传结束，当前活跃文件数：${this.activeFileTasks.size}`);
        this._processFileQueue(); // 递归处理下一个排队任务
      }
    }
  }

  // 暂停上传
  async pauseUpload(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      await task.pause();
      // 暂停后从活跃队列移除，触发下一个任务
      this.activeFileTasks.delete(task);
      this.pendingFileTasks.unshift(task); // 暂停的任务放回队列头部
      this._processFileQueue();
    }
  }

  async resumeUpload(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      // 恢复后重新加入队列，按并发数启动
      this.pendingFileTasks.push(task);
      this._processFileQueue();
      await task.resume();
    }
  }

  async retryUpload(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      this.pendingFileTasks.push(task);
      this._processFileQueue();
      await task.retry();
    }
  }

  async cancelUpload(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      await task.cancel();
      this.tasks.delete(taskId);
      this.activeFileTasks.delete(task); // 从活跃队列移除
      this.pendingFileTasks = this.pendingFileTasks.filter(t => t.task.id !== taskId); // 从排队队列移除
      await db.deleteUploadRecord(taskId);
      this._processFileQueue(); // 触发下一个任务
    }
  }

  // 原有方法不变
  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}