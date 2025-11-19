import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Chat, Icon, Modal, Radio } from '@douyinfe/semi-ui';
import { IconUndo } from '@douyinfe/semi-icons';
import { Avatar, Empty } from "antd";
import './index.less'
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useGetUserChats, useGetUserMessagesCollect, useGetUserMessagesLike, useGetUserMessagesReview, useGetUserMessagesSystem } from '../../hooks/api/user';
import { isArrayValid } from '../../utils/commonUtil';
import { MyMESSAGE_TYPE } from '../../utils/constant/types';
import { TARGETCLICK, TARGETTYPE } from '../../utils/constant/order';
import { MyEmpty } from '../MyEmpty';
import { useNavigate } from 'react-router-dom';
import { setMessageCount, setWebsocketStatus } from '../../store/slices/userCenterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '../MyButton';
import { useMessage } from '../AppProvider';
import _ from 'lodash';
import { useChat } from '../../hooks/api/useChat';
import MyChat from './MyChat';
import MyList from '../MyList';

export const ChatMessage = () => {
  const dispatch = useDispatch();
  const messageApi = useMessage();
  const { username, avata, id: userId } = useSelector(state => state.auth);
  const [chatOpen, setChatOpen] = useState(null);
  const [data, setData] = useState(null);
  const { getChats, SubscriptionTypes, subscribeChats } = useChat()
  // const { data = {} } = useGetUserChats({
  //   onSuccess: (data) => dispatch(setMessageCount({ chat: data?.total })),
  // });
  /**
     * @description websocket连接与状态检查
     */
  // 订阅消息
  useEffect(() => {
    if (!userId) return;
    console.log('初始化聊天列表，用户ID:', userId);
    const id = subscribeChats('chats', {
      [SubscriptionTypes.CHAT_LISTS]: handleChats,
    })
    getChats(userId)
  }, [userId]);

  const handleChats = useCallback((message) => {
    setData(pre => message)
  }, [messageApi])

  // 空状态处理
  if (!isArrayValid(data?.records)) {
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
          isRevoke = false,
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
              <p className="line-clamp-2 leading-5 my-2">{isRevoke ? "[该消息已撤回]" : content}</p>
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

// export const MyChat = ({ user, onBack }) => {
//   const commonOuterStyle = {
//     border: '1px solid var(--semi-color-border)',
//     borderRadius: '16px',
//     height: 800,
//   };

//   const { username: myName, avatar: myAvatar, id: myId } = useSelector(state => state.auth);
//   const websocketStatus = useSelector(state => state.userCenter.websocketStatus)
//   const { userId, username, avatar } = user;
//   const messageApi = useMessage();


//   // 构建角色配置
//   const roleInfo = {
//     user: {
//       name: myName,
//       avatar: myAvatar
//     },
//     assistant: {
//       name: username,
//       avatar: avatar
//     }
//   };

//   const uploadProps = {
//     action: 'https://api.semi.design/upload'
//   };

//   /**
//  * @description State管理
//  */

//   const [messages, setMessages] = useState([]);

//   const { SubscriptionTypes, subscribeChat, getChatDetail, connect, delChatMessage, sendChatMessage, revokeChatMessage, readChatMessage, disconnect } = useChat(true)
//   // 转换聊天记录格式
//   const transformRecordsToChats = useCallback((records) => {
//     if (!Array.isArray(records)) return [];

//     return records.map(record => ({
//       id: record.id,
//       role: record.senderId === myId ? 'user' : 'assistant',
//       content: record.isRevoke ? '[该消息已撤回]' : record.content,
//       createAt: new Date(record.sendTime).getTime(),
//       isRead: record.isRead,
//       isRevoke: record.isRevoke,
//     }));
//   }, [messages]);
//   /**
//    * @description websocket连接与状态检查
//    */
//   // 订阅消息
//   useEffect(() => {
//     if (websocketStatus !== 1 || !userId) return;
//     console.log('初始化聊天组件，用户ID:', userId);
//     const id = subscribeChat('chat', {
//       [SubscriptionTypes.CHAT_DETAIL]: handleChatDetail,
//       [SubscriptionTypes.CHAT_NEW_MESSAGE]: handleNewMessage,
//       [SubscriptionTypes.CHAT_MESSAGE_SENT]: handleMessageSent,
//       [SubscriptionTypes.CHAT_DELETE]: handleDel,
//       [SubscriptionTypes.CHAT_REVOKE]: handleRevoke
//     })
//     getChatDetail(userId)
//   }, [websocketStatus, userId]);

//   /**
//    * @description 获取数据
//    */

//   // 获取聊天详情
//   const fetchChatDetail = useCallback(async () => {
//     if (!userId || websocketStatus !== 1) return;
//     try {
//       const success = getChatDetail(userId);
//       if (!success) {
//         throw new Error('获取聊天记录失败');
//       }
//     } catch (error) {
//       console.error('获取聊天详情错误:', error);
//       messageApi.error('获取聊天记录失败，请重试');
//     } finally {
//     }
//   }, [userId, websocketStatus, messageApi]);

//   // 当userId变化时重新获取聊天记录
//   useEffect(() => {
//     if (userId && websocketStatus === 1) {
//       fetchChatDetail();
//       readChatMessage(userId)
//     }
//   }, [userId, websocketStatus, fetchChatDetail]);

//   /**
//    * @description 事件处理
//    */


//   // 收到新消息
//   const handleNewMessage = useCallback((message) => {
//     console.log('收到新消息:', message);

//     if (message.senderId === userId || message.receiverId === userId) {
//       const newMessage = transformRecordsToChats([message])[0];
//       setMessages(prev => {
//         if (prev.length === 0) {
//           return [newMessage];
//         }
//         const updatedList = [...prev];
//         updatedList[prev.length - 1] = newMessage;
//         return updatedList;
//       });
//     }
//   }, [userId, myId]);

//   // 消息发送的回调函数
//   const handleMessageSent = useCallback((message) => {
//     console.log('消息发送确认:', message);

//     if (message.id) {
//       messageApi.success('发送成功');
//       // 转换消息
//       const newMessage = transformRecordsToChats([message])[0];
//       setMessages(prev => {
//         if (prev.length === 0) {
//           return [newMessage];
//         }
//         const updatedList = [...prev];
//         updatedList[prev.length - 1] = newMessage;
//         return updatedList;
//       });
//     } else {
//       // 发送失败处理：同样基于最新状态
//       setMessages(prev => {
//         if (prev.length === 0) return [];
//         const updatedList = [...prev];
//         const lastMsg = updatedList[prev.length - 1];
//         updatedList[prev.length - 1] = { ...lastMsg, id: 'error', status: 'error' };
//         return updatedList;
//       });
//       messageApi.error("发送失败");
//     }
//   }, [messageApi, transformRecordsToChats]);

//   // 聊天详情改变
//   const handleChatDetail = useCallback((chatData) => {
//     console.log('收到聊天详情:', chatData);
//     if (chatData && Array.isArray(chatData.records)) {
//       const transformedChats = transformRecordsToChats(chatData.records, myId, userId);
//       setMessages(transformedChats);
//     } else {
//       console.error('获取聊天详情错误:', error);
//       messageApi.error('获取聊天记录失败，请重试');
//       setMessages([]);
//     }
//   }, [myId, userId]);
//   // 删除消息回调
//   const handleDel = useCallback((message) => {

//     console.log('消息删除确认:', message);
//     if (message) {
//       messageApi.success('删除成功');
//       setMessages(prev => [...prev.filter(item => item.id !== message)]);
//     } else {
//       messageApi.error("删除失败")
//     }
//   }, [messageApi]);
//   // 撤回消息回调
//   const handleRevoke = useCallback((message) => {
//     console.log('消息撤回确认:', message);
//     if (message) {
//       messageApi.success('撤回成功');
//       setMessages(prev => {
//         const updatedList = [...prev];
//         const newMessage = updatedList.find(item => item.id === message);
//         newMessage.isRevoke = true;
//         newMessage.content = '[该消息已撤回]'
//         return updatedList;
//       });
//     } else {
//       messageApi.error("撤回失败")
//     }
//   }, [messageApi]);

//   // 手动重连
//   const handleReconnect = useCallback(() => {
//     if (websocketStatus === 0) {
//       messageApi.info('正在连接中，请稍候...');
//       return;
//     }
//     disconnect();
//     dispatch(setWebsocketStatus(2))// 设置为断开状态，触发重连
//     messageApi.info('正在重新连接...');
//     console.log('尝试连接WebSocket...');
//   }, [websocketStatus, messageApi]);

//   // 发送消息
//   const onMessageSend = useCallback(async (content, attachment) => {
//     if (!content.trim()) return;

//     // 检查连接状态
//     if (websocketStatus !== 1) {
//       messageApi.warning('正在连接服务器中，请稍后发送...');
//       return;
//     }
//     sendChatMessage(content, userId);
//     const optimisticMessage = {
//       id: 'loading',
//       content: content,
//       role: 'user',
//       createAt: Date.now(),
//       isRead: true,
//       status: 'loading'
//     };
//     setMessages(prev => [...prev, optimisticMessage]);
//   }, [userId, messageApi, websocketStatus]);
//   // 删除消息
//   const onMessageDelete = useCallback(async (content) => {
//     if (!content.id) return;
//     const findPopconfirmDom = () => {
//       return document.querySelector('.semi-tooltip-content');
//     };
//     // 检查连接状态
//     if (websocketStatus !== 1) {
//       messageApi.warning('正在连接服务器中，请稍后删除...');
//       setTimeout(() => {
//         const modalDom = findPopconfirmDom();
//         if (modalDom) {
//           modalDom.remove(); // 直接从DOM中删除弹框
//           console.log('弹框已强制删除');
//         }
//       }, 100);
//       return;
//     }
//     delChatMessage(content.id);
//     setTimeout(() => {
//       const modalDom = findPopconfirmDom();
//       if (modalDom) {
//         modalDom.remove();
//         console.log('弹框已强制删除');
//       }
//     }, 100);
//   }, [userId, messageApi, websocketStatus]);

//   const onMessageCopy = useCallback((message) => {
//     navigator.clipboard.writeText(message.content).then(() => {
//       messageApi.success('已复制到剪贴板');
//     }).catch(error => {
//       messageApi.error('复制失败');
//       console.error('复制消息错误:', error);
//     });
//   }, [messageApi]);
//   const onChatsChange = useCallback((chats) => {
//     setMessages(chats);
//   }, []);
//   // 撤回消息
//   const onRevoke = useCallback(async (content) => {
//     if (!content.id || content.role !== 'user') return;

//     // 检查连接状态
//     if (websocketStatus !== 1) {
//       messageApi.warning('正在连接服务器中，请稍后撤回...');
//       return;
//     }
//     revokeChatMessage(content.id);
//   }, [userId, messageApi, websocketStatus]);


//   // 获取连接状态文本和颜色
//   const getConnectionStatus = () => {
//     switch (websocketStatus) {
//       case 1: return { text: '已连接服务器', color: 'bg-green' };
//       case 0: return { text: '连接服务器中...', color: 'bg-orange' };
//       default: return { text: '未连接服务器', color: 'bg-red' };
//     }
//   };
//   const renderChatBoxAction = useCallback((message) => {
//     // 判断是否为“自己的消息”（selfRole 配置为 "user"，所以 message.role === "user" 时是自己）

//     const isSelfMessage = message.message.role === 'user';
//     return (
//       <div style={{ display: 'flex', gap: '4px' }}>
//         {isSelfMessage ? (
//           <>
//             {message.defaultActionsObj.copyNode}
//             {message.defaultActionsObj.deleteNode}
//             {message.defaultActionsObj.resetNode}
//             <IconUndo className='cursor-pointer' onClick={() => onRevoke(message.message)} />
//           </>

//         ) : (
//           // 他人的消息：渲染「拷贝」和「删除」按钮
//           <>
//             {message.defaultActionsObj.copyNode}
//             {message.defaultActionsObj.deleteNode}
//           </>
//         )}
//       </div>
//     );
//   }, [onMessageCopy, onMessageDelete, onRevoke]);

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         <MyButton
//           type="black"
//           icon={<ArrowLeftOutlined />}
//           className="w-30"
//           onClick={onBack}
//         >
//           返回
//         </MyButton>
//         <div className='flex gap-4'>
//           <div className="flex items-center gap-2">
//             <div className={`w-3 h-3 rounded-full ${getConnectionStatus().color}`}></div>
//             <span className="text-sm text-gray-600">
//               {getConnectionStatus().text}
//             </span>
//           </div>
//           {websocketStatus !== 1 && (
//             <MyButton
//               type="black"
//               size="small"
//               onClick={handleReconnect}
//             >
//               重新连接
//             </MyButton>
//           )}
//         </div>

//       </div>

//       {!isArrayValid(messages) ? (
//         <MyEmpty description={websocketStatus === 1 ? "暂无聊天记录，开始一段对话吧！" : "正在连接..."} />
//       ) : (
//         <Chat
//           className='mx-7xl'
//           align="leftRight"
//           selfRole="user"
//           chats={messages}
//           style={commonOuterStyle}
//           chatBoxRenderConfig={{ renderChatBoxAction }}
//           roleConfig={roleInfo}
//           onMessageDelete={onMessageDelete}
//           onMessageSend={onMessageSend}
//           uploadProps={uploadProps}
//           placeholder={websocketStatus === 1 ? "输入消息..." : "获取消息中，请稍候..."}
//         />
//       )}
//     </>
//   );
// };



export const MessageList = ({ activeKey, data }) => {
  const MessageItem = ({ item, activeKey, onClick }) => {
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
      online
    } = sender;

    const { targetId = null, title = "", content = "" } = messageTarget || {};
    const { reviewTargetId = null, reviewTitle = "", reviewType } = reviewTarget || {};

    return (
      <div
        className="flex items-center p-3 setting rounded-lg cursor-pointer transition-colors"
        onClick={() => onClick && onClick(item)}
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
            <div className='cursor-pointer text-main text-base font-semibold' title={activeKey === 'system' ? "系统通知" : username}>
              {activeKey === 'system' ? "系统通知" : username}
            </div>
            {[school, major, grade].filter(Boolean).join(" / ")}
          </div>

          {/* 消息内容（未读加粗） */}
          <div className="text-secondary line-clamp-2 leading-5 my-2">
            {type === 4 && (
              <>
                {MyMESSAGE_TYPE[activeKey]}了您在{TARGETTYPE[reviewType]}
                <span
                  className='text-muted mx-2 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick({ ...item, targetId: reviewTargetId, type: reviewType });
                  }}
                >
                  {reviewTitle}
                </span>的评论
                <span className='text-muted ml-2'>“{content}”</span>
              </>
            )}

            {activeKey === 'system' && <>{item.content}</>}

            {type !== 4 && activeKey !== 'system' && (
              <>
                {MyMESSAGE_TYPE[activeKey]}了您的{TARGETTYPE[type]}
                <span
                  className='text-muted ml-2 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick(item);
                  }}
                >
                  {title}
                </span>
              </>
            )}

            {activeKey === 'review' && <p className='pt-2 text-main'>“{review}”</p>}
          </div>

          <div className="text-sm text-secondary mt-1">{sendTime}</div>
        </div>

        {!isRead && (
          <div className="bg-red text-light w-3 h-3 text-center rounded-full ml-6"></div>
        )}
      </div>
    );
  };
  const navigate = useNavigate();
  const getFn = () => {
    switch (activeKey) {
      case 'like':
        return useGetUserMessagesLike;
      case 'collect':
        return useGetUserMessagesCollect;
      case 'review':
        return useGetUserMessagesReview;
      case 'system':
        return useGetUserMessagesSystem;
    }
  }
  // 处理消息项点击事件
  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
      return;
    }

    // 默认点击行为：跳转到对应页面
    const { type, targetId, reviewType, reviewTargetId } = item;
    const navigateType = type === 4 ? reviewType : type;
    const navigateId = type === 4 ? reviewTargetId : targetId;

    if (navigateId && TARGETCLICK[navigateType]) {
      navigate(`/${TARGETCLICK[navigateType]}/${navigateId}`);
    }
  };

  // 渲染单个消息项
  const renderMessageItem = ({ item, index }) => (
    <MessageItem
      key={item.id || index}
      item={item}
      activeKey={activeKey}
      onClick={handleItemClick}
    />
  );

  // 空状态渲染
  const renderEmpty = () => (
    <MyEmpty description="暂无消息通知" />
  );

  return (
    <div className={`pt-3`}>
      <MyList
        fetchData={getFn()}
        activeKey={activeKey}
        renderItem={renderMessageItem}
        pageSize={20}
        emptyText="暂无消息通知"
        endText="没有更多消息了"
        renderEmpty={renderEmpty}
      />
    </div>
  );

  // const navigate = useNavigate();
  // //转跳
  // const onClick = (id, type) => {
  //   navigate(`/${TARGETCLICK[type]}/${id}`)
  // }

  // // 空状态处理
  // if (data.length === 0) {
  //   return <MyEmpty description="暂无消息通知" />
  // }

  // return (
  //   <div className="pt-3">
  //     {data.map(item => {
  //       const {
  //         id,
  //         type,
  //         senderId = null,
  //         receiverId = null,
  //         sendTime = "",
  //         isRead = false,
  //         review = "",
  //         sender = {},
  //         messageTarget = {},
  //         reviewTarget = {}
  //       } = item;
  //       const {
  //         userId,
  //         username = "匿名用户",
  //         avatar = "",
  //         school = "",
  //         grade = "",
  //         major = "",
  //         online } = sender
  //       const { targetId = null, title = "", content = "" } = messageTarget || {}
  //       const { reviewTargetId = null, reviewTitle = "", reviewType } = reviewTarget || {}
  //       return (
  //         <div
  //           key={id}
  //           className="flex items-center p-3 setting rounded-lg cursor-pointer transition-colors"
  //         >
  //           {/* 用户头像 + 在线状态 */}
  //           <div className="relative mr-4">
  //             <Avatar src={avatar} size={56} icon={senderId === -1 ? <SafetyCertificateOutlined /> : null} />
  //             {online && (
  //               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-dark rounded-full"></div>
  //             )}
  //           </div>
  //           {/* 消息内容 */}
  //           <div className="flex-1">
  //             <div className='flex gap-4 items-center text-secondary text-sm'>
  //               <div className='cursor-pointer text-main  text-base font-semibold' title={activeKey === 'system' ? "系统通知" : username}>
  //                 {activeKey === 'system' ? "系统通知" : username}
  //               </div>
  //               {[school, major, grade].filter(Boolean).join(" / ")}
  //             </div>
  //             {/* 消息内容（未读加粗） */}
  //             {/* {
  //               type === 4 ? <p className="text-secondary truncate line-clamp-2 leading-5">{message}</p>
  //             } */}
  //             <div className="text-secondary line-clamp-2 leading-5 my-2">
  //               {
  //                 type === 4 && (
  //                   <>
  //                     {MyMESSAGE_TYPE[activeKey]}了您在{TARGETTYPE[reviewType]}
  //                     <span className='text-muted mx-2' onClick={() => onClick(reviewTargetId, reviewType)}>{reviewTitle}</span>的评论
  //                     <span className='text-muted ml-2'>
  //                       “{content}”
  //                     </span>

  //                   </>
  //                 )
  //               }
  //               {
  //                 activeKey === 'system' && <>{item.content}</>
  //               }
  //               {type !== 4 && activeKey !== 'system' &&
  //                 <>
  //                   {MyMESSAGE_TYPE[activeKey]}了您的{TARGETTYPE[type]}
  //                   <span className='text-muted ml-2' onClick={() => onClick(targetId, type)}>
  //                     {title}
  //                   </span>
  //                 </>}

  //               {activeKey === 'review' && <p className='pt-2 text-main'>“{review}”</p>}
  //             </div>
  //             <div className="text-sm text-secondary mt-1">{sendTime}</div>
  //           </div>
  //           {!isRead && (
  //             <div className="bg-red text-light w-3 h-3 text-center rounded-full ml-6">
  //             </div>
  //           )}
  //         </div>
  //       )
  //     })}
  //   </div>
  // );
};