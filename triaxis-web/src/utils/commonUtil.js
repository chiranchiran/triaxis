export const isArrayValid = (data) => {
  return Array.isArray(data) && data.length > 0;
};
//截断字符串，中间用省略号显示
export const subUsername = (str, maxLength, ellipsis = '...') => {
  if (str.length <= maxLength) {
    return str;
  }
  if (ellipsis.length >= maxLength) {
    console.warn('省略符号长度不能大于等于最大长度');
    return str.slice(0, maxLength);
  }
  const remainingLength = maxLength - ellipsis.length;
  const startLength = Math.floor(remainingLength / 2);
  const endLength = remainingLength - startLength;
  const startStr = str.slice(0, startLength);
  const endStr = str.slice(-endLength);

  return `${startStr}${ellipsis}${endStr}`;
}

//提取后缀名
export const getFileExtension = (filename) => {
  const pureName = filename.split(/[\\/]/).pop();
  // 匹配最后一个点后的所有字符（支持多个点）
  const match = pureName.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : '';
}

//过滤数组null,[null]/[undefined]都变成null
export const filterNull = (obj) => {
  // 若输入不是对象（或为 null/undefined），直接返回原值
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const newObj = { ...obj };

  for (const key in newObj) {
    if (!newObj.hasOwnProperty(key)) continue;
    const value = newObj[key];
    // 检查是否为数组，且长度为 1，且元素是 null 或 undefined
    if (
      Array.isArray(value) &&
      value.length === 1 &&
      (value[0] === null || value[0] === undefined)
    ) {
      newObj[key] = null;
    }
  }

  return newObj;
};

//给数组添加全部选项
export const addAll = (type, id = null) => {
  return isArrayValid(type)
    ? [{ id, name: '全部' }, ...type]
    : (type || [])
};
//提取文件上传信息
export const getFile = (list) => {
  if (!isArrayValid(list)) return null
  return list.map(item => ({
    uid: item.uid,
    type: item.type,
    name: item.name,
    size: item.size,
    path: item.path
  }))
}
export const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
export const getLastPathSegment = (pathname) => {
  // 2. 去除路径首尾的斜杠，避免空字符串（如 "/user/profile/" → "user/profile"）
  const trimmedPath = pathname.trim('/');

  // 3. 分割路径为片段数组（如 "user/profile" → ["user", "profile"]）
  const segments = trimmedPath.split('/');

  // 4. 取最后一个片段（空路径返回空字符串）
  return segments[segments.length - 1] || '';
}

// utils/serializableUtil.js
/**
 * 清理文件对象中的不可序列化字段，确保可存入Redux
 * @param {Array} fileList - Upload组件的fileList数组
 * @returns {Array} 处理后的可序列化文件列表
 */
export const cleanFileList = (fileList) => {
  if (!Array.isArray(fileList)) return [];

  return fileList.map(file => {
    // 只保留需要的可序列化字段，过滤Date对象和非必要属性
    const {
      uid,
      name,
      status,
      url,
      response,
      percent,
      size,
      lastModified, // 保留时间戳（数字，可序列化），丢弃lastModifiedDate（Date对象）
      // 移除originFileObj（原始文件对象，可能包含非序列化属性）
    } = file;

    return {
      uid,
      name,
      status,
      url: url || (response?.path || ''), // 确保url有效
      percent: percent || 0,
      size: size || 0,
      lastModified: lastModified || 0, // 用时间戳替代Date对象
    };
  });
};
// 格式化时间
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 防抖函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
/**
 * 1. 生成安全的state（随机+标识+时间戳）
 */
export const generateSafeState = () => {
  const domain = window.location.hostname; // 子系统域名（防跨系统复用）
  const random = crypto.randomUUID(); // 不可猜测的随机值
  const timestamp = Date.now(); // 时间戳（有效期校验）
  const nonce = crypto.getRandomValues(new Uint32Array(1))[0].toString(); // 额外随机值
  return `${domain}_${random}_${timestamp}_${nonce}`;
};