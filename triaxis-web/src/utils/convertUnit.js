//将字节数转换为易读的文件大小格式（B/KB/MB/GB/TB/PB）
function converBytes(bytesSize) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  // 处理输入为非数字的情况，默认转为0
  let currentSize = Number(bytesSize) || 0;
  let unitIndex = 0;
  while (currentSize >= 1024 && unitIndex < units.length - 1) {
    currentSize /= 1024;
    unitIndex++;
  }

  return `${currentSize.toFixed(1)} ${units[unitIndex]}`;
}
export { converBytes }
