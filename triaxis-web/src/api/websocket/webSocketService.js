// src/services/websocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.connecting = false;
    this.heartbeatInterval = null;
    this.reconnectInterval = null;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.messageQueue = [];
    this.connectionCallbacks = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken') || '';
  }

  // 连接WebSocket
  connect(onConnect, onError) {
    if (this.connecting || this.connected) {
      console.log('WebSocket连接已存在或正在连接中');
      return;
    }

    const token = this.getAccessToken();
    if (!token) {
      console.error('未找到accessToken');
      onError && onError(new Error('未找到accessToken'));
      return;
    }

    this.connecting = true;
    this.reconnectAttempts = 0;

    console.log('开始建立WebSocket连接...');

    try {
      // 使用与后端一致的端点 /chat
      const socket = new SockJS('http://localhost:8080/chat');

      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          'Authorization': `Bearer ${token}`,
        },
        debug: (str) => {
          // 减少调试输出，只在开发时开启
          if (process.env.NODE_ENV === 'development') {
            console.log('STOMP:', str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: this.handleConnect.bind(this, onConnect),
        onStompError: this.handleStompError.bind(this, onError),
        onWebSocketError: this.handleWebSocketError.bind(this, onError),
        onDisconnect: this.handleDisconnect.bind(this)
      });

      this.client.activate();
    } catch (error) {
      console.error('WebSocket初始化错误:', error);
      this.connecting = false;
      onError && onError(error);
    }
  }

  handleConnect(onConnect, frame) {
    console.log('WebSocket连接成功建立:', frame);
    this.connected = true;
    this.connecting = false;
    this.reconnectAttempts = 0;

    // 设置订阅
    this.setupSubscriptions();

    // 启动心跳
    this.startHeartbeat();

    // 处理积压的消息
    this.processMessageQueue();

    // 执行连接回调
    this.connectionCallbacks.forEach(callback => callback());
    this.connectionCallbacks = [];

    onConnect && onConnect();
  }

  handleStompError(onError, frame) {
    console.error('STOMP协议错误:', frame.headers['message']);
    this.connecting = false;
    onError && onError(new Error(frame.headers['message']));
  }

  handleWebSocketError(onError, error) {
    console.error('WebSocket连接错误:', error);
    this.connected = false;
    this.connecting = false;
    onError && onError(error);
    this.scheduleReconnect();
  }

  handleDisconnect() {
    console.log('WebSocket连接断开');
    this.connected = false;
    this.connecting = false;
    this.cleanup();
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    console.log(`计划重连，尝试次数: ${this.reconnectAttempts}`);

    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }

    this.reconnectInterval = setTimeout(() => {
      if (!this.connected && !this.connecting) {
        console.log('执行重连...');
        this.connect(
          () => console.log('重连成功'),
          (error) => console.error('重连失败:', error)
        );
      }
    }, 5000);
  }

  // 安全的发布消息方法
  safePublish(destination, body) {
    // 检查连接状态
    if (!this.client || !this.connected) {
      console.warn('WebSocket未连接，消息将被缓存:', destination);
      this.messageQueue.push({ destination, body });
      return false;
    }

    try {
      // 检查STOMP连接是否真的可用
      if (!this.client.connected) {
        console.warn('STOMP连接不可用，消息将被缓存');
        this.messageQueue.push({ destination, body });
        return false;
      }

      this.client.publish({
        destination,
        body: JSON.stringify(body),
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'content-type': 'application/json'
        }
      });
      return true;
    } catch (error) {
      console.error('发布消息时出错:', error);
      this.messageQueue.push({ destination, body });
      return false;
    }
  }

  // 处理消息队列
  processMessageQueue() {
    console.log('处理消息队列，长度:', this.messageQueue.length);
    const queue = [...this.messageQueue];
    this.messageQueue = [];

    queue.forEach(({ destination, body }) => {
      this.safePublish(destination, body);
    });
  }

  // 设置订阅
  setupSubscriptions() {
    console.log('设置消息订阅...');

    // 清除之前的订阅
    this.subscriptions.forEach((subscription, destination) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('取消订阅错误:', error);
      }
    });
    this.subscriptions.clear();

    // 定义要订阅的路径
    const subscriptionPaths = [
      '/user/queue/chat.new',
      '/user/queue/chat.sent',
      '/user/queue/messages.count',
      '/user/queue/notifications',
      '/user/queue/chat.detail',
      '/user/queue/messages.like',
      '/user/queue/messages.collect',
      '/user/queue/messages.review',
      '/user/queue/messages.system',
      '/user/queue/chats.list'
    ];

    // 设置所有订阅
    subscriptionPaths.forEach(path => {
      this.subscribe(path, (message) => {
        this.handleIncomingMessage(path, message);
      });
    });
  }

  // 通用订阅方法
  subscribe(destination, callback) {
    if (!this.client || !this.connected) {
      console.error('无法订阅，WebSocket未连接:', destination);
      return null;
    }

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          console.log(`收到消息 [${destination}]:`, parsedMessage);
          callback(parsedMessage);
        } catch (error) {
          console.error('解析消息错误:', error, message.body);
        }
      });

      this.subscriptions.set(destination, subscription);
      console.log(`订阅成功: ${destination}`);
      return subscription;
    } catch (error) {
      console.error('订阅失败:', error);
      return null;
    }
  }

  // 处理接收到的消息
  handleIncomingMessage(destination, message) {
    let handlerType = '';

    // 根据目的地确定处理器类型
    if (destination.includes('chat.new')) {
      handlerType = 'newMessage';
    } else if (destination.includes('chat.sent')) {
      handlerType = 'messageSent';
    } else if (destination.includes('messages.count')) {
      handlerType = 'messageCountUpdate';
    } else if (destination.includes('notifications')) {
      handlerType = 'notification';
    } else if (destination.includes('chat.detail')) {
      handlerType = 'chatDetail';
    } else if (destination.includes('messages.like')) {
      handlerType = 'likeMessages';
    } else if (destination.includes('messages.collect')) {
      handlerType = 'collectMessages';
    } else if (destination.includes('messages.review')) {
      handlerType = 'reviewMessages';
    } else if (destination.includes('messages.system')) {
      handlerType = 'systemMessages';
    } else if (destination.includes('chats.list')) {
      handlerType = 'chatSessions';
    }

    if (handlerType) {
      const handler = this.messageHandlers.get(handlerType);
      if (handler) {
        handler(message);
      }
    }
  }

  // ==================== 消息发送API ====================

  sendChatMessage(content, receiverId) {
    const message = {
      content: content,
      receiverId: receiverId,
      type: 1,
      timestamp: new Date().toISOString()
    };
    return this.safePublish('/app/chat.send', message);
  }

  getMessageCount() {
    return this.safePublish('/app/messages.count.get', {});
  }

  getLikeMessages() {
    return this.safePublish('/app/messages.like.get', {});
  }

  getCollectMessages() {
    return this.safePublish('/app/messages.collect.get', {});
  }

  getReviewMessages() {
    return this.safePublish('/app/messages.review.get', {});
  }

  getSystemMessages() {
    return this.safePublish('/app/messages.system.get', {});
  }

  getChatSessions() {
    return this.safePublish('/app/chats.get', {});
  }

  getChatDetail(chatId) {
    return this.safePublish('/app/chat.get', { chatId });
  }

  sendHeartbeat() {
    return this.safePublish('/app/heartbeat', {
      type: 'HEARTBEAT',
      timestamp: new Date().toISOString()
    });
  }

  // ==================== 工具方法 ====================

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.sendHeartbeat();
      }
    }, 30000);
  }

  registerMessageHandler(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  waitForConnection(callback) {
    if (this.connected) {
      callback();
    } else {
      this.connectionCallbacks.push(callback);
    }
  }

  disconnect() {
    console.log('主动断开WebSocket连接');
    this.cleanup();
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.error('断开连接错误:', error);
      }
    }
  }

  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    this.subscriptions.forEach((subscription, destination) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('取消订阅错误:', error);
      }
    });
    this.subscriptions.clear();

    this.connecting = false;
    this.connected = false;
  }

  isConnected() {
    return this.connected && this.client && this.client.connected;
  }

  isConnecting() {
    return this.connecting;
  }

  getConnectionState() {
    if (this.connected) return 'connected';
    if (this.connecting) return 'connecting';
    return 'disconnected';
  }
}

// 创建单例实例
const webSocketService = new WebSocketService();
export default webSocketService;