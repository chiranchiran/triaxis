
import { uploadChunk } from "../../api/modules/common";
import { logger } from "../logger";
import { NetworkMonitor } from "./networkMonitor";


// 切片批量上传函数
export class ChunkUploader {
  constructor(config) {
    this.currentConcurrency = config.concurrency;
    //最多并发chunck数量
    // this.maxConcurrent = config.maxConcurrent;
    //一个chunck最大重试次数
    this.maxRetries = config.maxRetries;
    this.isPaused = false;
    this.isCancelled = false;
    //控制并发chunk的数量
    this.activeUploads = 0;
    this.eventCallbacks = new Map();
  }
  //批量上传chuncks
  async uploadChunks(chunks, fileHash, fileName) {
    this.isPaused = false;
    this.isCancelled = false;

    const queue = [...chunks];
    // 当待上传chuncks的数量>0、文件未暂停、取消上传的时候才上传
    //结合delay构成轮询
    while (queue.length > 0 && !this.isCancelled && !this.isPaused) {
      // 当前发送中的chunck数量大于最大并发数量的延迟100ms等待，注意可能这2行代码中间文件上传暂停或取消，再确保一次
      // 等待并发槽位
      while (this.activeUploads >= this.currentConcurrency && !this.isCancelled && !this.isPaused) {
        await this.delay(100);
      }

      if (this.isCancelled || this.isPaused) break;
      //从数组头部取一个chunk取传输
      const chunk = queue.shift();
      if (chunk) {
        // 单个分片上传 + 重试逻辑，失败时触发指数退避延迟
        this.uploadChunkWithRetry(chunk, fileHash, fileName).catch(error => {
          this.emit('切片上传失败', chunk.index, error);
        });
      }
    }
    //当前上传中的thunck数量>0和未取消、暂停的时候等待
    while (this.activeUploads > 0 && !this.isCancelled && !this.isPaused) {
      await this.delay(100);
    }

    if (!this.isCancelled && !this.isPaused) {
      this.emit('complete');
    }
  }
  // 单个分片上传+重试逻辑
  async uploadChunkWithRetry(chunk, fileHash, fileName) {
    let lastError;

    //attempt为发送次数
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      //检查当前文件的状态
      if (this.isCancelled || this.isPaused) {
        return;
      }

      try {
        chunk.status = 'uploading';
        this.emit('chunkStart', chunk.index);
        // 上传单个切片
        await this.uploadSingleChunk(chunk, fileHash, fileName, attempt);
        // 成功修改状态
        chunk.status = 'success';
        this.emit('chunkSuccess', chunk.index);
        return;

      } catch (error) {
        //失败记录错误、修改状态
        lastError = error;
        chunk.retryCount = attempt;
        chunk.status = 'error';

        logger.debug(`Chunk ${chunk.index} 上传失败(attempt ${attempt}):`, error);
        //重试，等待时间为指数退避策略
        if (attempt < this.config.maxRetries) {
          // 指数退避 + 网络状况考虑
          const backoffTime = 1000 * Math.pow(2, attempt - 1);
          const networkFactor = this.networkMonitor.getNetworkLevel() === 'poor' ? 2 : 1;
          await this.delay(backoffTime * networkFactor);
        }
      }
    }

    this.emit('error', new Error(`Chunk ${chunk.index} 上传失败在重试 ${this.config.maxRetries} 次之后，错误原因为 ${lastError.message}`));
  }
  // 真正上传单个切片的函数
  async uploadSingleChunk(chunk, fileHash, fileName, attempt) {
    this.activeUploads++;

    try {
      const formData = new FormData();
      formData.append('chunk', chunk.blob);
      formData.append('index', chunk.index.toString());
      formData.append('hash', fileHash);
      formData.append('fileName', fileName);
      formData.append('attempt', attempt.toString());

      const response = await uploadChunk({
        formData, onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            // 更新网络速度监控
            this.emit('progress', progress, chunk.index);
          }
        }
      })

    } catch (e) { throw new Error(`chuck上传服务器失败 ${e.message}`) }
    finally {
      this.activeUploads--;
    }
  }

  pause() {
    this.isPaused = true;
  }

  cancel() {
    this.isCancelled = true;
  }

  //并发等待
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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