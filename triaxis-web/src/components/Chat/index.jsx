import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Chat, Radio } from '@douyinfe/semi-ui';
import { Avatar, Empty } from "antd";
import './index.less'
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useGetUserChat, useGetUserChats, useGetUserMessagesCollect, useGetUserMessagesLike, useSendChat } from '../../hooks/api/user';
import { isArrayValid } from '../../utils/commonUtil';
import { MyMESSAGE_TYPE } from '../../utils/constant/types';
import { TARGETCLICK, TARGETTYPE } from '../../utils/constant/order';
import { MyEmpty } from '../MyEmpty';
import { useNavigate } from 'react-router-dom';
import { setMessageCount } from '../../store/slices/userCenterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '../MyButton';
import { useMessage } from '../AppProvider';
import WebSocketService from '../../api/websocket/webSocketService';
import chatApiService from '../../api/websocket/chatApiService';

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
  };

  const { username: myName, avatar: myAvatar, id: myId } = useSelector(state => state.auth);
  const { userId, username, avatar } = user;
  const messageApi = useMessage();

  // State管理
  const [messages, setMessages] = useState([]);
  const [connectionState, setConnectionState] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'

  // WebSocket连接和消息处理
  useEffect(() => {
    console.log('初始化聊天组件，用户ID:', userId);

    // 初始化聊天API服务
    chatApiService.init({
      newMessage: handleNewMessage,
      messageSent: handleMessageSent,
      messageCountUpdate: handleMessageCountUpdate,
      notification: handleNotification,
      chatDetail: handleChatDetail
    });

    // 连接WebSocket
    setConnectionState('connecting');
    chatApiService.connect(
      handleConnect,
      handleError
    );

    return () => {
      console.log('清理聊天组件');
      chatApiService.disconnect();
    };
  }, [userId]);

  // 连接成功后获取聊天记录
  useEffect(() => {
    if (connectionState === 'connected' && userId) {
      console.log('连接成功，获取聊天详情:', userId);
      chatApiService.getChatDetail(userId);
    }
  }, [connectionState, userId]);

  // 消息处理函数
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

  const handleMessageSent = useCallback((message) => {
    console.log('消息发送确认:', message);
    messageApi.success('发送成功');
  }, [messageApi]);

  const handleMessageCountUpdate = useCallback((countData) => {
    console.log('消息数量更新:', countData);
  }, []);

  const handleNotification = useCallback((notification) => {
    console.log('收到通知:', notification);
    messageApi.info(notification.content);
  }, [messageApi]);

  const handleChatDetail = useCallback((chatData) => {
    console.log('收到聊天详情:', chatData);
    if (chatData && chatData.records) {
      const transformedChats = transformRecordsToChats(chatData.records, myId, userId);
      setMessages(transformedChats);
    }
  }, [myId, userId]);

  const handleError = useCallback((error) => {
    console.error('WebSocket连接错误:', error);
    setConnectionState('disconnected');
    messageApi.error('连接失败: ' + error.message);
  }, [messageApi]);

  const handleConnect = useCallback(() => {
    console.log('WebSocket连接成功');
    setConnectionState('connected');

    // 连接成功后获取消息数量
    chatApiService.getMessageCount();
  }, []);

  // 转换聊天记录格式
  const transformRecordsToChats = useCallback((records, myId, friendId) => {
    if (!Array.isArray(records)) return [];

    return records.map(record => ({
      id: record.id,
      role: record.senderId === myId ? 'user' : 'assistant',
      content: record.content,
      createAt: new Date(record.sendTime).getTime(),
      isRead: record.isRead,
    }));
  }, []);

  // 发送消息回调
  const onMessageSend = useCallback(async (content, attachment) => {
    if (!content.trim()) return;

    // 检查连接状态
    if (connectionState !== 'connected') {
      messageApi.warning('正在连接中，请稍后发送...');
      return;
    }

    try {
      const success = chatApiService.sendMessage(content, userId);

      if (success) {
        // 乐观更新
        const optimisticMessage = {
          id: Date.now(),
          role: 'user',
          content: content,
          createAt: Date.now(),
          isRead: true,
        };

        setMessages(prev => [...prev, optimisticMessage]);
      } else {
        messageApi.warning('消息发送失败，请检查连接状态');
      }

    } catch (error) {
      console.error('发送消息错误:', error);
      messageApi.error('发送失败，请重试');
    }
  }, [userId, messageApi, connectionState]);

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

  // 获取连接状态文本和颜色
  const getConnectionStatus = () => {
    switch (connectionState) {
      case 'connected': return { text: '已连接', color: 'bg-green-500' };
      case 'connecting': return { text: '连接中...', color: 'bg-yellow-500' };
      default: return { text: '未连接', color: 'bg-red-500' };
    }
  };

  const status = getConnectionStatus();

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

        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
          <span className="text-sm text-gray-600">
            {status.text}
          </span>
        </div>
      </div>

      {!isArrayValid(messages) ? (
        <MyEmpty description={connectionState === 'connected' ? "暂无聊天记录，开始一段对话吧！" : "正在连接..."} />
      ) : (
        <Chat
          className='mx-7xl'
          align="leftRight"
          selfRole="user"
          chats={messages}
          style={commonOuterStyle}
          roleConfig={roleInfo}
          onMessageSend={onMessageSend}
          uploadProps={uploadProps}
          placeholder={connectionState === 'connected' ? "输入消息..." : "连接中，请稍候..."}
          disabled={connectionState !== 'connected'}
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