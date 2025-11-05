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
  CloudUploadOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './index.less'
import { ActionButton, MyButton, OrderButton } from '../../components/MyButton';
import Category from '../../components/Category';
import { useGetPosts, useGetPostTypes } from '../../hooks/api/community';
import { BOUNTY_ORDER, communityFilterList, SORT_OPTIONS } from '../../utils/constant/order';
import { addAll, filterNull, subUsername } from '../../utils/error/commonUtil';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCollect, useLike } from '../../hooks/api/common';
import { BountyPost, NormalPost } from '../../components/postCard';

const { Search } = Input;
dayjs.extend(relativeTime);
const Community = () => {
  const navigate = useNavigate();
  const { mutation: dolike } = useLike();
  const { mutation: doCollect } = useCollect();
  const [loading, setLoading] = useState(false);
  const [hotRanking, setHotRanking] = useState([]);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    search: "",
    bountyCount: 4,
    normalCount: 3,
    orderBy: 1,
    isSolved: null
  });

  const [selectedFilters, setSelectedFilters] = useState({
    subjectId: null,
    topicIds: [],
  });

  const { data: postsData = {}, isFetching: postsLoading, isError: PostsError } = useGetPosts({
    ...filterNull(selectedFilters),
    ...searchParams
  }, {
    enabled: !!selectedFilters.subjectId && !!selectedFilters.topicIds
  });

  // 从API数据中提取悬赏帖和普通帖子
  const bountyPosts = postsData?.bounty?.records || [];
  const normalPosts = postsData?.normal?.records || [];
  const bountyTotal = postsData?.bounty?.total || 0;
  const normalTotal = postsData?.normal?.total || 0;
  const totalPosts = postsData?.total || 0;

  // 获取数据 - 保留原有的模拟数据用于热门榜单和帖子广场
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        // 热门榜单数据 - 暂时保留模拟数据
        const mockHotRanking = Array.from({ length: 10 }, (_, index) => ({
          id: `hot-${index + 1}`,
          title: [
            '最新城市规划政策深度解读',
            '建筑设计师必备的10个软件技能',
            '景观生态设计的最新趋势',
            'GIS在城市规划中的创新应用',
            '2024年建筑行业就业形势分析',
            '城乡规划专业学习路线图',
            '实习经验分享：从学生到职场',
            '专业软件学习资源大全',
            '项目合作中的沟通技巧',
            '行业大咖在线答疑活动预告'
          ][index],
          hotIndex: 1000 - index * 100 + Math.floor(Math.random() * 50),
          topic: 1,
          topicColor: 'blue'
        }));

        // 帖子广场数据 - 暂时保留模拟数据
        const mockPosts = Array.from({ length: 10 }, (_, index) => {
          const topic = 2;
          const createTime = new Date();
          createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 30));

          return {
            id: index + 1,
            title: `【${topic.name}】${[
              '关于城市更新中历史建筑保护的思考与实践',
              'BIM技术在建筑设计中的应用经验分享',
              '景观生态规划的方法论与实践案例',
              '空间数据分析的实用技巧与工具推荐',
              '城乡规划专业职业发展路径探讨',
              '高效学习方法和资源推荐交流',
              '跨专业项目合作经验与教训',
              '最新政策变化对行业的影响分析'
            ][index % 8]}`,
            content: '这是一个关于专业领域讨论的详细帖子内容，包含了作者的观点、经验和建议，希望能够与大家进行深入的交流和探讨，共同提升专业能力...',
            author: {
              name: `社区用户${index + 1}`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
              level: Math.floor(Math.random() * 5) + 1
            },
            topicId: topic.id,
            topicName: topic.name,
            topicColor: topic.color,
            replyCount: Math.floor(Math.random() * 50),
            viewCount: Math.floor(Math.random() * 1000),
            likeCount: Math.floor(Math.random() * 200),
            favoriteCount: Math.floor(Math.random() * 100),
            createTime: createTime.toLocaleString('zh-CN'),
            lastReplyTime: new Date(createTime.getTime() + Math.random() * 86400000).toLocaleString('zh-CN'),
            tags: [topic.name, ...(Math.random() > 0.7 ? ['精华'] : [])],
            hasNewReply: Math.random() > 0.7,
            isRecommended: Math.random() > 0.8
          };
        });

        setHotRanking(mockHotRanking);
        setPosts(mockPosts);
        setTotal(14);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('获取数据失败:', error);
      setLoading(false);
    }
  }, [searchParams, selectedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  }

  //用户行为处理函数
  const handleLike = (id) => {

  }

  const handleCollect = (id) => {

  }
  // 获取主题颜色类名
  const getTopicColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      volcano: 'bg-volcano-100 text-volcano-700 border-volcano-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const TitleCard = ({ icon, total, title, hasOrder = false }) => {
    return (
      <div className="mb-2 bounty">
        <div className="flex items-center justify-between mb-4">
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
                  size="middle"
                  list={addAll(BOUNTY_ORDER)}
                  value={searchParams.isSolved}
                  handleSortChange={handleBountyOrder}
                />
              )
            }
            <MyButton
              onClick={() => navigate('/community/bounty')}
              size="more"
              type="black"
              icon={<ArrowRightOutlined />}>
              查看更多
            </MyButton>
          </div>
        </div>
      </div>
    )
  }


  // 格式化时间显示
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleDateString('zh-CN');
  };


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
          <div className="lg:col-span-3">
            <div className="bg-card rounded-xl shadow-sm p-6 mb-6 ">
              {/* 顶部标题*/}
              <div className="mb-4 text-xl font-bold text-center">
                <span className="text-main">搜索结果（</span>
                <span className="text-blue">{totalPosts}条</span> ）
              </div>

              <Divider className='bg-gray' />

              {/* 悬赏贴搜索结果 */}
              <div className="mb-6 bounty">
                <TitleCard title="悬赏求助" total={bountyTotal} hasOrder={true} />
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
              <div className="mb-6">
                <TitleCard title="普通帖子" total={normalTotal} />
                {postsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spin />
                  </div>
                ) : normalPosts.length > 0 ? (
                  <div className="space-y-4">
                    {normalPosts.slice(0, 3).map(post => {
                      const { postDetail, uploader, userActions } = post;
                      return (
                        <div
                          key={postDetail.id}
                          onClick={() => navigate(`/community/posts/${postDetail.id}`)}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 border border-gray-100"
                        >
                          <NormalPost post={post} handleLike={handleLike} handleCollect={handleCollect} key={post.postDetail.id} />
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                {postDetail.topic && (
                                  <Tag className={`text-xs !bg-black !text-white !border-black`}>
                                    {postDetail.topic}
                                  </Tag>
                                )}
                                {postDetail.isRecommended && (
                                  <Tag color="gold" className="text-xs">精华</Tag>
                                )}
                              </div>

                              <h4 style={{ fontWeight: 550 }} className="text-md font-medium text-main mb-2 hover:text-primary cursor-pointer line-clamp-1 hover:text-primary transition-all duration-300 link-hover block">
                                {postDetail.title}
                              </h4>

                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {postDetail.description || '该帖子没有具体描述'}
                              </p>

                              <div className="flex items-center justify-between text-sm text-secondary">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Avatar size={24} src={uploader.avatar} className="mr-2">
                                      {uploader.username?.charAt(0)}
                                    </Avatar>
                                    <span className="font-medium">{uploader.username}</span>
                                  </div>
                                  <span>{formatTime(postDetail.publishTime)}</span>
                                </div>
                              </div>
                            </div>

                            {/* 右侧统计信息 */}
                            <div className="flex-shrink-0 ml-4 text-right">
                              <div className="space-y-20">
                                <div className="space-y-1">
                                  <span className="text-xs text-secondary">浏览量 </span>
                                  <span className="text-sm font-medium text-main">{postDetail.viewCount}</span>
                                </div>
                                <div className="flex items-center justify-end space-x-3 text-xs text-secondary">
                                  <span className="flex items-center">
                                    <MessageOutlined className="mr-1" />
                                    {postDetail.replyCount}
                                  </span>
                                  <span className="flex items-center">
                                    <HeartOutlined className="mr-1" />
                                    {postDetail.likeCount}
                                  </span>
                                  <span className="flex items-center">
                                    <StarOutlined className="mr-1" />
                                    {postDetail.collectCount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          </div>

          {/* 右侧热门榜单 - 暂时保留模拟数据 */}
          <div className="hot lg:col-span-1">
            <Card
              title={
                <div className="flex items-center">
                  <FireOutlined className="text-red-500 mr-2" />
                  <span>热门榜单</span>
                </div>
              }
              className="border-gray bg-red-20 shadow-md sticky"
              extra={<Button type="link" className="p-0 text-xs">刷新</Button>}
            >
              <List
                dataSource={hotRanking}
                renderItem={(item, index) => (
                  <List.Item className="!px-0 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start w-full cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                      <div className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold mr-3 mt-1 ${index < 3
                        ? 'bg-red-400 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-main line-clamp-2 leading-5 mb-1">
                          {item.title}
                        </h4>
                        <div className="text-xs text-secondary">
                          {item.hotIndex} 热度
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </div>


        {/* 帖子广场 - 暂时保留模拟数据 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ClockCircleOutlined className="text-blue-500 text-xl mr-2" />
              <h2 className="text-xl font-bold text-main">帖子广场</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* 排序选项可以保留 */}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-4">
                {posts.slice(0, 5).map(post => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/community/posts/${post.id}`)}
                    className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Tag className={`text-xs !bg-black !text-white !border-black ${getTopicColorClass(post.topicColor)}`}>
                            {post.topicName}
                          </Tag>
                          {post.tags.includes('精华') && (
                            <Tag color="gold" className="text-xs">精华</Tag>
                          )}
                          {post.isRecommended && (
                            <Tag color="green" className="text-xs">推荐</Tag>
                          )}
                        </div>

                        <h3 className="text-lg font-medium text-main mb-2 hover:text-primary cursor-pointer line-clamp-1 hover:text-primary transition-all duration-300 link-hover block">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center justify-between text-sm text-secondary">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Avatar size={24} src={post.author.avatar} className="mr-2" />
                              <span className="font-medium">{post.author.name}</span>
                              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">
                                Lv.{post.author.level}
                              </span>
                            </div>
                            <span>{post.createTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* 右侧统计信息 */}
                      <div className="flex-shrink-0 ml-4 text-right">
                        <div className="space-y-20">
                          <div className="space-y-1">
                            <span className="text-xs text-secondary">浏览量 </span>
                            <span className="text-sm font-medium text-main">{post.viewCount}</span>
                          </div>
                          <div className="flex items-center justify-end space-x-3 text-xs text-secondary">
                            <span className="flex items-center">
                              <MessageOutlined className="mr-1" />
                              {post.replyCount}
                            </span>
                            <span className="flex items-center">
                              <HeartOutlined className="mr-1" />
                              {post.likeCount}
                            </span>
                            <span className="flex items-center">
                              <StarOutlined className="mr-1" />
                              {post.favoriteCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页 */}
              <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                <Pagination
                  current={searchParams.page}
                  pageSize={searchParams.pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `显示第 ${range[0]}-${range[1]} 条，共 ${total} 条结果`
                  }
                  pageSizeOptions={['10', '20', '30', '50']}
                />
              </div>
            </>
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