import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Chat, Modal, Radio } from '@douyinfe/semi-ui';
import { Avatar, Empty } from "antd";
import './index.less'
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useGetUserChats } from '../../hooks/api/user';
import { isArrayValid } from '../../utils/commonUtil';
import { MyMESSAGE_TYPE } from '../../utils/constant/types';
import { TARGETCLICK, TARGETTYPE } from '../../utils/constant/order';
import { MyEmpty } from '../MyEmpty';
import { useNavigate } from 'react-router-dom';
import { setMessageCount } from '../../store/slices/userCenterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '../MyButton';
import { useMessage } from '../AppProvider';
import chatService, { SubscriptionTypes } from '../../api/websocket/chatService';

export const ChatMessage = () => {
  const dispatch = useDispatch();

  const [chatOpen, setChatOpen] = useState(null);
  const { data = {} } = useGetUserChats({
    onSuccess: (data) => dispatch(setMessageCount({ chat: data?.total })),
  });


  // 空状态处理
  if (!isArrayValid(data.records)) {
    return <MyEmpty description="暂无聊天记录" />;
  }


  return (
    <div className="pt-3">
      {!chatOpen && data.records.map(item => {
        const {
          id,
          unread,
          sender: {
            userId = 0,
            username = "匿名用户",
            avatar = "",
            school = "",
            grade = "",
            major = "",
            online },
          lastMessage = {}
        } = item;
        const { content = "",
          sendTime = "" } = lastMessage || {}
        return (
          <div
            key={id}
            className="flex items-center p-3 setting rounded-lg cursor-pointer transition-colors"
            onClick={() => setChatOpen({ userId, username, avatar })}
          >
            {/* 用户头像 + 在线状态 */}
            <div className="relative mr-4">
              <Avatar src={avatar} size={56} />
              {online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-dark rounded-full"></div>
              )}
            </div>

            {/* 聊天信息 */}
            <div className="flex-1">
              <div className='flex gap-4 items-center text-secondary text-sm'>
                <div className='cursor-pointer text-main  text-base font-semibold' title={username}>
                  {username}
                </div>
                {[school, major, grade].filter(Boolean).join(" / ")}
              </div>
              <p className="line-clamp-2 leading-5 my-2">{content}</p>
              <div className="text-sm text-secondary mt-1">{sendTime}</div>
            </div>
            {/* 未读消息徽章 */}
            {unread > 0 && (
              <div className="bg-red text-light px-1.5 py-0.5 text-center rounded-full ml-6 text-xs">
                {unread}
              </div>
            )}

          </div>
        )
      })}
      {chatOpen && <MyChat user={chatOpen} onBack={() => setChatOpen(null)} />}
    </div>
  );
};

