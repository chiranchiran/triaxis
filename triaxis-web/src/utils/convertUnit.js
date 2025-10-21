/**
 * 将字节数转换为易读的文件大小格式（B/KB/MB/GB/TB/PB）
 * @param {number} bytesSize - 待转换的字节数（整数或浮点数）
 * @returns {string} 格式化后的文件大小字符串，如 "1.46 KB"
 */
function converBytes(bytesSize) {
  // 定义单位数组，从字节到PB
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  // 处理输入为非数字的情况，默认转为0
  let currentSize = Number(bytesSize) || 0;
  let unitIndex = 0;

  // 循环转换单位直到当前大小小于1024或达到最大单位
  while (currentSize >= 1024 && unitIndex < units.length - 1) {
    currentSize /= 1024;
    unitIndex++;
  }

  // 保留两位小数并拼接单位
  return `${currentSize.toFixed(1)} ${units[unitIndex]}`;
}
export { converBytes }
