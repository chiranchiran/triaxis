import React from 'react';
import { IconCopy, IconCopyStroked, IconDelete, IconDeleteStroked, IconUndo } from '@douyinfe/semi-icons';

/**
 * 单条消息组件
 */
export const MessageItem = ({
  message,
  index,
  roleInfo,
  onMessageCopy,
  onMessageDelete,
  onRevoke,
  showStatus = true
}) => {
  const isSelf = message.role === 'user';
  const isError = message.status === 'error';
  const isLoading = message.status === 'loading';
  const isRevoked = message.isRevoke;

  // 渲染操作按钮
  const renderActionButtons = () => {
    if (isLoading) return null;

    return (
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: isSelf ? 'flex-end' : 'flex-start'
      }}>
        {/* 复制按钮 */}
        <div
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => onMessageCopy(message)}
          title="复制"
        >
          <IconCopyStroked size="middle" />
        </div>

        {/* 删除按钮 */}
        <div
          className="cursor-pointer text-gray-500 hover:text-red-500"
          onClick={() => onMessageDelete(message)}
          title="删除"
        >
          <IconDeleteStroked size="middle" />
        </div>

        {/* 撤回按钮 - 只对自己的消息显示 */}
        {isSelf && !isRevoked && (
          <div
            className="cursor-pointer text-gray-500 hover:text-orange-500"
            onClick={() => onRevoke(message)}
            title="撤回"
          >
            <IconUndo size="middle" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`chat-message ${isSelf ? 'message-self' : 'message-other'}`}
      style={{
        display: 'flex',
        flexDirection: isSelf ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        margin: '16px 20px',
        gap: '12px',
        opacity: isLoading ? 0.7 : 1
      }}
    >
      {/* 头像 */}
      <div className="chat-avatar">
        <img
          src={isSelf ? roleInfo.user.avatar : roleInfo.assistant.avatar}
          alt="avatar"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* 消息内容 */}
      <div
        className="chat-content"
        style={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSelf ? 'flex-end' : 'flex-start',
          gap: '6px'
        }}
      >
        {/* 用户名 */}
        {showStatus && (
          <div
            className="chat-username semi-chat-chatBox-title"
            style={{
              fontSize: '16px',
              padding: '0 4px'
            }}
          >
            {isSelf ? roleInfo.user.name : roleInfo.assistant.name}
          </div>
        )}
        <div className='flex items-end gap-2'>
          {showStatus && message.createAt && isSelf && (
            <div
              className="chat-time"
              style={{
                fontSize: '14px',
                color: 'var(--semi-color-text-2)',
                padding: '0 4px'
              }}
            >
              {new Date(message.createAt).toLocaleTimeString()}
            </div>
          )}
          {/* 消息气泡 */}
          <div
            className={`chat-bubble ${isSelf ? 'semi-chat-chatBox-content semi-chat-chatBox-content-bubble semi-chat-chatBox-content-user' : 'semi-chat-chatBox-content semi-chat-chatBox-content-bubble'} ${isError ? 'bubble-error' : isLoading ? 'bubble-loading' : ''
              }`}

          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}
                />
                发送中...
              </div>
            ) : isRevoked ? (
              <span style={{ fontStyle: 'italic', color: 'var(--semi-color-text-2)' }}>
                该消息已撤回
              </span>
            ) : isError ? (
              <span style={{ color: 'var(--semi-color-danger)' }}>
                发送失败
              </span>
            ) : (
              message.content
            )}

          </div>
          {/* 时间戳 */}
          {showStatus && message.createAt && !isSelf && (
            <div
              className="chat-time"
              style={{
                fontSize: '14px',
                color: 'var(--semi-color-text-2)',
                padding: '0 4px'
              }}
            >
              {new Date(message.createAt).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {!isRevoked && renderActionButtons()}


      </div>
    </div>
  );
};

export default MessageItem;