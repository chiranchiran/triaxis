import React, { useState, useCallback, useRef } from 'react';
import { Chat, Radio } from '@douyinfe/semi-ui';
import { Avatar, Empty } from "antd";
import './index.less'
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useGetUserChat, useGetUserChats, useGetUserMessagesCollect, useGetUserMessagesLike } from '../../hooks/api/user';
import { isArrayValid } from '../../utils/commonUtil';
import { MyMESSAGE_TYPE } from '../../utils/constant/types';
import { TARGETCLICK, TARGETTYPE } from '../../utils/constant/order';
import { MyEmpty } from '../MyEmpty';
import { useNavigate } from 'react-router-dom';
import { setMessageCount } from '../../store/slices/userCenterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '../MyButton';

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
          lastMessage: {
            content = "",
            sendTime = "" }
        } = item;
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
  }
  const { username: myName, avatar: myAvatar, id: myId } = useSelector(state => state.auth);
  const { userId, username, avatar } = user
  /**
   * @description 构建角色和聊天记录
   */

  const roleInfo = {
    user: {
      name: myName,
      avatar: myAvatar
    },
    assistant: {
      name: username,
      avatar: avatar
    }
  }
  // 转换 records为 Chat 组件消息格式
  const transformRecordsToChats = (records, myId, friendId) => {
    if (!Array.isArray(records)) return [];

    return records
      .map(record => ({
        id: record.id,
        role: record.senderId === myId ? 'user' : 'assistant',
        content: record.content,
        // send_time 转换为毫秒时间戳
        createAt: new Date(record.sendTime).getTime(),
        isRead: record.isRead,
      }));
  };
  /**
 * @description state管理
 */

  const [message, setMessage] = useState();
  /**
   * @description 数据获取
   */

  const { data = {} } = useGetUserChat(userId, {
    enabled: !!userId,
    onSuccess: (data) => {
      const { total = 0, records = [] } = data;
      const transformedChats = transformRecordsToChats(records, myId, userId);
      setMessage(transformedChats);
    }
  });

  /**
   * @description 事件处理
   */
  // 发送消息回调
  const onMessageSend = useCallback((content, attachment) => {
  }, []);
  // 消息列表发生改变的回调
  const onChatsChange = useCallback((chats) => {
  }, []);
  //上传文件触发
  const uploadProps = { action: 'https://api.semi.design/upload' }
  return (
    <>
      <MyButton type="black" icon={<ArrowLeftOutlined />} className="mb-3 w-30" onClick={onBack}>返回</MyButton>
      {!isArrayValid(message) && <MyEmpty description="暂无聊天记录" />}
      <Chat
        className='mx-7xl'
        align="leftRight"
        selfRole="my"
        chats={message}
        style={commonOuterStyle}
        roleConfig={roleInfo}
        onChatsChange={onChatsChange}
        onMessageSend={onMessageSend}
        uploadProps={uploadProps}
      />
    </>
  )
}



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