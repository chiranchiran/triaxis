import React, { useState, useCallback, useRef } from 'react';
import { Chat, Radio } from '@douyinfe/semi-ui';
import { Avatar, Empty } from "antd";
import './index.less'
import {
  SafetyCertificateOutlined
} from '@ant-design/icons';

export const ChatMessage = ({ chatList }) => {
  // 空状态处理
  if (chatList.length === 0) {
    return <Empty description="暂无聊天记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className="pt-3">
      {chatList.map(item => {
        const {
          id,
          unread,
          user: {
            userId = 0,
            username = "匿名用户",
            avatar = "",
            school = "",
            grade = "",
            major = "",
            online },
          lastMessage: {
            content = "",
            createTime = "" }
        } = item;
        return (
          <div
            key={id}
            className="flex items-center p-3 setting rounded-lg cursor-pointer transition-colors"
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
              <p className="text-secondary truncate line-clamp-2 leading-5">{content}</p>
              <div className="text-sm text-secondary mt-1">{createTime}</div>
            </div>
            {/* 未读消息徽章 */}
            {unread > 0 && (
              <div className="bg-red text-light px-2 text-center rounded-full">
                {unread}
              </div>
            )}

          </div>
        )
      })}
      {/* <MyChat></MyChat> */}
    </div>
  );
};

export const MyChat = () => {
  const defaultMessage = [
    {
      role: 'system',
      id: '1',
      createAt: 1715676751919,
      content: "Hello, I'm your AI assistant.",
    },
    {
      role: 'user',
      id: '2',
      createAt: 1715676751919,
      content: "介绍一下 Semi design"
    },
    {
      role: 'assistant',
      id: '3',
      createAt: 1715676751919,
      content: `
Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户[[1]](https://semi.design/zh-CN/start/introduction)。

Semi Design的特点包括：

1. 设计简洁、现代化。
`
    }
  ];

  const roleInfo = {
    user: {
      name: 'User',
      avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
      name: 'Assistant',
      avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
      name: 'System',
      avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
  }
  const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 600,
  }
  let id = 0;
  function getId() {
    return `id-${id++}`
  }
  const uploadProps = { action: 'https://api.semi.design/upload' }

  const [message, setMessage] = useState(defaultMessage);
  const intervalId = useRef();
  const onMessageSend = useCallback((content, attachment) => {
    setMessage((message) => {
      return [
        ...message,
        {
          role: 'assistant',
          status: 'loading',
          createAt: Date.now(),
          id: getId()
        }
      ]
    });
    generateMockResponse(content);
  }, []);

  const onChatsChange = useCallback((chats) => {
    setMessage(chats);
  }, []);

  const generateMockResponse = useCallback((content) => {
    const id = setInterval(() => {
      setMessage((message) => {
        const lastMessage = message[message.length - 1];
        let newMessage = { ...lastMessage };
        if (lastMessage.status === 'loading') {
          newMessage = {
            ...newMessage,
            content: `mock Response for ${content} \n`,
            status: 'incomplete'
          }
        } else if (lastMessage.status === 'incomplete') {
          if (lastMessage.content.length > 200) {
            clearInterval(id);
            intervalId.current = null
            newMessage = {
              ...newMessage,
              content: `${lastMessage.content} mock stream message`,
              status: 'complete'
            }
          } else {
            newMessage = {
              ...newMessage,
              content: `${lastMessage.content} mock stream message`
            }
          }
        }
        return [...message.slice(0, -1), newMessage]
      })
    }, 400);
    intervalId.current = id;
  }, []);

  const onStopGenerator = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      setMessage((message) => {
        const lastMessage = message[message.length - 1];
        if (lastMessage.status && lastMessage.status !== 'complete') {
          const lastMessage = message[message.length - 1];
          let newMessage = { ...lastMessage };
          newMessage.status = 'complete';
          return [
            ...message.slice(0, -1),
            newMessage
          ]
        } else {
          return message;
        }
      })
    }
  }, [intervalId]);

  return (
    <Chat
      className='mx-7xl'
      chats={message}
      showStopGenerate={true}
      style={commonOuterStyle}
      onStopGenerator={onStopGenerator}
      roleConfig={roleInfo}
      onChatsChange={onChatsChange}
      onMessageSend={onMessageSend}
      uploadProps={uploadProps}
    />
  )
}
export const MessageList = ({ filteredMessages, activeType, messageTypes }) => {
  // 获取当前类型的名称（用于空状态）
  const currentTypeName = messageTypes.find(t => t.key === activeType)?.name || '消息';

  // 空状态处理
  if (filteredMessages.length === 0) {
    return <Empty description={`暂无${currentTypeName}`} />;
  }

  return (
    <div className="pt-3">
      {filteredMessages.map(item => {
        const {
          id,
          type,
          content = "",
          createTime = "",
          read = false,
          user = {},
          target = {}
        } = item;
        const {
          userId,
          username = "匿名用户",
          avatar = "",
          school = "",
          grade = "",
          major = "",
          online } = user
        const { targetId, name } = target
        return (
          <div
            key={id}
            className="flex items-center p-3 setting rounded-lg cursor-pointer transition-colors"
          >
            {/* 用户头像 + 在线状态 */}
            <div className="relative mr-4">
              <Avatar src={avatar} size={56} icon={!user ? <SafetyCertificateOutlined /> : null} />
              {online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-dark rounded-full"></div>
              )}
            </div>
            {/* 消息内容 */}
            <div className="flex-1">
              <div className='flex gap-4 items-center text-secondary text-sm'>
                <div className='cursor-pointer text-main  text-base font-semibold' title={type === "system" ? "系统通知" : username}>
                  {type === "system" ? "系统通知" : username}
                </div>
                {[school, major, grade].filter(Boolean).join(" / ")}
              </div>
              {/* 消息内容（未读加粗） */}
              <p className="text-secondary truncate line-clamp-2 leading-5">{content}</p>
              <div className="text-sm text-secondary mt-1">{createTime}</div>
            </div>
            {!read && (
              <div className="bg-red text-light w-3 h-3 text-center rounded-full">
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
};