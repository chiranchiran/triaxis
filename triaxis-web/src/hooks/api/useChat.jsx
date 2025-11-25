// src/hooks/useChat.js
import { useRef, useEffect, useCallback } from 'react';
import { useMessage } from '../../components/AppProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setWebsocketStatus } from '../../store/slices/userCenterSlice';
import useSelection from 'antd/lib/table/hooks/useSelection';
import webSocketService from '../../utils/api/webSocketService';

// 预定义的订阅类型（保留原常量）
export const SubscriptionTypes = {
  CHAT_NEW_MESSAGE: 'CHAT_NEW_MESSAGE',
  CHAT_MESSAGE_SENT: 'CHAT_MESSAGE_SENT',
  CHAT_DETAIL: 'CHAT_DETAIL',
  CHAT_DELETE: 'CHAT_DELETE',
  CHAT_REVOKE: 'CHAT_REVOKE',
  MESSAGE_COUNT: 'MESSAGE_COUNT',
  LIKE_MESSAGES: 'LIKE_MESSAGES',
  COLLECT_MESSAGES: 'COLLECT_MESSAGES',
  REVIEW_MESSAGES: 'REVIEW_MESSAGES',
  SYSTEM_MESSAGES: 'SYSTEM_MESSAGES',
  CHAT_LISTS: 'CHAT_LISTS',
};

// 订阅类型到STOMP路径的映射（保留原映射）
const SubscriptionPaths = {
  [SubscriptionTypes.CHAT_NEW_MESSAGE]: '/user/queue/chat.new',
  [SubscriptionTypes.CHAT_MESSAGE_SENT]: '/user/queue/chat.sent',
  [SubscriptionTypes.CHAT_DETAIL]: '/user/queue/chat.detail',
  [SubscriptionTypes.CHAT_DELETE]: '/user/queue/chat.delete',
  [SubscriptionTypes.CHAT_REVOKE]: '/user/queue/chat.revoke',
  [SubscriptionTypes.MESSAGE_COUNT]: '/user/queue/messages.count',
  [SubscriptionTypes.LIKE_MESSAGES]: '/user/queue/messages.like',
  [SubscriptionTypes.COLLECT_MESSAGES]: '/user/queue/messages.collect',
  [SubscriptionTypes.REVIEW_MESSAGES]: '/user/queue/messages.review',
  [SubscriptionTypes.SYSTEM_MESSAGES]: '/user/queue/messages.system',
  [SubscriptionTypes.CHAT_LISTS]: '/user/queue/chats.list',
};


