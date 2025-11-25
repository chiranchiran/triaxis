import Dexie from 'dexie';
import { chunk } from 'lodash';

// 操作IndexedDB
export class UploadDatabase extends Dexie {
  constructor() {
    super('初始化数据库');
    this.version(1).stores({
      uploads: '&id, fileHash, fileName, status, createdAt,url',
      downloads: 'id, fileName, status, progress, createdAt'
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
  async updateUploadFileUrl(id, url) {
    await this.uploads.update(id, {
      url,
      updatedAt: Date.now()
    });
  }
  // 获得某文件本地已上传chunk列表
  async getUploadRecord(id) {
    return this.uploads.where('id').equals(id).first();
  }
  async getUploadedChunksById(id) {
    const uploadRecord = await this.uploads.get(id);
    console.log(uploadRecord)
    return uploadRecord || {}
  }
  // 获得所有活跃的上传任务
  async getAllActiveUploads() {
    return this.uploads
      .where('status')
      .anyOf(['pending', 'uploading', 'paused'])
      .toArray();
  }
  async getUploadedChunksByFileHash(fileHash) {
    // 先通过 fileHash 查询对应的上传记录
    const uploadRecord = await this.uploads.where('fileHash').equals(fileHash).first();
    // 若没找到记录，或未存储 uploadedChunks，返回空数组（避免后续处理报错）
    return uploadRecord?.uploadedChunks || [];
  }
  // 删除上传chunks列表
  async deleteUploadRecord(id) {
    await this.uploads.delete(id);
  }
  // 清空所有上传任务记录
  async clearAllUploadRecords() {
    // 直接调用Dexie表的clear方法，自动处理事务和清空逻辑
    await this.uploads.clear();
    console.log('已清空uploads表中所有数据');
  }
  // 下载相关方法
  async saveDownloadRecord(record) {
    record.createdAt = new Date();
    record.updatedAt = new Date();
    return await this.downloads.put(record);
  }

  async getDownloadRecord(taskId) {
    return await this.downloads.get(taskId);
  }

  async getDownloadRecordByFileId(fileId) {
    return await this.downloads.where('fileId').equals(fileId).first();
  }

  async getAllActiveDownloads() {
    return await this.downloads
      .where('status')
      .anyOf(['pending', 'downloading', 'paused', 'error'])
      .toArray();
  }

  async updateDownloadProgress(taskId, progress, downloadedChunks) {
    return await this.downloads.update(taskId, {
      progress,
      downloadedChunks,
      updatedAt: new Date()
    });
  }

  async updateDownloadStatus(taskId, status) {
    return await this.downloads.update(taskId, {
      status,
      updatedAt: new Date()
    });
  }

  async updateDownloadFileInfo(taskId, fileId, fileName, fileSize, totalChunks) {
    return await this.downloads.update(taskId, {
      fileId,
      fileName,
      fileSize,
      totalChunks,
      updatedAt: new Date()
    });
  }

  async deleteDownloadRecord(taskId) {
    return await this.downloads.delete(taskId);
  }

  async clearAllDownloadRecords() {
    return await this.downloads.clear();
  }
}


export const db = new UploadDatabase();