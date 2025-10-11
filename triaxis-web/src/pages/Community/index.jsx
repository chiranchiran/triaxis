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
  FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.less'

const { Search } = Input;

// 专业数据
const PROFESSIONAL_FIELDS = [
  { id: 1, name: '城乡规划' },
  { id: 2, name: '建筑设计' },
  { id: 3, name: '风景园林' },
  { id: 4, name: '地理信息' },
  { id: 5, name: '其他' }
];

// 主题分类
const TOPIC_CATEGORIES = [
  { id: 1, name: '学术讨论', icon: '📚', color: 'blue' },
  { id: 2, name: '技术交流', icon: '💻', color: 'green' },
  { id: 3, name: '项目互助', icon: '🤝', color: 'orange' },
  { id: 4, name: '政策解读', icon: '📋', color: 'purple' },
  { id: 5, name: '求职招聘', icon: '💼', color: 'cyan' },
  { id: 6, name: '日常聊天', icon: '💬', color: 'pink' },
  { id: 7, name: '课程交流', icon: '🎓', color: 'red' },
  { id: 8, name: '吐槽专区', icon: '😤', color: 'volcano' }
];

const SORT_OPTIONS = [
  { id: 0, name: '最新发布' },
  { id: 1, name: '最热内容' },
  { id: 2, name: '最多回复' },
  { id: 3, name: '最多收藏' }
];

const BOUNTY_FILTERS = [
  { id: 'all', name: '全部' },
  { id: 'solved', name: '已解决' },
  { id: 'unsolved', name: '未解决' }
];