export const useChat = (isCheck = false) => {
  // 用 useRef 持久化注册的订阅ID和定时器
  const subscriptionIdsRef = useRef([]);
  const messageApi = useMessage();
  const intervalRef = useRef(null); // 存储定期检查的定时器
  const dispatch = useDispatch();
  const websocketStatus = useSelector(state => state.userCenter.websocketStatus)


  // ------------------------------
  // 连接与断开相关方法
  // ------------------------------
  const connect = (onConnect, onError) => {
    const successCallback = () => {
      console.log('聊天组件：WebSocket连接成功');
      onConnect?.(1);
      dispatch(setWebsocketStatus(1))
    };

    const errorCallback = (error) => {
      console.error('聊天组件：WebSocket连接失败:', error);
      onError?.(error);
      dispatch(setWebsocketStatus(2))
      // messageApi.error('连接服务器失败，请检查网络');
    };

    webSocketService.connect(successCallback, errorCallback);
  };

  const getStatus = () => {
    return webSocketService.status;
  };

  const disconnect = () => {
    webSocketService.disconnect();
    dispatch(setWebsocketStatus(2))
    if (intervalRef.current) clearInterval(intervalRef.current);
    subscriptionIdsRef.current.forEach(id => {
      webSocketService.unregister(id);
    });
    subscriptionIdsRef.current = [];
  };

  // ------------------------------
  // 连接状态检查方法
  // ------------------------------
  const checkConnection = useCallback(
    () => {
      const currentStatus = getStatus();
      console.log('当前连接状态:', currentStatus, '组件状态:', websocketStatus);
      if (currentStatus !== websocketStatus) {
        dispatch(setWebsocketStatus(currentStatus))
      }
    }, []
  )
  // 首次启动连接
  useEffect(() => {
    if (getStatus === 1) return;
    connect();
    // 组件卸载时清理
    return () => {
      disconnect();
    };
  }, []);
  // ------------------------------
  // 定期检查+自动重连
  // ------------------------------
  useEffect(() => {
    if (!isCheck) return;
    // 初始检查连接状态
    checkConnection();
    // 定期检查连接状态（存储定时器到ref，方便清理）
    intervalRef.current = setInterval(() => {
      checkConnection();
    }, 3000);
    // 清理函数
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCheck, checkConnection, websocketStatus]);

  // ------------------------------
  // 自动重连逻辑
  // ------------------------------
  useEffect(() => {
    if (!isCheck || websocketStatus !== 2) return;
    if (websocketStatus === 2) {
      console.log('尝试连接WebSocket...');
      connect();
    }
  }, [isCheck, websocketStatus, connect]);
  // ------------------------------
  // 订阅相关方法
  // ------------------------------
  const register = (name, subscriptionTypes, callbacks) => {
    const id = `${name}_${Date.now()}`;
    const subscriptions = {};

    subscriptionTypes.forEach(type => {
      const path = SubscriptionPaths[type];
      if (path && callbacks[type]) {
        subscriptions[path] = callbacks[type];
      }
    });

    webSocketService.register(id, subscriptions);
    subscriptionIdsRef.current.push(id);
    console.log(`[${name}] 注册订阅:`, subscriptionTypes);
    return id;
  };

  const unregister = (id) => {
    webSocketService.unregister(id);
    subscriptionIdsRef.current = subscriptionIdsRef.current.filter(subId => subId !== id);
    console.log(`组件 ${id} 取消订阅`);
  };

  const subscribeMessageCount = (name, callbacks) => {
    const allTypes = [SubscriptionTypes.MESSAGE_COUNT];
    return register(name, allTypes, callbacks);
  };

  const subscribeAllMessageCount = (name, callbacks) => {
    const messageTypes = [
      SubscriptionTypes.LIKE_MESSAGES,
      SubscriptionTypes.COLLECT_MESSAGES,
      SubscriptionTypes.REVIEW_MESSAGES,
      SubscriptionTypes.SYSTEM_MESSAGES,
    ];
    return register(name, messageTypes, callbacks);
  };

  const subscribeChats = (name, callbacks) => {
    const messageTypes = [SubscriptionTypes.CHAT_LISTS];
    return register(name, messageTypes, callbacks);
  };

  const subscribeChat = (name, callbacks) => {
    const chatTypes = [
      SubscriptionTypes.CHAT_DETAIL,
      SubscriptionTypes.CHAT_NEW_MESSAGE,
      SubscriptionTypes.CHAT_MESSAGE_SENT,
      SubscriptionTypes.CHAT_DELETE,
      SubscriptionTypes.CHAT_REVOKE,
    ];
    return register(name, chatTypes, callbacks);
  };

  const subscribeOne = (name, subscriptionType, callback) => {
    return register(name, [subscriptionType], { [subscriptionType]: callback });
  };

  // ------------------------------
  // 消息发布相关方法
  // ------------------------------
  const sendChatMessage = (content, receiverId) => {
    const message = {
      content,
      receiverId,
      type: 1,
      timestamp: new Date().toISOString()
    };
    return webSocketService.publish('/app/chat.send', message);
  };

  const delChatMessage = (id) => {
    return webSocketService.publish('/app/chat.delete', { id });
  };

  const revokeChatMessage = (id) => {
    return webSocketService.publish('/app/chat.revoke', { id });
  };
  const readChatMessage = (id) => {
    return webSocketService.publish('/app/chat.read', { id });
  };
  const getMessagesCount = () => {
    return webSocketService.publish('/app/messages.count.get', {});
  };

  const getLikeMessages = () => {
    return webSocketService.publish('/app/messages.like.get', {});
  };

  const getCollectMessages = () => {
    return webSocketService.publish('/app/messages.collect.get', {});
  };

  const getReviewMessages = () => {
    return webSocketService.publish('/app/messages.review.get', {});
  };

  const getSystemMessages = () => {
    return webSocketService.publish('/app/messages.system.get', {});
  };

  const getChats = () => {
    return webSocketService.publish('/app/chats.list', {});
  };

  const getChatDetail = (id, page, pageSize) => {
    return webSocketService.publish('/app/chat.detail', { id, page, pageSize });
  };


  // ------------------------------
  // 暴露给外部使用的方法
  // ------------------------------
  return {
    // 连接相关
    connect,
    getStatus,
    disconnect,
    checkConnection, // 暴露手动检查方法（可选调用）

    // 订阅相关
    register,
    unregister,
    subscribeMessageCount,
    subscribeAllMessageCount,
    subscribeChats,
    subscribeChat,
    subscribeOne,

    // 消息发布相关
    sendChatMessage,
    delChatMessage,
    revokeChatMessage,
    readChatMessage,
    getMessagesCount,
    getLikeMessages,
    getCollectMessages,
    getReviewMessages,
    getSystemMessages,
    getChats,
    getChatDetail,

    // 常量导出
    SubscriptionTypes
  };
};
