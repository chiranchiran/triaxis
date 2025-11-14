import { logger } from '../logger.js';

// 全局单例请求连接池
export class RequestPool {
  constructor() {
    this.maxConcurrent = 8; // 全局最大并发请求数
    this.pendingQueue = []; // 待执行请求队列
    this.runningCount = 0; // 当前运行的请求数
  }

  // 单例模式：确保全局唯一
  static getInstance() {
    if (!RequestPool.instance) {
      RequestPool.instance = new RequestPool();
    }
    return RequestPool.instance;
  }

  // 添加请求到连接池
  addRequest(requestFn, taskId) {
    return new Promise((resolve, reject) => {
      const wrappedRequest = async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.runningCount--;
          this.processNext(); // 执行下一个请求
        }
      };

      // 给请求绑定任务ID，方便取消时过滤
      wrappedRequest.taskId = taskId;
      this.pendingQueue.push(wrappedRequest);
      this.processNext();
    });
  }

  // 处理队列中的下一个请求
  processNext() {
    if (this.runningCount < this.maxConcurrent && this.pendingQueue.length > 0) {
      const nextRequest = this.pendingQueue.shift();
      this.runningCount++;
      nextRequest();
      logger.debug(`连接池：当前并发=${this.runningCount}，等待队列=${this.pendingQueue.length}`);
    }
  }

  // 动态调整最大并发数（联动NetworkMonitor）
  setMaxConcurrent(max) {
    this.maxConcurrent = Math.max(1, Math.min(max, 10));
    this.processNext();
  }

  // 按任务ID清空队列中的待执行请求（支持取消文件上传）
  clearQueueByTaskId(taskId) {
    this.pendingQueue = this.pendingQueue.filter(req => req.taskId !== taskId);
    logger.debug(`连接池：已清空任务${taskId}的待执行请求`);
  }
}

// 导出全局单例
export const requestPool = RequestPool.getInstance();