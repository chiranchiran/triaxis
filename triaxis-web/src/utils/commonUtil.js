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