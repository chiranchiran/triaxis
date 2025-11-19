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
import { p } from '@douyinfe/semi-ui/lib/es/markdownRender/components';
import { useDeleteConfirm } from '../Mymodal';
import { Skeleton } from 'antd';

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
  const dispatch = useDispatch();
  // 虚拟列表引用
  const virtualListRef = useRef();

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

  /**
   * @description State管理 
   */

  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadedPages, setLoadedPages] = useState([]);

  const { SubscriptionTypes, subscribeChat, getChatDetail, delChatMessage, sendChatMessage, revokeChatMessage, readChatMessage, disconnect } = useChat(true);
  const showDeleteConfirm = useDeleteConfirm();


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

    // 重置状态
    resetChat();

    // 订阅消息
    const id = subscribeChat('chat', {
      [SubscriptionTypes.CHAT_DETAIL]: handleChatDetail,
      [SubscriptionTypes.CHAT_NEW_MESSAGE]: handleNewMessage,
      [SubscriptionTypes.CHAT_MESSAGE_SENT]: handleMessageSent,
      [SubscriptionTypes.CHAT_DELETE]: handleDel,
      [SubscriptionTypes.CHAT_REVOKE]: handleRevoke
    });

    setIsLoading(true);
    // 加载初始消息
    loadMessages(1);
    console.log('初始化执行，调用 loadMessages(1)');
    readChatMessage(userId);
    // 滚动到底部
    setTimeout(() => {
      if (virtualListRef.current) {
        console.log("滚动到底部")
        virtualListRef.current.scrollToBottom();
      }
    }, 100);
    // 清理函数
    return () => {
      resetChat()
    };
  }, []);

  // 使用 ref 来跟踪最新的 loadedPages
  const loadedPagesRef = useRef([]);

  // 同步 ref 和 state
  useEffect(() => {
    loadedPagesRef.current = loadedPages;
  }, [loadedPages]);

  // 重置聊天状态
  const resetChat = useCallback(() => {
    setMessages([]);
    setLoadedPages([]);
    loadedPagesRef.current = []; // 同时重置 ref
    setPage(1);
    setTotal(0);
    if (virtualListRef.current) {
      virtualListRef.current.clearCache();
    }
  }, []);

  // 初始加载消息 - 使用 ref 来检查
  const loadMessages = useCallback(async (currentPage = 1) => {
    console.log("加载用户聊天记录第几页", currentPage);
    console.log("已加载的页面:", loadedPagesRef.current);

    if (!userId || websocketStatus !== 1) return;

    // 使用 ref 来检查是否已加载
    if (loadedPagesRef.current.includes(currentPage)) {
      console.log(`页面 ${currentPage} 已加载，跳过`);
      return;
    }

    getChatDetail(userId, currentPage, pageSize);
  }, [userId, websocketStatus, getChatDetail, pageSize]);

  // 处理聊天详情数据
  const handleChatDetail = useCallback((chatData) => {
    console.log('收到聊天详情:', chatData);
    console.log('当前已加载页面:', loadedPagesRef.current);

    if (chatData && Array.isArray(chatData.records)) {
      // 使用 ref 检查，避免重复添加
      if (!loadedPagesRef.current.includes(chatData.page)) {
        console.log(`添加页面 ${chatData.page} 到已加载列表`);

        const transformedChats = transformRecordsToChats(chatData.records);

        // 使用函数式更新确保状态正确
        setMessages(prev => [...transformedChats, ...prev]);
        setTotal(chatData.total || transformedChats.length);

        // 更新 loadedPages
        setLoadedPages(prev => {
          const newLoadedPages = [...prev, chatData.page];
          console.log('更新后的已加载页面:', newLoadedPages);
          return newLoadedPages;
        });
        const totalPages = chatData.total === 0 ? 0 : Math.ceil(chatData.total / pageSize);
        setHasMore(chatData.page < totalPages);

      } else {
        console.log(`页面 ${chatData.page} 已加载，跳过处理`);
      }

      setIsLoading(false);
      setIsLoadingMore(false);
      // 滚动逻辑
      if (chatData.page === 1) {
        setTimeout(() => {
          if (virtualListRef.current) {
            virtualListRef.current.scrollToBottom();
          }
        }, 200);
      }

    } else {
      console.error('获取聊天详情错误:', chatData);
      messageApi.error('获取聊天记录失败，请重试');
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [transformRecordsToChats, pageSize]);

  // 加载更多历史消息 - 使用 ref 获取最新值
  const loadMoreMessages = useCallback(async () => {
    console.log("加载下一页检查 - 已加载页面:", loadedPagesRef.current);
    console.log("加载状态:", { isLoadingMore, hasMore });

    if (isLoadingMore || !hasMore) return;

    // 使用 ref 计算下一页
    const currentLoadedPages = loadedPagesRef.current;
    const lastPage = currentLoadedPages.length > 0 ? Math.max(...currentLoadedPages) : 1;
    const nextPage = lastPage + 1;
    const totalPages = Math.ceil(total / pageSize) || 1;

    console.log(`计算下一页: lastPage=${lastPage}, nextPage=${nextPage}, totalPages=${totalPages}`);

    // 检查下一页是否已加载或超过总页数
    if (currentLoadedPages.includes(nextPage) || nextPage > totalPages) {
      console.log(`跳过加载页面 ${nextPage}: 已加载或超过总页数`);
      return;
    }

    setIsLoadingMore(true);
    loadMessages(nextPage);
  }, [isLoadingMore, hasMore, total, pageSize, loadMessages]);

  // 事件处理函数
  const handleNewMessage = useCallback((message) => {
    console.log('收到新消息:', message);

    if (message.senderId === userId || message.receiverId === userId) {
      setPage(1);
      if (virtualListRef.current) {
        virtualListRef.current.clearCache();
      }
      // messageApi.success("对方发来了新消息，请滑动到底部查看")
      const newMessage = transformRecordsToChats([message])[0];

      setMessages(prev => {
        // 避免重复消息
        const existingIndex = prev.findIndex(msg => msg.id === newMessage.id);
        if (existingIndex >= 0) {
          // 更新现有消息
          const updatedList = [...prev];
          updatedList[existingIndex] = newMessage;
          return updatedList;
        } else {
          // 添加新消息
          return [...prev, newMessage];
        }
      });

      // 收到新消息时滚动到底部
      setTimeout(() => {
        if (virtualListRef.current) {
          virtualListRef.current.scrollToBottom();
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

      // 清除缓存以确保新消息正确渲染
      if (virtualListRef.current) {
        virtualListRef.current.clearCache();
      }

      setTimeout(() => {
        if (virtualListRef.current) {
          virtualListRef.current.scrollToBottom();
        }
      }, 50);
    } else {
      // 发送失败处理
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

  const handleDel = useCallback((messageId) => {
    console.log('消息删除确认:', messageId);
    if (messageId) {
      messageApi.success('删除成功');

      setMessages(prev => prev.filter(item => item.id !== messageId));
      debugger
      // 清除缓存
      // if (virtualListRef.current) {
      //   virtualListRef.current.clearCache();
      // }
      // setTimeout(() => {
      //   if (virtualListRef.current) {
      //     virtualListRef.current.scrollToBottom();
      //   }
      // }, 50);
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
      清除缓存
      if (virtualListRef.current) {
        virtualListRef.current.clearCache();
      }
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
  }, [websocketStatus, messageApi, disconnect, dispatch]);

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
    setTimeout(() => {
      if (virtualListRef.current) {
        virtualListRef.current.scrollToBottom();
      }
    }, 50);
    // 清除缓存
    if (virtualListRef.current) {
      virtualListRef.current.clearCache();
    }
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

    showDeleteConfirm(() => {
      // 检查连接状态
      if (websocketStatus !== 1) {
        messageApi.warning('正在连接服务器中，请稍后删除...');
        return;
      }

      delChatMessage(message.id);
    }, null);

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
  console.log(page, hasMore, total)
  // 判断显示内容的逻辑 - 修复状态闪烁问题
  const renderContent = () => {
    // 如果正在加载且没有初始化完成，显示加载状态
    if (isLoading || isLoadingMore) {
      return (
        <div style={commonOuterStyle} className="mx-7xl overflow-hidden flex items-center flex-col justify-center px-10 gap-10">
          <Skeleton avatar paragraph={{ rows: 3 }} active />
          <Skeleton avatar paragraph={{ rows: 3 }} active />
          <Skeleton avatar paragraph={{ rows: 3 }} active />
          <Skeleton avatar paragraph={{ rows: 3 }} active />
        </div>
      );
    }

    // 如果初始化完成但没有消息，显示空状态
    if (!isLoading && !isArrayValid(messages)) {
      return (
        <MyEmpty description={websocketStatus === 1 ? "暂无聊天记录，开始一段对话吧！" : "正在连接..."} />
      );
    }

    // 有消息时显示聊天容器
    return (
      <ChatContainer
        messages={messages}
        roleInfo={roleInfo}
        onMessageSend={onMessageSend}
        onMessageCopy={onMessageCopy}
        onMessageDelete={onMessageDelete}
        onRevoke={onRevoke}
        onLoadMore={loadMoreMessages}
        uploadProps={uploadProps}
        placeholder={websocketStatus === 1 ? "输入消息..." : "获取消息中，请稍候..."}
        virtualListRef={virtualListRef}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        commonOuterStyle={commonOuterStyle}
        className="mx-7xl overflow-hidden"
      />
    );
  };

  return (
    <>
      <ConnectionStatus
        websocketStatus={websocketStatus}
        onReconnect={handleReconnect}
        onBack={onBack}
      />

      {renderContent()}
    </>
  );
};

export default MyChat;