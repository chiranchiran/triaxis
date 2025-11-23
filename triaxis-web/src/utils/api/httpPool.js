import { logger } from "../logger";

class RequestPool {
  constructor() {
    // 正在请求的队伍
    this.pendingRequests = new Map();
  }

  // 生成请求唯一标识,URL+method+params/data序列化拼接，注意顺序问题
  generateRequestKey(config) {
    const { method, url, data, params } = config;

    // 基础key：方法 + URL
    let key = `${method}-${url}`;

    // 对于GET请求，考虑params
    if (method.toLowerCase() === 'get' && params) {
      try {
        const sortedParams = Object.keys(params)
          .sort()
          .map(k => `${k}=${JSON.stringify(params[k])}`)
          .join('&');
        key += `?${sortedParams}`;
      } catch (error) {
        logger.debug('参数序列化失败，使用默认key', { params, error });
      }
    }

    // 对于POST/PUT/PATCH请求，考虑data
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && data) {
      try {
        if (data instanceof FormData) {
          // FormData不纳入key计算
          key += '-formdata';
        } else {
          const sortedData = Object.keys(data)
            .sort()
            .map(k => `${k}=${JSON.stringify(data[k])}`)
            .join('&');
          key += `-${sortedData}`;
        }
      } catch (error) {
        logger.debug('数据序列化失败，使用默认key', { data, error });
      }
    }

    return key;
  }

  // 检查请求是否重复
  isDuplicateRequest(key) {
    return this.pendingRequests.has(key);
  }

  // 添加请求到池中
  addRequest(key, requestController) {
    // 如果已经有相同的请求在进行，直接返回false，表示不添加
    if (this.isDuplicateRequest(key)) {
      logger.debug('检测到重复请求，跳过执行', { key });
      return false;
    }

    // 添加到正在请求的队伍
    this.pendingRequests.set(key, requestController);
    logger.debug('请求已添加到池中', {
      key,
      pendingCount: this.pendingRequests.size
    });

    return true;
  }

  // 完成请求（成功或失败都调用）
  completeRequest(key) {
    logger.debug('请求完成，从池中移除', { key });
    this.pendingRequests.delete(key);

    logger.debug('请求池状态更新', {
      pendingCount: this.pendingRequests.size
    });
  }

  // 取消特定请求
  cancelRequest(key) {
    logger.debug('取消特定请求', { key });
    const controller = this.pendingRequests.get(key);
    if (controller) {
      controller.abort(); // 触发AbortSignal
      this.pendingRequests.delete(key);
      logger.debug('请求取消成功', { key });
      return true;
    }
    logger.debug('请求未找到，取消失败', { key });
    return false;
  }

  // 取消所有请求
  cancelAllRequests() {
    logger.debug('取消所有请求', { pendingCount: this.pendingRequests.size });
    this.pendingRequests.forEach(controller => controller.abort());
    this.pendingRequests.clear();
  }

  // 获取池状态
  getPoolStatus() {
    return {
      pendingCount: this.pendingRequests.size,
      pendingKeys: Array.from(this.pendingRequests.keys())
    };
  }
}

export const httpPool = new RequestPool();