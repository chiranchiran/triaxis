export const isDataValid = (data) => {
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