const Community = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    bountyPosts: [],
    normalPosts: [],
    total: 0,
    bountyCount: 0,
    normalCount: 0
  });
  const [hotRanking, setHotRanking] = useState([]);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    orderBy: 0, // 默认选择第一个排序方式
    searchKeyword: ''
  });

  const [selectedFilters, setSelectedFilters] = useState({
    subjectId: 1, // 默认选择第一个专业
    topicId: 1, // 默认选择第一个主题
    bountyFilter: 'all'
  });

  // 获取数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        // 悬赏贴数据
        const mockBountyPosts = Array.from({ length: 8 }, (_, index) => ({
          id: `bounty-${index + 1}`,
          title: `急求${['城市规划', '建筑设计', '景观设计', 'GIS分析', '方案评审', '技术咨询', '资料查找', '项目合作'][index % 8]}帮助`,
          description: `这是一个关于${['城市规划', '建筑设计', '景观设计', 'GIS分析', '方案评审', '技术咨询', '资料查找', '项目合作'][index % 8]}的具体问题描述，需要专业人士的帮助和指导。问题涉及多个方面，希望能够得到详细的解答和建议。`,
          author: {
            name: `用户${index + 100}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index + 100}`,
            level: Math.floor(Math.random() * 5) + 1
          },
          bounty: (index + 1) * 50,
          replyCount: Math.floor(Math.random() * 20) + 5,
          viewCount: Math.floor(Math.random() * 500) + 100,
          likeCount: Math.floor(Math.random() * 50) + 10,
          favoriteCount: Math.floor(Math.random() * 30) + 5,
          createTime: new Date(Date.now() - (index * 3600000)).toLocaleString('zh-CN'),
          deadline: new Date(Date.now() + (index + 3) * 86400000).toLocaleString('zh-CN').split(' ')[0],
          tags: ['悬赏', '紧急', '专业'],
          isSolved: index % 3 === 0,
          urgency: index % 4 === 0 ? 'high' : index % 4 === 1 ? 'medium' : 'low'
        }));

        // 普通帖子数据
        const mockNormalPosts = Array.from({ length: 6 }, (_, index) => {
          const topic = TOPIC_CATEGORIES[Math.floor(Math.random() * TOPIC_CATEGORIES.length)];
          const createTime = new Date();
          createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 30));

          return {
            id: `normal-${index + 1}`,
            title: `【${topic.name}】${[
              '关于城市更新中历史建筑保护的思考与实践',
              'BIM技术在建筑设计中的应用经验分享',
              '景观生态规划的方法论与实践案例',
              '空间数据分析的实用技巧与工具推荐',
              '城乡规划专业职业发展路径探讨',
              '高效学习方法和资源推荐交流'
            ][index]}`,
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

        // 热门榜单数据
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
          topic: TOPIC_CATEGORIES[index % 8].name,
          topicColor: TOPIC_CATEGORIES[index % 8].color
        }));

        // 帖子广场数据
        const mockPosts = Array.from({ length: 10 }, (_, index) => {
          const topic = TOPIC_CATEGORIES[Math.floor(Math.random() * TOPIC_CATEGORIES.length)];
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

        // 设置搜索结果
        setSearchResults({
          bountyPosts: mockBountyPosts,
          normalPosts: mockNormalPosts,
          total: mockBountyPosts.length + mockNormalPosts.length,
          bountyCount: mockBountyPosts.length,
          normalCount: mockNormalPosts.length
        });

        setHotRanking(mockHotRanking);
        setPosts(mockPosts);
        setTotal(12345);
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

  // 处理搜索
  const handleSearch = (value) => {
    setSearchParams(prev => ({
      ...prev,
      searchKeyword: value,
      page: 1
    }));
  };

  // 处理筛选条件变化
  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      newFilters[type] = prev[type] === value ? null : value;
      return newFilters;
    });

    setSearchParams(prev => ({
      ...prev,
      page: 1
    }));
  };

  // 处理排序变化
  const handleSortChange = (orderBy) => {
    setSearchParams(prev => ({
      ...prev,
      orderBy,
      page: 1
    }));
  };

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setSearchParams(prev => ({
      ...prev,
      page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  // 筛选按钮组件
  const FilterButton = ({ item, type, isSelected, icon }) => {
    const handleClick = () => {
      handleFilterChange(type, item.id);
    };

    return (
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
          ? 'bg-gray-200 text-gray-800 border border-gray-300'
          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
      >
        {icon && <span>{icon}</span>}
        <span>{item.name}</span>
      </button>
    );
  };

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

  // 获取紧急程度标签
  const getUrgencyTag = (urgency) => {
    const urgencyMap = {
      high: { color: 'red', text: '紧急' },
      medium: { color: 'orange', text: '一般' },
      low: { color: 'blue', text: '普通' }
    };
    const info = urgencyMap[urgency] || { color: 'default', text: '普通' };
    return <Tag color={info.color} className="text-xs">{info.text}</Tag>;
  };

  // 导航到详情页面
  const navigateToDetail = (type) => {
    navigate(`/community/${type}`, {
      state: {
        subjectId: selectedFilters.subjectId,
        topicId: selectedFilters.topicId,
        searchParams
      }
    });
  };

  // 过滤悬赏贴
  const filteredBountyPosts = searchResults.bountyPosts.filter(post => {
    if (selectedFilters.bountyFilter === 'solved') return post.isSolved;
    if (selectedFilters.bountyFilter === 'unsolved') return !post.isSolved;
    return true;
  });

  // 是否有搜索关键词
  const hasSearchKeyword = true

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索区域 */}
      <div className="bg-gradient-to-b from-sky-100 to-white pt-15 pb-35">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            专业社区交流
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            与同行交流经验，分享知识，共同进步
          </p>
          <div className="flex justify-around space-x-4 max-w-2xl mx-auto">
            <Search
              placeholder="搜索帖子、问题、用户..."
              enterButton={
                <Button
                  type="primary"
                  size="large"
                  className="bg-black hover:bg-gray-800 border-black h-full"
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
              }
              size="large"
              onSearch={handleSearch}
              className="flex-1 h-14 py-1"
            />
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/community/create')}
              className="bg-blue-500 hover:bg-blue-600 border-blue-500 h-14 px-6 mt-1 ml-8"
              icon={<PlusOutlined />}
            >
              发帖
            </Button>
          </div>
        </div>
      </div>

      {/* 筛选条件区域 */}
      <div className="check max-w-7xl mx-auto py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          {/* 第一行：专业领域 */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-4 min-w-[60px]">专业领域：</span>
              <div className="flex flex-wrap gap-2">
                {PROFESSIONAL_FIELDS.map(item => (
                  <FilterButton
                    key={item.id}
                    item={item}
                    type="subjectId"
                    isSelected={selectedFilters.subjectId === item.id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 第二行：主题分类 */}
          <div className="mb-4">
            <div className="flex items-start">
              <span className="text-sm font-medium text-gray-700 mr-4 min-w-[60px] mt-2">主题分类：</span>
              <div className="flex flex-wrap gap-2 flex-1">
                {TOPIC_CATEGORIES.map(item => (
                  <FilterButton
                    key={item.id}
                    item={item}
                    type="topicId"
                    isSelected={selectedFilters.topicId === item.id}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 排序选项 */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-4 min-w-[60px]">排序方式：</span>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSortChange(item.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${searchParams.orderBy === item.id
                      ? 'bg-gray-200 text-gray-800 border border-gray-300'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 搜索结果区域 */}
        {hasSearchKeyword && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* 左侧搜索结果 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">搜索结果</h2>
                  <div className="text-sm text-gray-600">
                    共找到 <span className="font-bold text-blue-500">{searchResults.total}</span> 条相关结果
                  </div>
                </div>

                {/* 悬赏贴搜索结果 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TrophyOutlined className="text-orange-500 text-lg mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">悬赏求助</h3>
                      <span className="text-gray-500 text-sm ml-2">
                        ({searchResults.bountyCount}条)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {BOUNTY_FILTERS.map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedFilters(prev => ({ ...prev, bountyFilter: filter.id }))}
                          className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${selectedFilters.bountyFilter === filter.id
                            ? 'bg-gray-200 text-gray-800 border border-gray-300'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          {filter.name}
                        </button>
                      ))}
                      <Button
                        type="link"
                        className="text-black p-0"
                        onClick={() => navigateToDetail('bounty')}
                      >
                        查看更多
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Spin />
                    </div>
                  ) : filteredBountyPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBountyPosts.slice(0, 4).map(post => (
                        <Card
                          key={post.id}
                          onClick={() => navigate(`/community/posts/${post.id}`)}
                          className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                          styles={{
                            body: {
                              padding: '16px'
                            }
                          }}
                        >
                          <div className="space-y-3">
                            {/* 顶部：悬赏积分和解决状态 */}
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <Tag color="orange" className="text-xs font-bold">
                                  {post.bounty}积分
                                </Tag>
                                {getUrgencyTag(post.urgency)}
                              </div>
                              <Tag color={post.isSolved ? 'green' : 'red'} className="text-xs">
                                {post.isSolved ? '已解决' : '未解决'}
                              </Tag>
                            </div>

                            {/* 标题 */}

                            <h3 style={{ fontWeight: 550, fontSize: 16 }} className="text-md font-medium text-gray-900 mb-2 hover:text-primary cursor-pointer line-clamp-1 hover:text-primary transition-all duration-300 link-hover block">
                              {post.title}
                            </h3>

                            {/* 问题描述 */}
                            <p className="text-gray-600 text-sm line-clamp-2 leading-4">
                              {post.description}
                            </p>

                            {/* 截止时间 */}
                            <div className="text-xs text-gray-500 flex items-center">
                              <ClockCircleOutlined className="mr-1" />
                              截止: {post.deadline}
                            </div>

                            {/* 作者信息和统计 */}
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                              <div className="flex items-center">
                                <Avatar size={20} src={post.author.avatar} className="mr-2" />
                                <span>{post.author.name}</span>
                                <span className="ml-2 text-xs bg-gray-100 px-1 rounded">
                                  Lv.{post.author.level}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
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
                        </Card>
                      ))}
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
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <MessageOutlined className="text-blue-500 text-lg mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">普通帖子</h3>
                      <span className="text-gray-500 text-sm ml-2">
                        ({searchResults.normalCount}条)
                      </span>
                    </div>
                    <Button
                      type="link"
                      className="text-blue-500 p-0"
                      onClick={() => navigateToDetail('posts')}
                    >
                      查看更多
                    </Button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Spin />
                    </div>
                  ) : searchResults.normalPosts.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.normalPosts.slice(0, 3).map(post => (
                        <div
                          key={post.id}
                          onClick={() => navigate(`/community/posts/${post.id}`)}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 border border-gray-100"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <Tag className={`text-xs !bg-black !text-white !border-black`}>
                                  {post.topicName}
                                </Tag>
                                {post.tags.includes('精华') && (
                                  <Tag color="gold" className="text-xs">精华</Tag>
                                )}
                              </div>

                              <h4 style={{ fontWeight: 550 }} className="text-md font-medium text-gray-900 mb-2 hover:text-primary cursor-pointer line-clamp-1 hover:text-primary transition-all duration-300 link-hover block">
                                {post.title}
                              </h4>

                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {post.content}
                              </p>

                              <div className="flex items-center justify-between text-sm text-gray-500">
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

                            {/* 右侧统计信息 - 浏览量和评论量等指标放在一起 */}
                            <div className="flex-shrink-0 ml-4 text-right">
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500">浏览</div>
                                  <div className="text-sm font-medium text-gray-900">{post.viewCount}</div>
                                </div>
                                <div className="flex items-center justify-end space-x-3 text-xs text-gray-500">
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

            {/* 右侧热门榜单 - 只在搜索结果页面显示 */}
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
                          {/* <div className="flex items-center space-x-2 mb-1">
                            <Tag className={`text-xs ${getTopicColorClass(item.topicColor)}`}>
                              {item.topic}
                            </Tag>
                          </div> */}
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5 mb-1">
                            {item.title}
                          </h4>
                          <div className="text-xs text-gray-500">
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
        )}

        {/* 帖子广场 - 完全独立的部分 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ClockCircleOutlined className="text-blue-500 text-xl mr-2" />
              <h2 className="text-xl font-bold text-gray-900">帖子广场</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {SORT_OPTIONS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSortChange(item.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${searchParams.orderBy === item.id
                      ? 'bg-orange-100 text-orange-700 border border-orange-300'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
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

                        <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-primary cursor-pointer line-clamp-1 hover:text-primary transition-all duration-300 link-hover block">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
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

                      {/* 右侧统计信息 - 浏览量和评论量等指标放在一起 */}
                      <div className="flex-shrink-0 ml-4 text-right">
                        <div className="space-y-20">
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500">浏览量 </span>
                            <span className="text-sm font-medium text-gray-900">{post.viewCount}</span>
                          </div>
                          <div className="flex items-center justify-end space-x-3 text-xs text-gray-500">
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
    </div>
  );
};



export default Community;