export const MyChat = ({ user, onBack }) => {
  const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 800,
  };

  const { username: myName, avatar: myAvatar, id: myId } = useSelector(state => state.auth);
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

  /**
 * @description State管理
 */

  const [messages, setMessages] = useState([]);
  const [connectionState, setConnectionState] = useState(2); // 2=disconnected, 0=connecting, 1=connected

  // 转换聊天记录格式
  const transformRecordsToChats = useCallback((records) => {
    if (!Array.isArray(records)) return [];

    return records.map(record => ({
      id: record.id,
      role: record.senderId === myId ? 'user' : 'assistant',
      content: record.content,
      createAt: new Date(record.sendTime).getTime(),
      isRead: record.isRead,
    }));
  }, [messages]);
  /**
   * @description websocket连接
   */

  const checkConnection = () => {
    const currentStatus = chatService.getStatus();
    console.log(currentStatus, connectionState)
    if (currentStatus !== connectionState) {
      setConnectionState(currentStatus);
    }
  };
  // 监听连接状态变化
  useEffect(() => {
    // 初始检查
    checkConnection();
    // 定期检查连接状态
    const interval = setInterval(checkConnection, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [connectionState]);

  // 连接WebSocket（如果未连接）
  useEffect(() => {
    if (connectionState === 2) { // disconnected
      console.log('尝试连接WebSocket...');
      chatService.connect(
        () => {
          console.log('聊天组件：WebSocket连接成功');
          setConnectionState(1);
        },
        (error) => {
          console.error('聊天组件：WebSocket连接失败:', error);
          setConnectionState(2);
          messageApi.error('连接服务器失败，请检查网络');
        }
      );
    }
  }, [connectionState, messageApi]);
  // 订阅消息
  useEffect(() => {
    if (connectionState !== 1 || !userId) return;
    console.log('初始化聊天组件，用户ID:', userId);
    const id = chatService.subscribeChat('chat', {
      [SubscriptionTypes.CHAT_DETAIL]: handleChatDetail,
      [SubscriptionTypes.CHAT_NEW_MESSAGE]: handleNewMessage,
      [SubscriptionTypes.CHAT_MESSAGE_SENT]: handleMessageSent,
      [SubscriptionTypes.CHAT_DELETE]: handleDel,
      [SubscriptionTypes.CHAT_REVOKE]: handleRevoke
    })
    chatService.getChatDetail(userId)

    return () => {
      console.log('清理聊天组件');
      chatService.unregister(id);
    };
  }, [connectionState, userId]);

  /**
   * @description 获取数据
   */

  // 获取聊天详情
  const fetchChatDetail = useCallback(async () => {
    if (!userId || connectionState !== 1) return;
    try {
      const success = chatService.getChatDetail(userId);
      if (!success) {
        throw new Error('获取聊天记录失败');
      }
    } catch (error) {
      console.error('获取聊天详情错误:', error);
      messageApi.error('获取聊天记录失败，请重试');
    } finally {
    }
  }, [userId, connectionState, messageApi]);

  // 当userId变化时重新获取聊天记录
  useEffect(() => {
    if (userId && connectionState === 1) {
      fetchChatDetail();
    }
  }, [userId, connectionState, fetchChatDetail]);

  /**
   * @description 事件处理
   */


  // 收到新消息
  const handleNewMessage = useCallback((message) => {
    console.log('收到新消息:', message);

    if (message.senderId === userId || message.receiverId === userId) {
      const newMessage = {
        id: message.id || Date.now(),
        role: message.senderId === myId ? 'user' : 'assistant',
        content: message.content,
        createAt: new Date(message.timestamp || new Date()).getTime(),
        isRead: true,
      };

      setMessages(prev => [...prev, newMessage]);
    }
  }, [userId, myId]);

  // 消息发送的回调函数
  const handleMessageSent = useCallback((message) => {
    console.log('消息发送确认:', message);

    if (message.id) {
      messageApi.success('发送成功');
      // 转换消息
      const newMessage = transformRecordsToChats([message])[0];
      setMessages(prev => {
        if (prev.length === 0) {
          return [newMessage];
        }
        const updatedList = [...prev];
        updatedList[prev.length - 1] = newMessage;
        return updatedList;
      });
    } else {
      // 发送失败处理：同样基于最新状态
      setMessages(prev => {
        if (prev.length === 0) return [];
        const updatedList = [...prev];
        const lastMsg = updatedList[prev.length - 1];
        updatedList[prev.length - 1] = { ...lastMsg, id: 'error', status: 'error' };
        return updatedList;
      });
      messageApi.error("发送失败");
    }
  }, [messageApi, transformRecordsToChats]);

  // 聊天详情改变
  const handleChatDetail = useCallback((chatData) => {
    console.log('收到聊天详情:', chatData);
    if (chatData && chatData.records) {
      const transformedChats = transformRecordsToChats(chatData.records, myId, userId);
      setMessages(transformedChats);
    } else {
      setMessages([]);
    }
  }, [myId, userId]);
  // 删除消息回调
  const handleDel = useCallback((message) => {

    console.log('消息删除确认:', message);
    if (message) {
      messageApi.success('删除成功');
      setMessages(prev => [...prev.filter(item => item.id !== message)]);
    } else {
      messageApi.error("删除失败")
    }
  }, [messageApi]);
  // 撤回消息回调
  const handleRevoke = useCallback((message) => {
    console.log('消息撤回确认:', message);
    if (message) {
      messageApi.success('撤回成功');
      setMessages(prev => [...prev.filter(item => item.id !== message)]);
    } else {
      messageApi.error("撤回失败")
    }
  }, [messageApi]);

  // 手动重连
  const handleReconnect = useCallback(() => {
    if (connectionState === 0) {
      messageApi.info('正在连接中，请稍候...');
      return;
    }

    setConnectionState(2); // 设置为断开状态，触发重连
    messageApi.info('正在重新连接...');

    console.log('尝试连接WebSocket...');
    chatService.connect(
      () => {
        console.log('聊天组件：WebSocket连接成功');
        setConnectionState(1);
      },
      (error) => {
        console.error('聊天组件：WebSocket连接失败:', error);
        setConnectionState(2);
        messageApi.error('连接服务器失败，请检查网络');
      }
    );

  }, [connectionState, messageApi]);

  // 发送消息
  const onMessageSend = useCallback(async (content, attachment) => {
    if (!content.trim()) return;

    // 检查连接状态
    if (connectionState !== 1) {
      messageApi.warning('正在连接服务器中，请稍后发送...');
      return;
    }
    chatService.sendChatMessage(content, userId);
    const optimisticMessage = {
      id: 'loading',
      content: content,
      role: 'user',
      createAt: Date.now(),
      isRead: true,
      status: 'loading'
    };
    setMessages(prev => [...prev, optimisticMessage]);
  }, [userId, messageApi, connectionState]);
  // 删除消息
  const onMessageDelete = useCallback(async (content) => {
    if (!content.id) return;
    const findPopconfirmDom = () => {
      return document.querySelector('.semi-tooltip-content');
    };
    // 检查连接状态
    if (connectionState !== 1) {
      messageApi.warning('正在连接服务器中，请稍后删除...');
      setTimeout(() => {
        const modalDom = findPopconfirmDom();
        if (modalDom) {
          modalDom.remove(); // 直接从DOM中删除弹框
          console.log('弹框已强制删除');
        }
      }, 100);
      return;
    }
    chatService.delChatMessage(content.id);
    setTimeout(() => {
      const modalDom = findPopconfirmDom();
      if (modalDom) {
        modalDom.remove();
        console.log('弹框已强制删除');
      }
    }, 100);
  }, [userId, messageApi, connectionState]);

  const onChatsChange = useCallback((chats) => {
    setMessages(chats);
  }, []);
  // 撤回消息
  const onRevole = useCallback(async (content) => {
    if (!content.id || content.role !== 'user') return;

    // 检查连接状态
    if (connectionState !== 1) {
      messageApi.warning('正在连接服务器中，请稍后撤回...');
      return;
    }
    chatService.revokeChatMessage(content.id);
  }, [userId, messageApi, connectionState]);


  // 获取连接状态文本和颜色
  const getConnectionStatus = () => {
    switch (connectionState) {
      case 1: return { text: '已连接服务器', color: 'bg-green' };
      case 0: return { text: '连接服务器中...', color: 'bg-orange' };
      default: return { text: '未连接服务器', color: 'bg-red' };
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <MyButton
          type="black"
          icon={<ArrowLeftOutlined />}
          className="w-30"
          onClick={onBack}
        >
          返回
        </MyButton>
        <div className='flex gap-4'>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getConnectionStatus().color}`}></div>
            <span className="text-sm text-gray-600">
              {getConnectionStatus().text}
            </span>
          </div>
          {connectionState === 2 && (
            <MyButton
              type="black"
              size="small"
              onClick={handleReconnect}
            >
              重新连接
            </MyButton>
          )}
        </div>

      </div>

      {!isArrayValid(messages) ? (
        <MyEmpty description={connectionState === 1 ? "暂无聊天记录，开始一段对话吧！" : "正在连接..."} />
      ) : (
        <Chat
          className='mx-7xl'
          align="leftRight"
          selfRole="user"
          chats={messages}
          style={commonOuterStyle}
          onMessageCopy={onRevole}
          roleConfig={roleInfo}
          // onChatsChange={onChatsChange}
          onMessageDelete={onMessageDelete}
          onMessageSend={onMessageSend}
          uploadProps={uploadProps}
          placeholder={connectionState === 1 ? "输入消息..." : "获取消息中，请稍候..."}
        />
      )}
    </>
  );
};



export const MessageList = ({ activeKey, data }) => {
  const navigate = useNavigate();
  //转跳
  const onClick = (id, type) => {
    navigate(`/${TARGETCLICK[type]}/${id}`)
  }

  // 空状态处理
  if (data.length === 0) {
    return <MyEmpty description="暂无消息通知" />
  }

  return (
    <div className="pt-3">
      {data.map(item => {
        const {
          id,
          type,
          senderId = null,
          receiverId = null,
          sendTime = "",
          isRead = false,
          review = "",
          sender = {},
          messageTarget = {},
          reviewTarget = {}
        } = item;
        const {
          userId,
          username = "匿名用户",
          avatar = "",
          school = "",
          grade = "",
          major = "",
          online } = sender
        const { targetId = null, title = "", content = "" } = messageTarget || {}
        const { reviewTargetId = null, reviewTitle = "", reviewType } = reviewTarget || {}
        return (
          <div
            key={id}
            className="flex items-center p-3 setting rounded-lg cursor-pointer transition-colors"
          >
            {/* 用户头像 + 在线状态 */}
            <div className="relative mr-4">
              <Avatar src={avatar} size={56} icon={senderId === -1 ? <SafetyCertificateOutlined /> : null} />
              {online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-dark rounded-full"></div>
              )}
            </div>
            {/* 消息内容 */}
            <div className="flex-1">
              <div className='flex gap-4 items-center text-secondary text-sm'>
                <div className='cursor-pointer text-main  text-base font-semibold' title={activeKey === 'system' ? "系统通知" : username}>
                  {activeKey === 'system' ? "系统通知" : username}
                </div>
                {[school, major, grade].filter(Boolean).join(" / ")}
              </div>
              {/* 消息内容（未读加粗） */}
              {/* {
                type === 4 ? <p className="text-secondary truncate line-clamp-2 leading-5">{message}</p>
              } */}
              <div className="text-secondary line-clamp-2 leading-5 my-2">
                {
                  type === 4 && (
                    <>
                      {MyMESSAGE_TYPE[activeKey]}了您在{TARGETTYPE[reviewType]}
                      <span className='text-muted mx-2' onClick={() => onClick(reviewTargetId, reviewType)}>{reviewTitle}</span>的评论
                      <span className='text-muted ml-2'>
                        “{content}”
                      </span>

                    </>
                  )
                }
                {
                  activeKey === 'system' && <>{item.content}</>
                }
                {type !== 4 && activeKey !== 'system' &&
                  <>
                    {MyMESSAGE_TYPE[activeKey]}了您的{TARGETTYPE[type]}
                    <span className='text-muted ml-2' onClick={() => onClick(targetId, type)}>
                      {title}
                    </span>
                  </>}

                {activeKey === 'review' && <p className='pt-2 text-main'>“{review}”</p>}
              </div>
              <div className="text-sm text-secondary mt-1">{sendTime}</div>
            </div>
            {!isRead && (
              <div className="bg-red text-light w-3 h-3 text-center rounded-full ml-6">
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
};