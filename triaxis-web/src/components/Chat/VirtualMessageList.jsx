import React, { useRef, useCallback, useMemo, useState } from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import 'react-virtualized/styles.css';

// 创建动态高度缓存
export const createCache = () => new CellMeasurerCache({
  defaultHeight: 80,
  fixedWidth: true,
});

/**
 * 虚拟消息列表组件 - 支持无限滚动和缓存管理
 */
export const VirtualMessageList = React.forwardRef(({
  messages,
  renderMessage,
  onRowsRendered,
  onScroll,
  overscanRowCount = 10,
  scrollToAlignment = "end",
  hasMore = false,
  isLoadingMore = false,
  loadMoreThreshold = 5,
  className = ''
}, ref) => {
  const cache = useRef(createCache()).current;
  const listRef = useRef();

  // 暴露方法给父组件
  React.useImperativeHandle(ref, () => ({
    scrollToRow: (index) => {
      if (listRef.current) {
        listRef.current.scrollToRow(index);
      }
    },
    scrollToBottom: (immediate = false) => {
      if (listRef.current && messages.length > 0) {
        console.log("滚动到底部，消息数量:", messages.length);

        const list = listRef.current;

        // 立即滚动模式
        if (immediate) {
          // 使用原生滚动作为最后手段
          const gridElement = containerRef.current?.querySelector('.ReactVirtualized__Grid');
          if (gridElement) {
            gridElement.scrollTop = gridElement.scrollHeight;
            return;
          }
        }

        // 清除缓存并重新计算
        cache.clearAll();
        list.recomputeRowHeights();

        // 分阶段滚动确保生效
        setTimeout(() => {
          list.scrollToRow(messages.length - 1);
        }, 0);

        setTimeout(() => {
          list.scrollToRow(messages.length - 1);
        }, 50);

        setTimeout(() => {
          list.scrollToRow(messages.length - 1);
        }, 150);
      }
    },
    clearCache: () => {
      cache.clearAll();
    },
    getList: () => {
      return listRef.current;
    }
  }));

  // 行渲染器
  const rowRenderer = useCallback(({ index, key, parent, style }) => {
    const message = messages[index];

    if (!message) {
      return (
        <div key={key} style={style}>
          <div style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--semi-color-text-2)' }}>
            加载中...
          </div>
        </div>
      );
    }

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ registerChild }) => (
          <div ref={registerChild} style={style}>
            {renderMessage({ message, index })}
          </div>
        )}
      </CellMeasurer>
    );
  }, [messages, renderMessage, cache]);

  // 处理行渲染事件
  const handleRowsRendered = useCallback(({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
    // 检查是否需要加载更多历史消息
    if (startIndex <= loadMoreThreshold && hasMore && !isLoadingMore) {
      onRowsRendered?.({
        overscanStartIndex,
        overscanStopIndex,
        startIndex,
        stopIndex,
        shouldLoadMore: true
      });
    } else {
      onRowsRendered?.({
        overscanStartIndex,
        overscanStopIndex,
        startIndex,
        stopIndex,
        shouldLoadMore: false
      });
    }
  }, [hasMore, isLoadingMore, loadMoreThreshold, onRowsRendered]);

  // 处理滚动事件
  const handleScroll = useCallback(({ scrollTop, scrollLeft, clientHeight, scrollHeight }) => {
    onScroll?.({
      scrollTop,
      scrollLeft,
      clientHeight,
      scrollHeight
    });
    // if (isInitialUnscrolled && scrollTop > 0) {
    //   // 只要用户滚动过（scrollTop>0），就标记为“已滚动”
    //   setIsInitialUnscrolled(false);
    //   console.log("用户滚动")
    // }
  }, [onScroll]);

  // 渲染加载更多指示器
  const renderLoader = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <div style={{
        padding: '16px 20px',
        textAlign: 'center',
        color: 'var(--semi-color-text-2)',
        background: 'var(--semi-color-fill-0)',
        borderBottom: '1px solid var(--semi-color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
          加载更多消息...
        </div>
      </div>
    );
  }, [isLoadingMore]);

  return (
    <div className={className} style={{ height: '100%', position: 'relative' }}>
      {/* 加载更多指示器 */}
      {hasMore && renderLoader()}

      {/* 虚拟列表 */}
      <div style={{
        height: '100%',
        position: 'relative'
      }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              width={width}
              rowCount={messages.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              deferredMeasurementCache={cache}
              onRowsRendered={handleRowsRendered}
              onScroll={handleScroll}
              overscanRowCount={overscanRowCount}
              scrollToAlignment={scrollToAlignment}
            />
          )}
        </AutoSizer>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
});

VirtualMessageList.displayName = 'VirtualMessageList';

export default VirtualMessageList;