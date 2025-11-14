import Dexie from 'dexie';

// 操作IndexedDB
export class UploadDatabase extends Dexie {
  constructor() {
    super('初始化数据库');
    this.version(1).stores({
      uploads: '&id, fileHash, fileName, status, createdAt'
    });
  }
  // 保存已上传chunks列表
  async saveUploadRecord(record) {
    const now = Date.now();
    await this.uploads.put({
      ...record,
      createdAt: now,
      updatedAt: now
    });
  }
  // 跟新文件上传进度
  async updateUploadProgress(id, progress, uploadedChunks) {
    await this.uploads.update(id, {
      progress,
      uploadedChunks,
      updatedAt: Date.now()
    });
  }
  // 更新上传状态
  async updateUploadStatus(id, status) {
    await this.uploads.update(id, {
      status,
      updatedAt: Date.now()
    });
  }
  // 获得某文件本地已上传chunk列表
  async getUploadRecord(fileHash) {
    return this.uploads.where('fileHash').equals(fileHash).first();
  }
  // 获得所有活跃的上传任务
  async getAllActiveUploads() {
    return this.uploads
      .where('status')
      .anyOf(['pending', 'uploading', 'paused'])
      .toArray();
  }
  // 删除上传chunks列表
  async deleteUploadRecord(id) {
    await this.uploads.delete(id);
  }
}

export const db = new UploadDatabase();