import { db } from '../db/db.js';
import { DownloadTaskManager } from './downloadTaskManager.js';
import { NetworkMonitor } from './networkMonitor.js';
import { logger } from '../logger.js';
import { requestPool } from './requestPool.js';

export class DownloadManager {
  constructor() {
    this.config = {
      maxRetries: 3,
      chunkSize: 10 * 1024 * 1024, // 默认10MB
    };

    // 文件级最大并发数
    this.fileMaxConcurrent = 3;
    this.tasks = new Map();
    this.activeFileTasks = new Set();
    this.pendingFileTasks = [];
    this.isInitialized = false;
    this.networkMonitor = new NetworkMonitor();
  }

  // 初始化
  async initialize() {
    if (this.isInitialized) return;

    try {
      // 从数据库恢复所有未完成的下载任务
      const pendingRecords = await db.getAllActiveDownloads();
      for (const record of pendingRecords) {
        logger.debug(`恢复下载任务[${record.id}]：文件ID ${record.fileId}`);

        // 重新创建任务管理器
        const taskManager = new DownloadTaskManager(
          record.id,
          record.fileId, // 使用文件ID
          {
            maxRetries: this.config.maxRetries,
            chunkSize: record.chunkSize || this.config.chunkSize
          }
        );

        // 恢复任务状态
        taskManager.task = {
          ...taskManager.task,
          fileName: record.fileName,
          progress: record.progress,
          downloadedChunks: record.downloadedChunks || [],
          totalChunks: record.totalChunks,
          fileSize: record.fileSize,
          status: 'paused'
        };

        this.tasks.set(record.id, taskManager);
        this.setupTaskEventListeners(taskManager);
      }

      logger.debug(`下载管理器初始化完成，共恢复${pendingRecords.length}个未完成任务`);
    } catch (error) {
      logger.error('下载管理器初始化失败：', error);
    }

    this.isInitialized = true;
    this.adjustPoolConcurrent();
  }

  // 添加下载任务 - 使用文件ID
  async addDownload(fileId) {
    if (!this.isInitialized) {
      throw new Error('请先初始化DownloadManager');
    }

    // 动态计算chunkSize
    // this.networkMonitor.setFileTotalSize(0); // 初始设为0，后续在检查文件信息后更新
    // const { chunkSize } = this.networkMonitor.getCalculationResult();
    // this.config.chunkSize = chunkSize;
    // logger.debug("当前下载chunkSize是", chunkSize);

    // 创建下载任务
    const taskId = this.generateTaskId();
    const taskManager = new DownloadTaskManager(
      taskId,
      fileId, // 使用文件ID
      this.config
    );

    this.tasks.set(taskId, taskManager);

    // 设置任务事件监听
    this.setupTaskEventListeners(taskManager);

    // 保存到数据库（初始状态）
    await db.saveDownloadRecord({
      id: taskId,
      fileId: fileId, // 存储文件ID
      fileName: '', // 文件名将在检查文件信息后设置
      fileSize: 0,
      totalChunks: 0,
      downloadedChunks: [],
      status: 'pending',
      progress: 0,
      chunkSize: this.config.chunkSize,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 添加到等待队列
    this.pendingFileTasks.push(taskId);
    logger.debug(`文件[ID: ${fileId}]已加入下载队列，任务ID：${taskId}`);

    this.processFileQueue();

    return taskManager;
  }

  // 设置任务事件监听
  setupTaskEventListeners(taskManager) {
    // 监听任务进度，更新全局网络速度
    taskManager.on('progress', (progress, task) => {
      if (task.fileSize > 0) {
        const loaded = (progress / 100) * task.fileSize;
        this.networkMonitor.updateSpeed(loaded, task.fileSize);
        this.adjustPoolConcurrent();
      }
    });

    // 监听任务结束，启动下一个任务
    ['success', 'error', 'cancelled'].forEach(event => {
      taskManager.on(event, (task) => {
        this.activeFileTasks.delete(task.id);
        this.processFileQueue();
      });
    });
  }

  // 处理文件下载队列
  async processFileQueue() {
    logger.debug("进入下载文件队列管理");

    while (
      this.activeFileTasks.size < this.fileMaxConcurrent &&
      this.pendingFileTasks.length > 0
    ) {
      const taskId = this.pendingFileTasks.shift();
      const taskManager = this.tasks.get(taskId);

      if (!taskManager) continue;

      this.activeFileTasks.add(taskId);
      logger.debug(`启动下载任务[${taskId}]，当前活跃文件数：${this.activeFileTasks.size}`);

      try {
        await taskManager.start();
      } catch (error) {
        logger.error(`下载任务[${taskId}]启动失败：`, error);
        this.activeFileTasks.delete(taskId);
        this.processFileQueue();
      }
    }
  }

  // 暂停下载
  async pauseDownload(taskId) {
    logger.warn("暂停下载");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`暂停失败：下载任务[${taskId}]不存在`);
      return;
    }

    await taskManager.pause();
    this.activeFileTasks.delete(taskId);
    this.processFileQueue();
  }

