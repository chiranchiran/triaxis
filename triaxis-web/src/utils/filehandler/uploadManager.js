import { db } from '../db/db.js';
import { UploadTaskManager } from './uploadTaskManager.js';
import { NetworkMonitor } from './networkMonitor.js';
import { logger } from '../logger.js';
import { requestPool } from './requestPool.js';

export class UploadManager {
  constructor() {
    this.config = {
      smallFileThreshold: 600 * 1024 * 1024, // 100MB
      maxRetries: 3,
      chunkSize: 10 * 1024 * 1024,
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
    // db.clearAllUploadRecords();
    if (this.isInitialized) return;
    try {
      // 从数据库恢复所有未完成的任务（pending/paused/error）
      const pendingRecords = await db.getAllActiveUploads();
      for (const record of pendingRecords) {
        logger.debug(`恢复任务[${record.id}]：${record.fileName}`);
        // 恢复为paused状态（避免自动启动）
        await db.updateUploadStatus(record.id, 'paused');
      }

      logger.debug(`初始化完成，共恢复${pendingRecords.length}个未完成任务`);
    } catch (error) {
      logger.error('初始化失败（断点续传恢复失败）：', error);
    }

    this.isInitialized = true;
    // 初始化时根据网速调整连接池并发
    this.adjustPoolConcurrent();
  }
  // 添加文件到队列，按文件并发数控制启动
  async addFile(file) {
    if (!this.isInitialized) {
      throw new Error('请先初始化UploadManager');
    }
    if (file.size === 0) {
      throw new Error('不能上传空文件');
    }


    // 动态计算当前文件的chunkSize
    this.networkMonitor.setFileTotalSize(file.size);
    const { chunkSize } = this.networkMonitor.getCalculationResult()
    this.config.chunkSize = chunkSize; // 自动更新chunk大小
    logger.debug("当前chunkSize是", chunkSize);
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
    // 监听任务进度，更新全局网络速度
    taskManager.on('progress', (progress, task) => {
      const loaded = (progress / 100) * task.file.size;
      this.networkMonitor.updateSpeed(loaded, task.file.size);
      this.adjustPoolConcurrent(); // 动态调整连接池并发
    });
    // 监听任务结束（成功/失败/取消），启动下一个任务
    ['success', 'error', 'cancelled'].forEach(event => {
      taskManager.on(event, () => {
        this.activeFileTasks.delete(taskId);
        this.processFileQueue(); // 处理下一个排队任务
      });
    });
    // 添加到文件等待队列，触发队列处理
    this.pendingFileTasks.push(taskId);
    logger.debug(`文件[${file.name}]已加入队列，任务ID：${taskId}，当前排队数：${this.pendingFileTasks.length}`);
    this.processFileQueue();

    return taskManager;
  }

  // 处理文件队列，控制同时上传的文件数
  async processFileQueue() {
    // 若活跃任务数未满，且有排队任务，启动下一个
    logger.debug("进入文件队列管理")
    while (
      this.activeFileTasks.size <= this.fileMaxConcurrent
      && this.pendingFileTasks.length > 0
    ) {
      const taskId = this.pendingFileTasks.shift(); // 取出队首任务
      const taskManager = this.tasks.get(taskId);
      if (!taskManager) continue;

      // 标记为活跃任务
      this.activeFileTasks.add(taskId);
      logger.debug(`启动任务[${taskId}]，当前活跃文件数：${this.activeFileTasks.size}`);

      // 启动上传（失败不影响队列继续）
      try {
        await taskManager.start();
      } catch (error) {
        logger.error(`任务[${taskId}]启动失败：`, error);
        this.activeFileTasks.delete(taskId);
        this.processFileQueue(); // 继续处理下一个
      }
    }
  }

  // 暂停上传
  async pauseUpload(taskId) {
    logger.warn("暂停上传");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`暂停失败：任务[${taskId}]不存在`);
      return;
    }

    await taskManager.pause();
    // 从活跃队列移除，触发下一个任务
    this.activeFileTasks.delete(taskId);
    this.processFileQueue();
  }
  // 恢复上传
  async resumeUpload(taskId) {
    logger.warn("恢复上传");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`恢复失败：任务[${taskId}]不存在`);
      return;
    }
    try {
      // 第一步：调用taskManager.retry()重置状态为pending
      await taskManager.resume();

      // 第二步：将任务加入等待队列，由processFileQueue按并发数启动
      this.pendingFileTasks.push(taskId);
      logger.debug(`任务[${taskId}]已加入恢复队列，当前排队数：${this.pendingFileTasks.length}`);

      // 第三步：触发队列处理（检查是否可立即启动）
      this.processFileQueue();
    } catch (error) {
      logger.error(`任务[${taskId}]重置状态失败：`, error);
    }
  }
  // 重试上传
  async retryUpload(taskId) {
    logger.warn("重试上传");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`重试失败：任务[${taskId}]不存在`);
      return;
    }
    try {
      // 第一步：调用taskManager.retry()重置状态为pending
      await taskManager.retry();

      // 第二步：将任务加入等待队列，由processFileQueue按并发数启动
      this.pendingFileTasks.push(taskId);
      logger.debug(`任务[${taskId}]已加入重试队列，当前排队数：${this.pendingFileTasks.length}`);

      // 第三步：触发队列处理（检查是否可立即启动）
      this.processFileQueue();
    } catch (error) {
      logger.error(`任务[${taskId}]重置状态失败：`, error);
    }
  }
  // 取消上传
  async cancelUpload(taskId) {
    logger.warn("取消上传");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`取消失败：任务[${taskId}]不存在`);

      return;
    }

    await taskManager.cancel();
    // 从内存和数据库移除
    this.tasks.delete(taskId);
    this.activeFileTasks.delete(taskId);
    this.pendingFileTasks = this.pendingFileTasks.filter(id => id !== taskId);
    await db.deleteUploadRecord(taskId);

    // 触发下一个任务
    this.processFileQueue();
  }
  adjustPoolConcurrent() {
    const speedMBps = parseFloat(this.networkMonitor.getFormattedSpeed()) || 0;
    let newMax;

    if (speedMBps > 20) {
      newMax = 10; // 超高速：10并发
    } else if (speedMBps > 10) {
      newMax = 8; // 高速：8并发
    } else if (speedMBps > 5) {
      newMax = 6; // 中速：6并发
    } else {
      newMax = 4; // 低速：4并发（避免请求堆积）
    }

    if (newMax !== requestPool.maxConcurrent) {
      requestPool.setMaxConcurrent(newMax);
      logger.debug(`根据网速[${speedMBps}MB/s]调整连接池最大并发为：${newMax}`);
    }
  }
  // 原有方法不变
  getTask(taskId) {
    return this.tasks.get(taskId) || null;
  }


  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}