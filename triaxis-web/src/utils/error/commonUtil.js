export const isDataValid = (data) => {
  return Array.isArray(data) && data.length > 0;
};
/**
 * 截断字符串，中间用省略号显示
 * @param {string} str - 需要截断的原字符串（如用户名）
 * @param {number} maxLength - 最大显示长度（包含省略号）
 * @param {string} ellipsis - 省略符号（默认 '...'）
 * @returns {string} 截断后的字符串
 */
export const subUsername = (str, maxLength, ellipsis = '...') => {
  // 处理边界情况：原字符串长度 <= 最大长度，直接返回
  if (str.length <= maxLength) {
    return str;
  }

  // 处理省略符号长度超过最大长度的情况（避免无效截断）
  if (ellipsis.length >= maxLength) {
    console.warn('省略符号长度不能大于等于最大长度');
    return str.slice(0, maxLength); // 极端情况：直接截断到最大长度
  }

  // 计算首尾保留的字符长度（总长度 = 首 + 省略号 + 尾 = maxLength）
  const remainingLength = maxLength - ellipsis.length; // 首尾共需分配的长度
  const startLength = Math.floor(remainingLength / 2); // 首部分配的长度
  const endLength = remainingLength - startLength; // 尾部分配的长度（可能比首多1，保证总和正确）

  // 截取首尾并拼接省略号
  const startStr = str.slice(0, startLength);
  const endStr = str.slice(-endLength); // 从末尾截取endLength长度

  return `${startStr}${ellipsis}${endStr}`;
}