  // 恢复下载
  async resumeDownload(taskId) {
    logger.warn("恢复下载");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`恢复失败：下载任务[${taskId}]不存在`);
      return;
    }

    try {
      await taskManager.resume();
      this.pendingFileTasks.push(taskId);
      this.processFileQueue();
    } catch (error) {
      logger.error(`下载任务[${taskId}]恢复失败：`, error);
    }
  }

  // 重试下载
  async retryDownload(taskId) {
    logger.warn("重试下载");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`重试失败：下载任务[${taskId}]不存在`);
      return;
    }

    try {
      await taskManager.retry();
      this.pendingFileTasks.push(taskId);
      this.processFileQueue();
    } catch (error) {
      logger.error(`下载任务[${taskId}]重试失败：`, error);
    }
  }

  // 取消下载
  async cancelDownload(taskId) {
    logger.warn("取消下载");
    const taskManager = this.tasks.get(taskId);
    if (!taskManager) {
      logger.warn(`取消失败：下载任务[${taskId}]不存在`);
      return;
    }

    await taskManager.cancel();
    this.tasks.delete(taskId);
    this.activeFileTasks.delete(taskId);
    this.pendingFileTasks = this.pendingFileTasks.filter(id => id !== taskId);
    await db.deleteDownloadRecord(taskId);

    this.processFileQueue();
  }

  // 动态调整连接池并发数
  adjustPoolConcurrent() {
    const speedMBps = parseFloat(this.networkMonitor.getFormattedSpeed()) || 0;
    let newMax;

    if (speedMBps > 20) {
      newMax = 10;
    } else if (speedMBps > 10) {
      newMax = 8;
    } else if (speedMBps > 5) {
      newMax = 6;
    } else {
      newMax = 4;
    }

    if (newMax !== requestPool.maxConcurrent) {
      requestPool.setMaxConcurrent(newMax);
      logger.debug(`根据下载网速[${speedMBps}MB/s]调整连接池最大并发为：${newMax}`);
    }
  }

  // 获取任务
  getTask(taskId) {
    return this.tasks.get(taskId) || null;
  }

  // 获取所有任务
  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  // 生成任务ID
  generateTaskId() {
    return `download_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // 销毁管理器
  destroy() {
    this.activeFileTasks.forEach(taskId => {
      const task = this.tasks.get(taskId);
      if (task) {
        task.cancel().catch(error => {
          logger.error(`销毁时取消任务[${taskId}]失败：`, error);
        });
      }
    });

    this.tasks.clear();
    this.activeFileTasks.clear();
    this.pendingFileTasks = [];
    this.isInitialized = false;
  }
}

// 创建全局下载管理器实例
export const downloadManager = new DownloadManager();