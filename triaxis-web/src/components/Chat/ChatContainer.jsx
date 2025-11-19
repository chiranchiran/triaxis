import React, { useCallback } from 'react';
import { Chat } from '@douyinfe/semi-ui';
import VirtualMessageList from './VirtualMessageList';
import MessageItem from './MessageItem';

/**
 * 聊天容器组件
 */
export const ChatContainer = ({
  messages,
  roleInfo,
  onMessageSend,
  onMessageCopy,
  onMessageDelete,
  onRevoke,
  onLoadMore, // 新增：加载更多回调
  uploadProps,
  placeholder,
  virtualListRef,
  isLoading = false,
  isLoadingMore = false, // 新增：加载更多状态
  hasMore = false, // 新增：是否有更多数据
  commonOuterStyle,
  className = ''
}) => {
  // 处理虚拟列表事件
  const handleRowsRendered = useCallback(({ shouldLoadMore }) => {
    if (shouldLoadMore && onLoadMore && hasMore) {
      onLoadMore();
    }
  }, [onLoadMore]);

  // 处理滚动事件
  const handleScroll = useCallback((scrollData) => {
    // 可以在这里实现更复杂的滚动逻辑
    // console.log('Scroll position:', scrollData.scrollTop);
  }, []);

  // 渲染单条消息
  const renderMessage = useCallback(({ message, index }) => (
    <MessageItem
      message={message}
      index={index}
      roleInfo={roleInfo}
      onMessageCopy={onMessageCopy}
      onMessageDelete={onMessageDelete}
      onRevoke={onRevoke}
      showStatus={true}
    />
  ), [roleInfo, onMessageCopy, onMessageDelete, onRevoke]);

  return (
    <div style={commonOuterStyle} className={className}>
      {/* 消息列表区域 - 使用虚拟列表 */}
      <div style={{
        height: 'calc(100% - 80px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <VirtualMessageList
          ref={virtualListRef}
          messages={messages}
          renderMessage={renderMessage}
          onRowsRendered={handleRowsRendered}
          onScroll={handleScroll}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadMoreThreshold={3}
        />
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: 'var(--semi-color-bg-3)',
            borderRadius: '16px',
            fontSize: '14px',
            zIndex: 10,
            border: '1px solid var(--semi-color-border)'
          }}>
            加载消息中...
          </div>
        )}
      </div>

      {/* 输入区域 - 只使用Semi Chat的输入框部分 */}
      <div style={{
        background: 'var(--semi-color-bg-2)',
        height: '80px',
      }}>
        <Chat
          align="leftRight"
          selfRole="user"
          chats={[]} // 不渲染消息，只使用输入框
          onMessageSend={onMessageSend}
          uploadProps={uploadProps}
          placeholder={placeholder}
          style={{
            border: 'none',
            background: 'transparent',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default ChatContainer;