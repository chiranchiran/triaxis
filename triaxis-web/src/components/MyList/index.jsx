import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Skeleton, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import 'react-virtualized/styles.css';

// 创建动态高度缓存
const createCache = () => new CellMeasurerCache({
  defaultHeight: 80,
  fixedWidth: true,
});

/**
 * 通用虚拟列表组件
 * @param {Object} props
 * @param {Function} props.fetchData - 获取数据的API函数，接收 { page, pageSize } 参数，返回 Promise<{ records: any[], total: number }>
 * @param {React.Component} props.renderItem - 渲染单个列表项的组件
 * @param {number} props.pageSize - 每页数据量，默认为10
 * @param {string} props.loadType - 加载方式：'click' | 'scroll'，默认为'scroll'
 * @param {string} props.className - 容器类名
 * @param {Object} props.style - 容器样式
 * @param {string} props.emptyText - 空数据提示文本
 * @param {string} props.endText - 数据加载完毕提示文本
 */
const MyList = ({
  fetchData,
  renderItem,
  pageSize = 20,
  activeKey,
  className = '',
  renderEmpty: RenderEmpty,
  style = {},
  emptyText = '暂无数据',
  endText = '没有更多数据了'
}) => {

  // State管理
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState([]);
  const [loadType, setLoadType] = useState("scroll");
  useEffect(() => {
    setData([])
    setHasMore(false)
    setPage(1)
  }, [activeKey])
  // 虚拟列表相关引用
  const listRef = useRef();
  const cache = useRef(createCache()).current;
  const scrollableDivRef = useRef();

  // 计算剩余条数


  const { data: list, isFetching: loading } = fetchData({ page, pageSize }, {
    enabled: !!page && hasMore,
    onSuccess: (datas) => {
      const newLoadType = datas.total <= 100 ? 'scroll' : 'virtual'
      setLoadType(newLoadType);
      const newHasMore = (datas.records?.length || 0) > 0
        && (datas.records.length === pageSize)
        && (datas.total > data.length + datas.records.length);
      console.log(datas.records, data.length + datas.records.length, newHasMore)
      // 确保还有剩余数据
      setHasMore(newHasMore);
      setData(pre => [...pre, ...datas.records])
      console.log("成功了", datas.records, datas)
    }
  })
  const { records = [], total = 0 } = list || {}



  // 加载更多数据
  const loadMoreData = async () => {
    if (loading || !hasMore) return;
    setPage(pre => pre + 1)
  };


  // 虚拟列表行渲染器
  const rowRenderer = useCallback(({ index, key, parent, style }) => {
    const item = data[index];

    if (!item) {
      return (
        <div key={key} style={style}>
          <Skeleton active paragraph={{ rows: 2 }} />
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
            {renderItem({ item, index })}
          </div>
        )}
      </CellMeasurer>
    );
  }, [data, renderItem, cache]);

  // 点击加载更多按钮
  const renderLoadMoreButton = () => {
    if (!hasMore) {
      return (
        <Divider plain>
          {data.length === 0 ? emptyText : endText}
        </Divider>
      );
    }
    console.log(total, data.length)
    const remainingCount = total - data.length;
    return (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        <Button
          onClick={loadMoreData}
          loading={loading}
          type="primary"
        >
          {loading ? '加载中...' : `加载更多（剩余${remainingCount}条）`}
        </Button>
      </div>
    );
  };

  // 渲染滚动自动加载版本
  const renderInfiniteScroll = () => {
    console.log(total)
    return (

      <div
        ref={scrollableDivRef}
        style={{
          height: '100%',
          overflow: 'auto',
          ...style
        }}
        className="pt-3"
      >{
          total == 0 && <RenderEmpty />
        }
        {
          total > 0 && (
            <InfiniteScroll
              dataLength={data.length}
              next={loadMoreData}
              hasMore={hasMore}
              loader={
                <div style={{ padding: '16px' }}>
                  <Skeleton avatar paragraph={{ rows: 1 }} active />
                </div>
              }
              endMessage={
                <Divider plain>
                  {data.length === 0 ? emptyText : endText}
                </Divider>
              }
              scrollableTarget="scrollableDiv"
            >
              {data.map((item, index) => (
                <div key={item.id || index}>
                  {renderItem({ item, index })}
                </div>
              ))}
            </InfiniteScroll>
          )
        }

      </div>
    )
  };

  // 渲染虚拟列表版本（性能更好）
  const renderVirtualList = () => {
    console.log(total)
    return (
      <div
        style={{
          height: '100%',
          ...style
        }}
        className={className}
      >
        <AutoSizer>
          {({ height, width }) => (
            <>
              <List
                ref={listRef}
                height={height - (hasMore ? 60 : 0)} // 为加载按钮留出空间
                width={width}
                rowCount={data.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                deferredMeasurementCache={cache}
                overscanRowCount={5}
              />
              {renderLoadMoreButton()}
            </>
          )}
        </AutoSizer>
      </div>
    );
  }

  // 根据加载类型选择渲染方式
  const renderContent = () => {
    if (loadType === 'scroll') {
      return renderInfiniteScroll();
    } else {
      return renderVirtualList();
    }
  };

  return renderContent();
};

export default MyList;