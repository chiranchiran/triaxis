import { downloadChunk } from "../../api/modules/common";
import { logger } from "../logger";
import { NetworkMonitor } from "./networkMonitor";
import { requestPool } from "./requestPool";

/**
 * 分片下载管理器：处理单个文件的分片下载、重试、事件触发
 */
export class ChunkDownloader {
  constructor(config, addCancelFn) {
    this.maxRetries = config.maxRetries || 3;
    this.eventCallbacks = new Map();
    this.addCancelFn = addCancelFn;
    this.taskId = config.taskId;
    this.isPaused = false;
    this.downloadedChunks = new Map(); // 存储已下载的分片数据
  }

  // 批量下载分片
  async downloadChunks(chunks, fileId, taskId, chunkSize) {
    if (chunks.length === 0) {
      this.emit('complete', this.downloadedChunks);
      return;
    }
    if (this.isPaused) {
      return;
    }

    // 所有分片请求包装成Promise函数
    const chunkPromises = chunks.map(chunk => {
      return async () => {
        return await this.downloadSingleChunk(chunk, fileId, taskId, chunkSize);
      };
    });

    // 批量添加到连接池
    await Promise.all(
      chunkPromises.map(promiseFn => requestPool.addRequest(promiseFn, this.taskId))
    );

    // 全部完成后触发complete，传递所有分片数据
    this.emit('complete', this.downloadedChunks);
  }

  // 下载单个分片+重试
  async downloadSingleChunk(chunk, fileId, taskId, chunkSize) {
    if (this.isPaused) return;

    const { index } = chunk;

    try {
      const response = await downloadChunk(
        fileId, // 文件ID
        index,
        chunkSize,
        (onCancelFunc) => {
          this.addCancelFn(onCancelFunc);
          logger.debug(`任务[${this.taskId}]下载分片[${index}]取消函数已存储`);
        }
      );

      // 存储分片数据
      this.downloadedChunks.set(index, response);
      this.emit('chunkSuccess', index);
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.debug(`任务[${this.taskId}]下载分片[${index}]已取消`);
        throw error;
      }

      // 重试逻辑
      if (chunk.retryCount < this.maxRetries) {
        chunk.retryCount++;
        logger.debug(`分片[${index}]下载失败，重试第${chunk.retryCount}次（原因：${error.message}）`);
        return await this.downloadSingleChunk(chunk, fileId, taskId, chunkSize);
      }

      // 重试耗尽，触发失败事件
      this.emit('chunkError', index, error);
      throw new Error(`分片[${index}]下载失败（已重试${this.maxRetries}次）`);
    }
  }

  pause(taskId) {
    this.isPaused = true;
    requestPool.clearQueueByTaskId(taskId);
    this.emit('paused');
    logger.debug('分片下载已暂停');
  }

  retry() {
    this.isPaused = false;
  }

  cancel(taskId) {
    this.isPaused = true;
    requestPool.clearQueueByTaskId(taskId);
    // 清空已下载的分片数据
    this.downloadedChunks.clear();
    this.emit('cancelled');
    logger.debug(`任务[${this.taskId}]的分片下载已取消`);
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
          logger.debug(`下载事件 ${event} 回调失败:`, error);
        }
      });
    }
  }
}