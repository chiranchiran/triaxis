/**
 * 网络监控器：计算网络速度，动态推荐最优分片大小和并发数
 */
export class NetworkMonitor {
  constructor() {
    this.speed = 0; // 实时网络速度（字节/秒）
    this.lastUpdate = 0; // 上次更新时间（毫秒）
    this.lastLoaded = 0; // 上次已加载字节数
    this.speedSamples = []; // 速度样本（用于平滑计算）
    this.maxSamples = 10; // 最大样本数
    this.fileTotalSize = 0; // 待上传文件总大小（字节）
    this.fileConcurrent = 1; // 当前文件并发数（由UploadManager传入）
  }

  /**
   * 设置文件总大小（上传前调用）
   * @param {number} totalSize - 文件总大小（字节）
   */
  setFileTotalSize(totalSize) {
    this.fileTotalSize = totalSize > 0 ? totalSize : 0;
  }

  /**
   * 设置基础配置（文件大小+文件并发数）
   * @param {number} fileSize - 文件大小（字节）
   * @param {number} concurrent - 文件并发数
   */
  setBaseConfig(fileSize, concurrent) {
    this.fileTotalSize = fileSize > 0 ? fileSize : 0;
    this.fileConcurrent = concurrent > 0 ? concurrent : 1;
  }

  /**
   * 计算最优分片大小（字节）
   * 多文件并发时自动放大分片，减少总请求数
   */
  calculateOptimalChunkSize() {
    if (this.fileTotalSize === 0) {
      throw new Error('请先设置文件总大小（setFileTotalSize）');
    }

    const speedMBps = this.speed / 1024 / 1024; // 网络速度（MB/s）
    const fileSizeMB = this.fileTotalSize / 1024 / 1024; // 文件大小（MB）
    const fileConcurrentFactor = this.fileConcurrent > 2 ? 1.5 : 1; // 多文件并发放大因子

    // 小文件（<100MB）
    if (fileSizeMB < 100) {
      const baseChunk = 5 * 1024 * 1024; // 5MB
      return Math.min(baseChunk * fileConcurrentFactor, 10 * 1024 * 1024); // 上限10MB
    }

    // 中文件（100MB-1GB）
    if (fileSizeMB < 1024) {
      let baseChunk;
      if (speedMBps > 20) baseChunk = 50 * 1024 * 1024; // 50MB
      else if (speedMBps > 10) baseChunk = 30 * 1024 * 1024; // 30MB
      else if (speedMBps > 5) baseChunk = 20 * 1024 * 1024; // 20MB
      else baseChunk = 10 * 1024 * 1024; // 10MB

      // 多文件并发时放大，上限60MB
      const optimizedChunk = baseChunk * fileConcurrentFactor;
      return Math.min(optimizedChunk, 60 * 1024 * 1024);
    }

    // 大文件（>1GB）
    if (speedMBps > 30) return 50 * 1024 * 1024; // 50MB
    else if (speedMBps > 15) return 30 * 1024 * 1024; // 30MB
    else return 20 * 1024 * 1024; // 20MB
  }

  /**
   * 计算最优分片并发数（单个文件）
   * 受全局连接池和文件并发数限制
   */
  getOptimalConcurrency() {
    if (this.fileTotalSize === 0) {
      throw new Error('请先设置文件总大小（setFileTotalSize）');
    }

    const speedMBps = this.speed / 1024 / 1024;
    const chunkSize = this.calculateOptimalChunkSize();
    const chunkSizeMB = chunkSize / 1024 / 1024;
    const browserMax = 6; // 浏览器同域最大并发请求数
    // 单个文件最大允许的分片并发 = 浏览器限制 / 文件并发数（向上取整）
    const maxAllowed = Math.ceil(browserMax / this.fileConcurrent);

    // 结合chunk大小和网速调整
    if (chunkSizeMB >= 30) {
      return speedMBps > 15 ? Math.min(5, maxAllowed) : Math.min(4, maxAllowed);
    } else if (chunkSizeMB >= 10) {
      return speedMBps > 10 ? Math.min(4, maxAllowed) : Math.min(3, maxAllowed);
    } else {
      return speedMBps > 5 ? Math.min(3, maxAllowed) : Math.min(2, maxAllowed);
    }
  }

  /**
   * 获取计算结果（分片大小+并发数）
   */
  getCalculationResult() {
    return {
      chunkSize: this.calculateOptimalChunkSize(),
      concurrency: this.getOptimalConcurrency()
    };
  }

  /**
   * 更新网络速度（上传过程中调用）
   * @param {number} loaded - 当前已加载字节数
   * @param {number} total - 总字节数
   */
  updateSpeed(loaded, total) {
    const now = Date.now();
    if (this.lastUpdate === 0 || loaded <= this.lastLoaded) {
      this.lastUpdate = now;
      this.lastLoaded = loaded;
      return;
    }

    const timeDiff = (now - this.lastUpdate) / 1000; // 时间差（秒）
    const loadedDiff = loaded - this.lastLoaded; // 加载差（字节）

    // 过滤短时间波动（<100ms）
    if (timeDiff < 0.1) return;

    // 计算当前速度（字节/秒）
    const currentSpeed = loadedDiff / timeDiff;
    // 过滤异常值（超过当前平均速度3倍）
    const isAbnormal = this.speedSamples.length > 0 && currentSpeed > this.speed * 3;

    if (!isAbnormal) {
      this.speedSamples.push(currentSpeed);
      // 保持样本数
      if (this.speedSamples.length > this.maxSamples) {
        this.speedSamples.shift();
      }
      // 计算平均速度（平滑）
      this.speed = this.speedSamples.reduce((sum, s) => sum + s, 0) / this.speedSamples.length;
    }

    this.lastUpdate = now;
    this.lastLoaded = loaded;
  }

  /**
   * 获取当前网络速度（字节/秒）
   */
  getCurrentSpeed() {
    return this.speed;
  }

  /**
   * 获取格式化后的网速（MB/s）
   */
  getFormattedSpeed() {
    return (this.speed / 1024 / 1024).toFixed(2);
  }

  /**
   * 重置监控器状态
   */
  reset() {
    this.speed = 0;
    this.lastUpdate = 0;
    this.lastLoaded = 0;
    this.speedSamples = [];
    this.fileTotalSize = 0;
    this.fileConcurrent = 1;
  }
}