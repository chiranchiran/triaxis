import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { MyButton } from '../MyButton';
import { MyEmpty } from '../MyEmpty';
import { isArrayValid } from '../../utils/commonUtil';
import ConnectionStatus from './ConnectionStatus';
import ChatContainer from './ChatContainer';
import { useMessage } from '../AppProvider';
import { useChat } from '../../hooks/api/useChat';
import { setWebsocketStatus } from '../../store/slices/userCenterSlice';


export const MyChat = ({ user, onBack }) => {
  const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 800,
  };

  const { username: myName, avatar: myAvatar, id: myId } = useSelector(state => state.auth);
  const websocketStatus = useSelector(state => state.userCenter.websocketStatus);
  const { userId, username, avatar } = user;
  const messageApi = useMessage();

  // 构建角色配置
  const roleInfo = {
    user: {
      name: myName,
      avatar: myAvatar
    },
    assistant: {
      name: username,
      avatar: avatar
    }
  };

  const uploadProps = {
    action: 'https://api.semi.design/upload'
  };

  // State管理
  const [messages, setMessages] = useState([]);
  const pageSize = 50;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const { SubscriptionTypes, subscribeChat, getChatDetail, delChatMessage, sendChatMessage, revokeChatMessage, readChatMessage, disconnect } = useChat(true);

  // 虚拟列表引用
  const virtualListRef = useRef();

  // 转换聊天记录格式
  const transformRecordsToChats = useCallback((records) => {
    if (!Array.isArray(records)) return [];

    return records.map(record => ({
      id: record.id,
      role: record.senderId === myId ? 'user' : 'assistant',
      content: record.isRevoke ? '该消息已撤回' : record.content,
      createAt: new Date(record.sendTime).getTime(),
      isRead: record.isRead,
      isRevoke: record.isRevoke,
      senderId: record.senderId,
      receiverId: record.receiverId,
      sendTime: record.sendTime
    }));
  }, [myId]);

  // WebSocket订阅和初始化
  useEffect(() => {
    if (websocketStatus !== 1 || !userId) return;

    console.log('初始化聊天组件，用户ID:', userId);
    const id = subscribeChat('chat', {
      [SubscriptionTypes.CHAT_DETAIL]: handleChatDetail,
      [SubscriptionTypes.CHAT_NEW_MESSAGE]: handleNewMessage,
      [SubscriptionTypes.CHAT_MESSAGE_SENT]: handleMessageSent,
      [SubscriptionTypes.CHAT_DELETE]: handleDel,
      [SubscriptionTypes.CHAT_REVOKE]: handleRevoke
    });
    getChatDetail(userId);
    loadMessages(1);
  }, [websocketStatus, userId]);

  // 获取聊天详情
  const fetchChatDetail = useCallback(async () => {
    if (!userId || websocketStatus !== 1) return;
    try {
      setIsLoading(true);
      // 调用API获取消息 - 这里需要根据您的API调整参数

      const success = getChatDetail(userId, page, pageSize);
      if (!success) {
        throw new Error('获取聊天记录失败');
      }
    } catch (error) {
      console.error('获取聊天详情错误:', error);
      messageApi.error('获取聊天记录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [userId, websocketStatus, messageApi]);

  // 当userId变化时重新获取聊天记录
  useEffect(() => {
    if (userId && websocketStatus === 1) {
      fetchChatDetail();
      readChatMessage(userId);
    }
  }, [userId, websocketStatus, fetchChatDetail]);

  // 事件处理函数
  const handleNewMessage = useCallback((message) => {
    console.log('收到新消息:', message);

    if (message.senderId === userId || message.receiverId === userId) {
      const newMessage = transformRecordsToChats([message])[0];
      setMessages(prev => {
        const updatedList = [...prev];
        const existingIndex = updatedList.findIndex(msg => msg.id === newMessage.id);
        if (existingIndex >= 0) {
          updatedList[existingIndex] = newMessage;
        } else {
          updatedList.push(newMessage);
        }
        return updatedList;
      });

      // 滚动到底部显示新消息
      setTimeout(() => {
        if (virtualListRef.current && newMessage.role === 'assistant') {
          virtualListRef.current.scrollToRow(messages.length);
        }
      }, 100);
    }
  }, [userId, transformRecordsToChats, messages.length]);

  const handleMessageSent = useCallback((message) => {
    console.log('消息发送确认:', message);

    if (message.id) {
      messageApi.success('发送成功');
      const newMessage = transformRecordsToChats([message])[0];
      setMessages(prev => {
        const updatedList = [...prev];
        const loadingIndex = updatedList.findIndex(msg => msg.id === 'loading' || msg.status === 'loading');
        if (loadingIndex >= 0) {
          updatedList[loadingIndex] = newMessage;
        } else {
          updatedList.push(newMessage);
        }
        return updatedList;
      });

      setTimeout(() => {
        if (virtualListRef.current) {
          virtualListRef.current.scrollToRow(messages.length);
        }
      }, 50);
    } else {
      setMessages(prev => {
        const updatedList = [...prev];
        const loadingIndex = updatedList.findIndex(msg => msg.id === 'loading' || msg.status === 'loading');
        if (loadingIndex >= 0) {
          updatedList[loadingIndex] = {
            ...updatedList[loadingIndex],
            id: 'error',
            status: 'error',
            content: '发送失败'
          };
        }
        return updatedList;
      });
      messageApi.error("发送失败");
    }
  }, [messageApi, transformRecordsToChats, messages.length]);

  const handleChatDetail = useCallback((chatData) => {
    console.log('收到聊天详情:', chatData);
    if (chatData && Array.isArray(chatData.records)) {
      const transformedChats = transformRecordsToChats(chatData.records);
      setMessages(transformedChats);

      setTimeout(() => {
        if (virtualListRef.current && transformedChats.length > 0) {
          virtualListRef.current.scrollToRow(transformedChats.length - 1);
        }
      }, 200);
    } else {
      console.error('获取聊天详情错误:', chatData);
      messageApi.error('获取聊天记录失败，请重试');
      setMessages([]);
    }
  }, [transformRecordsToChats, messageApi]);

  const handleDel = useCallback((messageId) => {
    console.log('消息删除确认:', messageId);
    if (messageId) {
      messageApi.success('删除成功');
      setMessages(prev => prev.filter(item => item.id !== messageId));
    } else {
      messageApi.error("删除失败");
    }
  }, [messageApi]);

  const handleRevoke = useCallback((messageId) => {
    console.log('消息撤回确认:', messageId);
    if (messageId) {
      messageApi.success('撤回成功');
      setMessages(prev => {
        const updatedList = [...prev];
        const messageIndex = updatedList.findIndex(item => item.id === messageId);
        if (messageIndex >= 0) {
          updatedList[messageIndex] = {
            ...updatedList[messageIndex],
            isRevoke: true,
            content: '该消息已撤回'
          };
        }
        return updatedList;
      });
    } else {
      messageApi.error("撤回失败");
    }
  }, [messageApi]);

  // 手动重连
  const handleReconnect = useCallback(() => {
    if (websocketStatus === 0) {
      messageApi.info('正在连接中，请稍候...');
      return;
    }
    dispatch(setWebsocketStatus(2));
    messageApi.info('正在重新连接...');
    console.log('尝试连接WebSocket...');
  }, [websocketStatus, messageApi]);

  // 发送消息
  const onMessageSend = useCallback(async (content, attachment) => {
    if (!content.trim()) return;

    if (websocketStatus !== 1) {
      messageApi.warning('正在连接服务器中，请稍后发送...');
      return;
    }

    sendChatMessage(content, userId);
    const optimisticMessage = {
      id: 'loading',
      content: content,
      role: 'user',
      createAt: Date.now(),
      isRead: true,
      status: 'loading'
    };
    setMessages(prev => [...prev, optimisticMessage]);
  }, [userId, messageApi, websocketStatus, sendChatMessage]);

  // 复制消息
  const onMessageCopy = useCallback((message) => {
    navigator.clipboard.writeText(message.content).then(() => {
      messageApi.success('已复制到剪贴板');
    }).catch(error => {
      messageApi.error('复制失败');
      console.error('复制消息错误:', error);
    });
  }, [messageApi]);

  // 删除消息
  const onMessageDelete = useCallback(async (message) => {
    if (!message.id) return;

    // 检查连接状态
    if (websocketStatus !== 1) {
      messageApi.warning('正在连接服务器中，请稍后删除...');
      return;
    }

    delChatMessage(message.id);
  }, [messageApi, websocketStatus, delChatMessage]);

  // 撤回消息
  const onRevoke = useCallback(async (message) => {
    if (!message.id || message.role !== 'user') return;

    // 检查连接状态
    if (websocketStatus !== 1) {
      messageApi.warning('正在连接服务器中，请稍后撤回...');
      return;
    }
    revokeChatMessage(message.id);
  }, [messageApi, websocketStatus, revokeChatMessage]);

  return (
    <>
      <ConnectionStatus websocketStatus={websocketStatus} onReconnect={handleReconnect} onBack={onBack} />

      {!isArrayValid(messages) ? (
        <MyEmpty description={websocketStatus === 1 ? "暂无聊天记录，开始一段对话吧！" : "正在连接..."} />
      ) : (
        <ChatContainer
          messages={messages}
          roleInfo={roleInfo}
          onMessageSend={onMessageSend}
          onMessageCopy={onMessageCopy}
          onMessageDelete={onMessageDelete}
          onRevoke={onRevoke}
          uploadProps={uploadProps}
          placeholder={websocketStatus === 1 ? "输入消息..." : "获取消息中，请稍候..."}
          virtualListRef={virtualListRef}
          isLoading={isLoading}
          commonOuterStyle={commonOuterStyle}
          className="mx-7xl overflow-hidden"
        />
      )}
    </>
  );
};

export default MyChat;