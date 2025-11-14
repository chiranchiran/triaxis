
export class NetworkMonitor {
  constructor() {
    this.speed = 0; // 实时网络速度（字节/秒）
    this.lastUpdate = 0;
    this.lastLoaded = 0;
    this.speedSamples = [];
    this.maxSamples = 10;
    this.fileTotalSize = 0; // 待上传文件总大小（字节，需外部传入基础信息）
  }

  /**
   * 唯一需要外部传入的基础信息：文件总大小（上传前调用1次）
   * @param {number} totalSize - 文件总大小（字节，如 500*1024*1024 表示500MB）
   */
  setFileTotalSize(totalSize) {
    this.fileTotalSize = totalSize > 0 ? totalSize : 0;
  }

  /**
   * 核心1：自动计算最优 chunk 大小（无需手动传，内部动态算）
   * @returns {number} - 最优 chunk 大小（字节）
   */
  calculateOptimalChunkSize() {
    if (this.fileTotalSize === 0) throw new Error('请先设置文件总大小');

    const speedMBps = this.speed / 1024 / 1024; // 网络速度（MB/s）
    const fileSizeMB = this.fileTotalSize / 1024 / 1024; // 文件总大小（MB）

    // 核心计算规则：按文件大小+网络速度动态匹配，确保chunk总数在20-50个（最优范围）
    if (fileSizeMB < 100) {
      // 小文件（<100MB）：固定小chunk，避免请求过少
      return 5 * 1024 * 1024; // 5MB
    } else if (fileSizeMB < 1024) {
      // 中文件（100MB-1GB）：按网络速度调整
      if (speedMBps > 20) return 50 * 1024 * 1024; // 高速：50MB（约20个chunk）
      if (speedMBps > 10) return 30 * 1024 * 1024; // 中高速：30MB（约33个chunk）
      if (speedMBps > 5) return 20 * 1024 * 1024;  // 中速：20MB（约50个chunk）
      return 10 * 1024 * 1024; // 低速：10MB（避免超时）
    } else {
      // 大文件（>1GB）：chunk大小上限50MB，避免单个chunk太大超时
      if (speedMBps > 30) return 50 * 1024 * 1024; // 超高速：50MB
      if (speedMBps > 15) return 30 * 1024 * 1024; // 高速：30MB
      return 20 * 1024 * 1024; // 中低速：20MB（约50个chunk）
    }
  }

  /**
   * 核心2：自动计算最优并发数（基于上面算好的chunk大小+网络速度）
   * @returns {number} - 最优并发数（1-6）
   */
  getOptimalConcurrency() {
    if (this.fileTotalSize === 0) throw new Error('请先设置文件总大小');

    const speedMBps = this.speed / 1024 / 1024;
    const optimalChunkSize = this.calculateOptimalChunkSize();
    const chunkSizeMB = optimalChunkSize / 1024 / 1024;

    // 并发数与chunk大小联动（大chunk可高并发，小chunk低并发）
    if (chunkSizeMB >= 30) return speedMBps > 15 ? 6 : 5; // 大chunk：5-6并发
    if (chunkSizeMB >= 10) return speedMBps > 10 ? 5 : 4; // 中chunk：4-5并发
    return speedMBps > 5 ? 3 : 2; // 小chunk：2-3并发
  }

  /**
   * 一键获取所有计算结果（chunk大小+并发数，方便外部调用）
   * @returns {object} - { chunkSize: 字节, concurrency: 数量 }
   */
  getCalculationResult() {
    return {
      chunkSize: this.calculateOptimalChunkSize(),
      concurrency: this.getOptimalConcurrency()
    };
  }

  // 原有：实时更新网络速度（上传过程中调用，喂数据给工具）
  updateSpeed(loaded, total) {
    const now = Date.now();
    if (this.lastUpdate > 0) {
      const timeDiff = (now - this.lastUpdate) / 1000;
      const loadedDiff = loaded - this.lastLoaded;
      if (timeDiff > 0) {
        this.speedSamples.push(loadedDiff / timeDiff);
        if (this.speedSamples.length > this.maxSamples) this.speedSamples.shift();
        this.speed = this.speedSamples.reduce((sum, s) => sum + s, 0) / this.speedSamples.length;
      }
    }
    this.lastUpdate = now;
    this.lastLoaded = loaded;
  }

  // 辅助：获取当前网络速度（字节/秒）
  getCurrentSpeed() {
    return this.speed;
  }

  // 重置工具状态
  reset() {
    this.speed = 0;
    this.lastUpdate = 0;
    this.lastLoaded = 0;
    this.speedSamples = [];
    this.fileTotalSize = 0;
  }
}