import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Row,
  Col,
  Tag,
  Pagination,
  Empty,
  Spin,
  Avatar,
  List,
  Badge,
  Divider
} from 'antd';
import {
  SearchOutlined,
  FireOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
  HeartOutlined,
  StarOutlined,
  PlusOutlined,
  TrophyOutlined,
  CrownOutlined,
  ArrowLeftOutlined,
  FilterOutlined,
  ArrowRightOutlined,
  UserOutlined,
  CloudUploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './index.less'
import { ActionButton, MyButton, OrderButton } from '../../components/MyButton';
import Category from '../../components/Category';
import { useGetHot, useGetPosts, useGetPostTypes, useGetSquare } from '../../hooks/api/community';
import { BOUNTY_ORDER, communityFilterList, SORT_OPTIONS } from '../../utils/constant/order';
import { addAll, filterNull, subUsername } from '../../utils/error/commonUtil';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCollect, useLike } from '../../hooks/api/common';
import { BountyPost, NormalPost, SquarePost } from '../../components/postCard';
import MyPagination from '../../components/MyPagination';
import VirtualList from 'rc-virtual-list';
import { useDispatch, useSelector } from 'react-redux';
import { removeReturnCommunity, saveSearchParams } from '../../store/slices/communitySlice';
const { Search } = Input;
dayjs.extend(relativeTime);
const Community = () => {
  const navigate = useNavigate();
  const { mutation: dolike } = useLike();
  const { mutation: doCollect } = useCollect();
  const dispatch = useDispatch();
  const isReturn = useSelector(state => state.community.isReturn)
  const oldSearchParams = useSelector(state => state.community.params)

  /**
   * @description state管理
   */

  //搜索参数
  const [searchParams, setSearchParams] = useState({
    search: "",
    bountyCount: 4,
    normalCount: 3,
    squareCount: 10,
    orderBy: 1,
    isSolved: null
  });
  //分类选择参数
  const [selectedFilters, setSelectedFilters] = useState({
    subjectId: null,
    topicIds: [],
  });
  //帖子广场分页参数
  const [square, setSquare] = useState({
    page: 1,
    pageSize: 20
  })
  useEffect(() => {
    if (isReturn) {
      dispatch(removeReturnCommunity())
      setSearchParams(pre => ({ ...pre, ...oldSearchParams.searchParams }));
      setSelectedFilters(pre => ({ ...pre, ...oldSearchParams.selectedFilters }));
    }

  }, [])
  /**
   * @description 数据获取
   */

  // 获取搜索结果
  const { data: postsData = {}, isFetching: postsLoading, isError: postsError } = useGetPosts({
    ...filterNull(selectedFilters),
    ...searchParams
  }, {
    enabled: !!selectedFilters.subjectId && !!selectedFilters.topicIds
  });

  // 提取悬赏帖和普通帖子
  const bountyPosts = postsData?.bounty?.records || [];
  const normalPosts = postsData?.normal?.records || [];
  const bountyTotal = postsData?.bounty?.total || 0;
  const normalTotal = postsData?.normal?.total || 0;
  const totalPosts = postsData?.total || 0;

  // 获取热门榜单
  const { data: hotData = [], isFetching: hotLoading, isError: hotError, refetch: getHot } = useGetHot();

  // 获取广场数据
  const { data: squarPosts = [], isFetching: squareLoading, refetch: getSquare } = useGetSquare(square, { enabled: !!square.page && !!square.pageSize });

  /**
   * @description 事件处理
   */
  const CONTAINER_HEIGHT = 1000
  //虚拟列表滚动到底部
  const onScroll = e => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (
      Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - CONTAINER_HEIGHT) <= 1
    ) {
      setSquare(pre => ({ ...pre, page: pre.page + 1 }))
    }
  };

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setSearchParams(prev => ({
      ...prev,
      page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchParams(prev => ({
      ...prev,
      search: value.trim(),
      page: 1
    }));
  };

  const clear = () => {
    setSearchParams(prev => ({
      ...prev,
      search: "",
      page: 1
    }));
  }

  // 处理悬赏贴排序
  const handleBountyOrder = (value) => {
    setSearchParams(pre => ({ ...pre, isSolved: value }))
    setSquare(pre => ({ ...pre, page: 1 }))
  }

  //用户行为处理函数
  const handleLike = (id) => {

  }

  const handleCollect = (id) => {

  }

  const TitleCard = ({ total, title, hasOrder = false, path }) => {
    return (
      <div className="flex items-center justify-between mb-6">
        {/* 左侧信息 */}
        <div className="flex items-center text-lg justify-end">
          <span className='bg-dark w-4 border border-dark'>2</span>
          <span className="text-lg font-semibold text-main px-2 border-b-2 border-dark">{title}
            <span className="text-secondary text-sm ml-2">
              ({total}条)
            </span>
          </span>

        </div>
        {/* 右侧按钮 */}
        <div className='flex gap-6 items-center'>
          {
            hasOrder && (
              <OrderButton
                size="small"
                list={addAll(BOUNTY_ORDER)}
                value={searchParams.isSolved}
                handleSortChange={handleBountyOrder}
                className="small-radio"
              />
            )
          }
          <MyButton
            onClick={() => {
              dispatch(saveSearchParams({
                searchParams: { ...searchParams },
                selectedFilters: { ...filterNull(selectedFilters) },
              }));
              navigate(`/community/${path}`)
            }}
            size="more"
            type="black"
            icon={<ArrowRightOutlined />}>
            查看更多
          </MyButton>
        </div>
      </div>

    )
  }

  return (
    <section>
      {/* 顶部搜索框 */}
      <div className="bg-gradient-to-white pt-15 pb-35">
        <div className="find max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-main mb-4">
            专业社区交流
          </h1>
          <p className="text-lg text-main mb-8">
            与同行交流经验，分享知识，共同进步
          </p>
          <Search
            placeholder="搜索帖子、问题、用户..."
            enterButton={
              <Button
                type="black"
                size="small"
                className="bg-black border-black h-full"
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
            }
            allowClear={true}
            onClear={clear}
            size="large"
            onSearch={handleSearch}
            className="max-w-2xl mx-auto h-14 py-1 search-btn"
          />
          <MyButton
            type="black"
            size="large"
            onClick={() => navigate('/community/create')}
            className="h-14 px-6 mt-1 ml-8 create"
            icon={<PlusOutlined />}
          >
            发帖
          </MyButton>
        </div>
      </div>

      <div className="check max-w-7xl mx-auto ">
        {/* 筛选条件区域 */}
        <Category
          filterList={communityFilterList}
          useGetTypes={useGetPostTypes}
          enableSecondaryCategory={false}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
          hasOrder={true}
        />

        {/* 搜索结果区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* 左侧搜索结果 */}
          <div className="lg:col-span-3 bg-card rounded-xl shadow-sm p-6 mb-6 ">
            {/* 顶部标题*/}
            <div className="mb-4 text-xl font-bold text-center">
              <span className="text-main">搜索结果（</span>
              <span className="text-blue">{totalPosts}条</span> ）
            </div>

            <Divider className='bg-gray' />

            {/* 悬赏贴搜索结果 */}
            <div className="mb-10 bounty">
              <TitleCard title="悬赏求助" total={bountyTotal} hasOrder={true} path="bounty" />
              {postsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Spin />
                </div>
              ) : bountyPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bountyPosts.map(post =>
                    <BountyPost post={post} handleLike={handleLike} handleCollect={handleCollect} key={post.postDetail.id} />)}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无相关悬赏贴"
                  className="py-8"
                />
              )}
            </div>

            {/* 普通帖子搜索结果 */}
            <div className="bounty ">
              <TitleCard title="普通帖子" total={normalTotal} path="normal" />
              {postsLoading ? (
                <div className="flex justify-center items-center py-8 ">
                  <Spin />
                </div>
              ) : normalPosts.length > 0 ? (
                <div className="border-0 shadow-sm rounded-lg bg-main px-3 pt-3 flex flex-col gap-4 normal">
                  {normalPosts.map(post =>
                    <NormalPost post={post} handleLike={handleLike} handleCollect={handleCollect} key={post.postDetail.id} />
                  )}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无相关帖子"
                  className="py-8"
                />
              )}
            </div>
          </div>

          {/* 右侧热门榜单 */}
          <div className="hot lg:col-span-1">
            <Card
              title={
                <div className="flex items-center gap-2 px-8">
                  <FireOutlined />
                  <span>热门榜单</span>
                </div>
              }
              className="bg-hot shadow-md"
              extra={<ReloadOutlined className="p-0 text-sm text-primary-dark cursor-pointer" onClick={() => getHot()} />}
            >
              {
                hotLoading ? (
                  <div className="flex justify-center items-center py-8 ">
                    <Spin />
                  </div>
                )
                  : hotData.length > 0 ? <List
                    dataSource={hotData}
                    renderItem={(item, index) => (
                      <List.Item>
                        <div className="flex cursor-pointer p-2 rounded">
                          <div className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold mr-3 mt-1 ${index < 3
                            ? 'bg-red text-white'
                            : 'bg-gray text-secondary'
                            }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-main line-clamp-2 leading-5 mb-1">
                              {item.title}
                            </h4>
                            <div className="text-xs text-secondary">
                              {item.hot} 热度
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  /> :
                    (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无相关数据"
                        className="py-8"
                      />
                    )}

            </Card>
          </div>
        </div>


        {/* 帖子广场 - 暂时保留模拟数据 */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6 text-xl gap-2">
            <div className="flex items-center justify-start gap-2">
              <ClockCircleOutlined />
              <h2 className="font-bold">实时广场</h2>
            </div>
            <div>
              <ReloadOutlined className="mr-8 text-base text-primary-dark cursor-pointer" onClick={() => setSquare(pre => ({ ...pre, page: 1 }))} />
              <MyButton
                onClick={() => navigate('/community/posts')}
                size="more"
                type="black"
                icon={<ArrowRightOutlined />}>
                查看更多
              </MyButton>
            </div>

          </div>
          {squareLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : squarPosts.length > 0 ? (


            <div className="">
              <VirtualList
                data={squarPosts}
                height={CONTAINER_HEIGHT}
                itemHeight={200}
                itemKey="id"
                onScroll={onScroll}
                className='pt-3 flex flex-col gap-4 normal bounty'
              >
                {post => (
                  <SquarePost post={post} handleLike={handleLike} handleCollect={handleCollect} key={post.id} />
                )}
              </VirtualList>
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无相关帖子"
              className="py-20"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Community;