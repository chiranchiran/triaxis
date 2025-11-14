export const fileConfig = {
  1: { // 资源文件
    maxCount: 10,
    maxSize: 5 * 1024 * 1024 * 1024, // 5G
    accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif,.psd,.vmdk',
    types: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'rar', 'jpg', 'jpeg', 'png', 'gif', 'psd', 'vmdk']
  },
  2: { // 课程文件
    maxCount: 1,
    maxSize: 5 * 1024 * 1024 * 1024, // 2GB
    accept: 'video/*,.mp4,.avi,.mov,.wmv,.flv,.mkv',
    types: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
  },
  3: { // 封面图片
    maxCount: 1,
    maxSize: 50 * 1024 * 1024,
    accept: 'image/*,.jpg,.jpeg,.png,.gif,.webp',
    types: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
  4: { // 预览图片
    maxCount: 4,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: 'image/*,.jpg,.jpeg,.png,.gif,.webp',
    types: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  }
};