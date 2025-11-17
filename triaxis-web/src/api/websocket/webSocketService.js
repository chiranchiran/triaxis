// src/services/websocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
[
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
]
class WebSocketService {
  constructor() {
    this.client = null;
    // 当前连接状态，0 conneting，1open，2 closed
    this.status = 2;
    // 时间上的配置，定时器
    this.heartbeatInterval = null;
    this.reconnectInterval = null;
    // 次数的配置
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    // 存放所有订阅、不同类型订阅的回调函数、积压消息
    this.componentSubscriptions = new Map(); // key: componentId, value: { subscriptions: Map(path -> subscription), callbacks: Map(path -> callback) }
    // this.messageHandlers = new Map();
    this.messageQueue = [];
    console.log('WebSocketService 初始化完成');
  }
  /**
   * @description 连接与事件回调
   */
  getAccessToken() {
    return localStorage.getItem('accessToken') || '';
  }

  // 连接WebSocket
  connect(onConnect, onError) {
    if (this.status !== 2) {
      console.log('WebSocket连接已存在或正在连接中');
      return;
    }

    const token = this.getAccessToken();
    if (!token) {
      console.error('未找到accessToken');
      onError && onError(new Error('未找到accessToken'));
      return;
    }

    this.status = 0;
    this.reconnectAttempts = 0;

    console.log('开始建立WebSocket连接...');

    try {
      const socket = new SockJS('http://localhost:8080/chat');

      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          'Authorization': `Bearer ${token}`,
        },
        debug: (str) => {
          // 减少调试输出，只在开发时开启
          if (import.meta.env.DEV) {
            console.log('STOMP:', str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => this.handleConnect(frame, onConnect),
        onStompError: (frame) => this.handleStompError(frame, onError),
        onWebSocketError: (error) => this.handleWebSocketError(error, onError),
        onDisconnect: () => this.handleDisconnect()
      });

      this.client.activate();
    } catch (error) {
      console.error('WebSocket初始化错误:', error);
      this.status = 2;
      onError && onError(error);
    }
  }
  // 连接成功回调函数，修改状态、订阅、启动心跳、处理积压消息、其他回调
  handleConnect(frame, onConnect) {
    console.log('WebSocket连接成功建立:', frame);
    this.status = 1;
    this.reconnectAttempts = 0;

    // 设置订阅
    this.setupAllSubscriptions();

    // 启动心跳
    this.startHeartbeat();

    // 处理积压的消息
    this.processMessageQueue();

    onConnect && onConnect();
  }
  // stomp协议错误
  handleStompError(frame, onError) {
    console.error('STOMP协议错误:', frame.headers['message']);
    this.status = 2;
    onError && onError(new Error(frame.headers['message']));
  }
  // websocket连接错误
  handleWebSocketError(error, onError) {
    console.error('WebSocket连接错误:', error);
    this.status = 2;
    onError && onError(error);
    this.scheduleReconnect();
  }
  // 连接断开的回调
  handleDisconnect() {
    console.log('WebSocket连接断开');
    this.status = 2;
    this.cleanupSubscriptions();
  }
  // websocket错误重试连接
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
    this.status = 0;
    // 每5秒重连一次
    this.reconnectInterval = setTimeout(() => {
      if (this.status !== 1) {
        console.log('执行重连...');
        this.connect(
          () => console.log('重连成功'),
          (error) => console.error('重连失败:', error)
        );
      }
    }, 5000);
  }
  /**
   * @description 断开与事件回调
   */
  disconnect() {
    console.log('主动断开WebSocket连接');
    this.status = 2
    this.cleanup();
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.error('断开连接错误:', error);
      }
    }
  }
  // 断开连接的清理
  cleanup() {
    // 清理定时器
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    // 重置状态
    this.status = 2;
    this.reconnectAttempts = 0;
    // 清理所有订阅
    this.cleanupSubscriptions();
  }


  /**
 * @description 心跳机制
 */

  sendHeartbeat() {
    return this.publish('/app/heartbeat', {
      type: 'HEARTBEAT',
      timestamp: new Date().toISOString()
    });
  }

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.status === 1) {
        this.sendHeartbeat();
      }
    }, 30000);
    console.log('心跳机制已启动');
  }

  /**
   * @description 订阅管理
   */

  // 为组件注册订阅信息
  register(componentId, subscriptions) {
    // subscriptions 格式: { '/user/queue/path': callbackFunction }

    const componentInfo = {
      id: componentId,
      subscriptions: new Map(), // STOMP订阅对象
      callbacks: new Map(Object.entries(subscriptions))
    };

    this.componentSubscriptions.set(componentId, componentInfo);

    // 如果已经连接，立即设置订阅
    if (this.status === 1) {
      this.setupSubscriptions(componentId);
    }

    console.log(`组件 ${componentId} 注册了 ${Object.keys(subscriptions).length} 个订阅`);
    return componentId;
  }

  // 根据订阅信息设置订阅
  setupSubscriptions(componentId) {
    const componentInfo = this.componentSubscriptions.get(componentId);
    if (!componentInfo) {
      console.warn(`组件 ${componentId} 未找到订阅信息`);
      return;
    }

    const { callbacks, subscriptions } = componentInfo;

    // 为每个路径创建订阅
    callbacks.forEach((callback, path) => {
      try {
        const stompSubscription = this.client.subscribe(path, (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log(`[${componentId}] 收到消息 [${path}]:`, parsedMessage);
            callback(parsedMessage);
          } catch (error) {
            console.error(`[${componentId}] 解析消息错误:`, error, message.body);
          }
        });

        subscriptions.set(path, stompSubscription);
        console.log(`[${componentId}] 订阅成功: ${path}`);
      } catch (error) {
        console.error(`[${componentId}] 订阅失败 [${path}]:`, error);
      }
    });
  }

  // 为所有组件设置订阅（连接建立后调用）
  setupAllSubscriptions() {
    console.log('为所有组件设置订阅，组件数量:', this.componentSubscriptions.size);

    this.componentSubscriptions.forEach((componentInfo, componentId) => {
      this.setupSubscriptions(componentId);
    });
  }

  // 取消组件的所有订阅
  unregister(componentId) {
    const componentInfo = this.componentSubscriptions.get(componentId);
    if (!componentInfo) {
      console.warn(`组件 ${componentId} 未找到，无法取消订阅`);
      return;
    }

    const { subscriptions } = componentInfo;

    // 取消所有活跃订阅
    subscriptions.forEach((subscription, path) => {
      try {
        subscription.unsubscribe();
        console.log(`[${componentId}] 取消订阅: ${path}`);
      } catch (error) {
        console.error(`[${componentId}] 取消订阅错误 [${path}]:`, error);
      }
    });

    this.componentSubscriptions.delete(componentId);
    console.log(`[${componentId}] 组件订阅已完全清理`);
  }

  // 清理所有组件的订阅（连接断开时调用，但是留组件信息和回调函数）
  cleanupSubscriptions() {
    console.log('清理所有组件的订阅');

    this.componentSubscriptions.forEach((componentInfo, componentId) => {
      const { subscriptions } = componentInfo;

      subscriptions.forEach((subscription, path) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error(`清理订阅错误 [${componentId}-${path}]:`, error);
        }
      });

      // 清空订阅Map，但保留组件信息和回调函数
      componentInfo.subscriptions.clear();
    });
  }

  // // 注册全局消息处理器
  // registerMessageHandler(type, handler) {
  //   this.messageHandlers.set(type, handler);
  // }
  // // 调用全局消息处理器
  // callMessageHandler(type, message) {
  //   const handler = this.messageHandlers.get(type);
  //   if (handler) {
  //     handler(message);
  //   }
  // }
  // // 处理接收到的消息，主要用于全局消息处理
  // handleIncomingMessage(destination, message) {
  //   let handlerType = '';

  //   // 根据目的地确定处理器类型
  //   if (destination.includes('chat.new')) {
  //     handlerType = 'newMessage';
  //   } else if (destination.includes('chat.sent')) {
  //     handlerType = 'messageSent';
  //   } else if (destination.includes('messages.count')) {
  //     handlerType = 'messageCountUpdate';
  //   } else if (destination.includes('chat.detail')) {
  //     handlerType = 'chat';
  //   } else if (destination.includes('messages.like')) {
  //     handlerType = 'likeMessages';
  //   } else if (destination.includes('messages.collect')) {
  //     handlerType = 'collectMessages';
  //   } else if (destination.includes('messages.review')) {
  //     handlerType = 'reviewMessages';
  //   } else if (destination.includes('messages.system')) {
  //     handlerType = 'systemMessages';
  //   } else if (destination.includes('chats.list')) {
  //     handlerType = 'chats';
  //   }

  //   if (handlerType) {
  //     const handler = this.messageHandlers.get(handlerType);
  //     if (handler) {
  //       handler(message);
  //     }
  //   }
  // }

  /**
    * @description 消息发布
    */
  // 发布消息方法
  publish(destination, body) {
    // 检查连接状态
    if (!this.client || this.status !== 1) {
      console.warn('WebSocket未连接，消息将被缓存:', destination);
      this.messageQueue.push({ destination, body });
      return false;
    }

    try {
      // 检查STOMP连接是否真的可用
      if (!this.client.connected) {
        this.status = 2;
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
      console.log('消息发送成功:', destination);
      return true;
    } catch (error) {
      console.error('发布消息时出错:', error);
      this.messageQueue.push({ destination, body });
      return false;
    }
  }

  // 处理消息队列，发送积压的消息
  processMessageQueue() {
    console.log('处理消息队列，长度:', this.messageQueue.length);
    if (this.messageQueue.length === 0) return;
    const queue = [...this.messageQueue];
    this.messageQueue = [];
    let successCount = 0;
    queue.forEach(({ destination, body }) => {
      const success = this.publish(destination, body);
      if (success) successCount++;
    });
    console.log(`消息队列处理完成: ${successCount} 成功, ${queue.length - successCount} 失败`);
  }

}

// 创建单例实例
const webSocketService = new WebSocketService();
export default webSocketService;