// src/services/chatApiService.js
import webSocketService from './websocketService';

class ChatApiService {
  constructor() {
    this.initialized = false;
  }

  // 初始化WebSocket连接
  init(messageHandlers = {}) {
    if (this.initialized) {
      console.log('ChatApiService已经初始化');
      return;
    }

    // 注册消息处理器
    Object.keys(messageHandlers).forEach(key => {
      webSocketService.registerMessageHandler(key, messageHandlers[key]);
    });

    this.initialized = true;
    console.log('ChatApiService初始化完成');
  }

  // 连接WebSocket
  connect(onConnect, onError) {
    if (!this.initialized) {
      console.warn('ChatApiService未初始化，请先调用init()');
      return;
    }
    webSocketService.connect(onConnect, onError);
  }

  // 断开连接
  disconnect() {
    webSocketService.disconnect();
    this.initialized = false;
  }

  // ==================== 消息发送API ====================

  sendMessage(content, receiverId) {
    return webSocketService.sendChatMessage(content, receiverId);
  }

  getMessageCount() {
    return webSocketService.getMessageCount();
  }

  getLikeMessages() {
    return webSocketService.getLikeMessages();
  }

  getCollectMessages() {
    return webSocketService.getCollectMessages();
  }

  getReviewMessages() {
    return webSocketService.getReviewMessages();
  }

  getSystemMessages() {
    return webSocketService.getSystemMessages();
  }

  getChatSessions() {
    return webSocketService.getChatSessions();
  }

  getChatDetail(chatId) {
    return webSocketService.getChatDetail(chatId);
  }

  // ==================== 状态检查 ====================

  isConnected() {
    return webSocketService.isConnected();
  }

  isConnecting() {
    return webSocketService.isConnecting();
  }

  getConnectionState() {
    return webSocketService.getConnectionState();
  }
}

// 创建单例实例
const chatApiService = new ChatApiService();
export default chatApiService;