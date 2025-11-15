
import { uploadChunk } from "../../api/modules/common";
import { logger } from "../logger";
import { NetworkMonitor } from "./networkMonitor";
import { requestPool } from "./requestPool";


/**
 * 分片上传管理器：处理单个文件的分片上传、重试、事件触发
 * 依赖全局连接池管控并发
 */
export class ChunkUploader {
  constructor(config, addCancelFn) {
    //一个chunck最大重试次数
    this.maxRetries = config.maxRetries || 3;
    // 事件回调存储（progress/chunkSuccess等）
    this.eventCallbacks = new Map();
    this.addCancelFn = addCancelFn;
    this.taskId = config.taskId;
    this.isPaused = false;
  }


  //批量上传chuncks
  async uploadChunks(chunks, fileHash, fileName, file) {
    console.log(chunks, fileHash, fileName, file)
    if (chunks.length === 0) {
      this.emit('complete');
      return;
    }
    if (this.isPaused) {
      return;
    }

    // 所有分片请求包装成Promise函数，通过连接池调度
    const chunkPromises = chunks.map(chunk => {
      return async () => {
        // 执行单个分片上传（带重试）
        return await this.uploadSingleChunk(chunk, fileHash, fileName, file);
      };
    });

    // 批量添加到连接池，等待执行
    await Promise.all(
      chunkPromises.map(promiseFn => requestPool.addRequest(promiseFn, this.taskId))
    );
    // 全部完成后触发complete
    this.emit('complete');
  }
  // 上传单个分片+重试
  async uploadSingleChunk(chunk, fileHash, fileName, file) {
    if (this.isPaused) return;
    // const { index, blob } = chunk;
    // const formData = new FormData();
    // formData.append('chunk', blob);
    // formData.append('hash', fileHash);
    // formData.append('fileName', fileName);
    // formData.append('index', index);
    const { index, start, end } = chunk;
    // 上传时才动态切分Blob（流式核心：按需生成，不上传不占用内存）
    const blob = file.slice(start, end);
    const formData = new FormData();
    formData.append('chunk', blob);
    formData.append('hash', fileHash);
    formData.append('fileName', fileName);
    formData.append('index', index);
    try {
      // 调用后端分片上传接口
      const response = await uploadChunk(formData, (onCancelFunc) => {
        // 在调用接口的同时，相当于同时调用了传入的这个函数，又能同时拿到返回的取消方法去赋值
        this.addCancelFn(onCancelFunc);
        logger.debug(`任务[${this.taskId}]分片[${index}]取消函数已存储`);
      });
      this.emit('chunkSuccess', index); // 触发分片成功事件
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.debug(`任务[${taskId}]分片[${index}]上传已取消`);
        throw error;
      }
      // 重试逻辑
      if (chunk.retryCount < this.maxRetries) {
        chunk.retryCount++;
        logger.debug(`分片[${index}]上传失败，重试第${chunk.retryCount}次（原因：${error.message}）`);
        return await this.uploadSingleChunk(chunk, fileHash, fileName); // 递归重试
      }
      // 重试耗尽，触发失败事件
      this.emit('chunkError', index, error);
      throw new Error(`分片[${index}]上传失败（已重试${this.maxRetries}次）`);
    }
  }

  pause(taskId) {
    this.isPaused = true;
    requestPool.clearQueueByTaskId(taskId);// 清空连接池中的待执行请求
    this.emit('paused');
    logger.debug('分片上传已暂停');
  }
  retry() {
    this.isPaused = false;
  }

  cancel(taskId) {
    this.isPaused = true;
    requestPool.clearQueueByTaskId(taskId); // 清空连接池中的待执行请求
    this.emit('cancelled');
    logger.debug(`任务[${taskId}]的分片上传已取消`);
  }

  //事件订阅,监听分片进度、失败，把回调函数加入数组
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }
  //事件取消订阅 ,监听分片进度、失败，把回调函数移除数组
  off(event, callback) {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  //触发事件，执行所有订阅的回调
  emit(event, ...args) {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          logger.debug(`chunck失败的回调函数 ${event}:`, error);
        }
      });
    }
  }
}