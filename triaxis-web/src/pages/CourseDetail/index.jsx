// CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Rate,
  Avatar,
  List,
  Form,
  Input,
  Tag,
  Divider,
  Row,
  Col,
  message,
  Spin,
  Progress
} from 'antd';
import {
  PlayCircleOutlined,
  HeartOutlined,
  HeartFilled,
  StarOutlined,
  StarFilled,
  ClockCircleOutlined,
  UserOutlined,
  ShareAltOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'markdown-to-jsx';

const { TextArea } = Input;

// 模拟课程详情数据
const mockCourseDetail = {
  id: 1,
  title: '城市规划原理与实践 - 从理论到实战',
  subtitle: '系统掌握城市规划的核心理论与现代实践方法',
  description: '本课程深入讲解城市规划的基本原理、发展历程和实践应用，涵盖城市设计、区域规划、交通规划等多个方面，结合真实案例帮助学员将理论知识转化为实践能力。',
  detailedDescription: `## 课程详细介绍
  
### 课程概述
本课程是城乡规划专业的核心课程，旨在帮助学员系统掌握城市规划的理论体系和实践技能。课程内容涵盖从基础理论到前沿实践的完整知识体系。

### 课程特色
- **理论结合实践**：每个理论知识点都配有真实案例分析
- **循序渐进**：从基础概念到复杂系统，逐步深入
- **互动性强**：包含大量思考题和实践作业
- **专业指导**：由资深城市规划师亲自授课

### 学习目标
完成本课程后，您将能够：
- 理解城市规划的基本原理和方法论
- 掌握城市空间分析的基本技能
- 独立完成简单的城市规划方案
- 具备解决实际城市问题的能力

### 课程大纲
1. 城市规划导论
2. 城市空间结构与形态
3. 城市交通规划
4. 城市环境规划
5. 城市更新与改造
6. 规划实施与管理`,

  coverImage: '/images/course-detail.jpg',
  introVideo: '/videos/course-intro.mp4',
  totalDuration: 480, // 分钟
  difficultyLevel: 2,
  pricePoints: 0,
  viewCount: 2890,
  likeCount: 568,
  favoriteCount: 342,
  studentCount: 1247,
  reviewCount: 156,
  averageRating: 4.7,
  publishDate: '2023-08-15',
  updateDate: '2023-10-20',
  instructor: {
    id: 1,
    name: '城市规划专家李教授',
    avatar: '/images/instructor-1.jpg',
    title: '资深城市规划师',
    experience: '15年规划经验',
    organization: '某知名设计研究院'
  },
  tags: ['城市规划', '设计原理', '空间分析', '实践案例', '专业课程'],
  category: '城乡规划',
  subCategory: '城市规划原理',
  chapters: [
    {
      id: 1,
      title: '城市规划导论',
      duration: 45,
      lessons: [
        { id: 1, title: '课程介绍与学习目标', duration: 10, isFree: true },
        { id: 2, title: '城市规划的基本概念', duration: 15, isFree: true },
        { id: 3, title: '城市规划的发展历程', duration: 20, isFree: false }
      ]
    },
    {
      id: 2,
      title: '城市空间结构与形态',
      duration: 60,
      lessons: [
        { id: 4, title: '城市空间结构理论', duration: 25, isFree: false },
        { id: 5, title: '城市形态分析方法', duration: 35, isFree: false }
      ]
    },
    {
      id: 3,
      title: '城市交通规划',
      duration: 75,
      lessons: [
        { id: 6, title: '交通规划基本原理', duration: 30, isFree: false },
        { id: 7, title: '公共交通系统规划', duration: 25, isFree: false },
        { id: 8, title: '案例分析与实践', duration: 20, isFree: false }
      ]
    }
  ]
};

// 模拟评价数据
const mockReviews = [
  {
    id: 1,
    user: {
      name: '城乡规划学生',
      avatar: '/images/avatar-2.jpg',
      level: '初级用户'
    },
    rating: 5,
    content: '李教授的讲解非常清晰，课程内容很实用，对我理解城市规划帮助很大！特别是案例部分，很有启发性。',
    createTime: '2023-11-15 14:30',
    likes: 23
  },
  {
    id: 2,
    user: {
      name: '建筑设计师',
      avatar: '/images/avatar-3.jpg',
      level: '高级用户'
    },
    rating: 4,
    content: '课程内容很全面，理论与实践结合得很好。建议可以增加更多互动环节和作业反馈。',
    createTime: '2023-11-10 09:15',
    likes: 15
  },
  {
    id: 3,
    user: {
      name: '规划局工作人员',
      avatar: '/images/avatar-4.jpg',
      level: '专家用户'
    },
    rating: 5,
    content: '作为从业者，这个课程让我系统梳理了理论知识，对实际工作很有帮助。期待更多关于最新政策解读的内容。',
    createTime: '2023-11-05 16:45',
    likes: 18
  }
];

// 柔和的标签颜色配置
const tagColors = [
  'bg-gray-100 text-gray-400 border-gray-200',
  'bg-blue-50 text-blue-400 border-blue-50',
  'bg-green-50 text-green-400 border-green-50',
  'bg-orange-50 text-orange-400 border-orange-50',
  'bg-purple-50 text-purple-400 border-purple-50',
  'bg-cyan-50 text-cyan-600 border-cyan-100'
];

// 用户等级颜色配置 - 更柔和的版本
const userLevelColors = {
  '初级用户': 'bg-gray-100 text-gray-400 border-gray-200',
  '高级用户': 'bg-blue-50 text-blue-400 border-blue-100',
  '专家用户': 'bg-purple-50 text-purple-400 border-purple-50',
  '资深设计师': 'bg-orange-50 text-orange-400 border-orange-100',
  '普通用户': 'bg-gray-100 text-gray-400 border-gray-200'
};


// 难度等级配置
const difficultyConfig = {
  1: { text: '初级', color: 'bg-green-50 text-green-600 border-green-200' },
  2: { text: '中级', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  3: { text: '高级', color: 'bg-red-50 text-red-600 border-red-200' }
};

// 自定义卡片组件
const CustomCard = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

// 自定义卡片标题组件
const CustomCardTitle = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 bg-gray-50 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
  </div>
);

// 自定义卡片内容组件
const CustomCardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [reviewForm] = Form.useForm();

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        setTimeout(() => {
          setCourse(mockCourseDetail);
          setReviews(mockReviews);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('加载课程详情失败:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 处理点赞
  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setCourse(prev => ({
        ...prev,
        likeCount: prev.likeCount + 1
      }));
      message.success('点赞成功！');
    } else {
      setCourse(prev => ({
        ...prev,
        likeCount: prev.likeCount - 1
      }));
      message.info('已取消点赞');
    }
  };

  // 处理收藏
  const handleFavorite = () => {
    setFavorited(!favorited);
    if (!favorited) {
      setCourse(prev => ({
        ...prev,
        favoriteCount: prev.favoriteCount + 1
      }));
      message.success('收藏成功！');
    } else {
      setCourse(prev => ({
        ...prev,
        favoriteCount: prev.favoriteCount - 1
      }));
      message.info('已取消收藏');
    }
  };

  // 处理开始学习
  const handleStartLearning = () => {
    message.success('开始学习课程！');
    // 这里应该是实际的学习逻辑
  };

  // 处理评价提交
  const handleReviewSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        const newReview = {
          id: reviews.length + 1,
          user: {
            name: '当前用户',
            avatar: '/images/avatar-current.jpg',
            level: '普通用户'
          },
          rating: values.rating,
          content: values.content,
          createTime: new Date().toLocaleString(),
          likes: 0
        };

        setReviews(prev => [newReview, ...prev]);
        reviewForm.resetFields();
        message.success('评价提交成功！');
        setSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('提交评价失败:', error);
      message.error('提交评价失败，请重试');
      setSubmitting(false);
    }
  };

  // 获取价格标签
  const getPriceTag = (pricePoints) => {
    if (pricePoints === 0) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">免费</span>;
    } else if (pricePoints === -1) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">VIP专享</span>;
    } else {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">{pricePoints}积分</span>;
    }
  };

  // 获取难度标签
  const getDifficultyTag = (difficultyLevel) => {
    const config = difficultyConfig[difficultyLevel] || difficultyConfig[1];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // 获取时长显示
  const getDurationText = (minutes) => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
    }
  };

  // 获取标签颜色
  const getTagColor = (index) => {
    return tagColors[index % tagColors.length];
  };

  // 获取用户等级颜色
  const getUserLevelColor = (level) => {
    return userLevelColors[level] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  // 渲染评论项的函数
  const renderReviewItem = (review) => (
    <div className="border-0 px-0 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <div className="flex space-x-4 w-full">
        <Avatar
          size={44}
          src={review.user.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0 border border-gray-300"
        />
        <div className="flex-1 pl-4 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <span className="font-medium text-gray-800 text-sm">
              {review.user.name}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getUserLevelColor(review.user.level)}`}>
              {review.user.level}
            </span>
            <Rate
              disabled
              defaultValue={review.rating}
              className="text-sm text-amber-500"
            />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {review.content}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">
              {review.createTime}
            </span>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-500 hover:text-rose-500 text-xs transition-colors">
                <HeartOutlined className="mr-1" />
                <span>{review.likes}</span>
              </button>
              <button className="text-gray-500 hover:text-blue-600 text-xs transition-colors">
                回复
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染章节内容
  const renderChapterItem = (chapter, chapterIndex) => (
    <div key={chapter.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800">
          第{chapterIndex + 1}章 {chapter.title}
        </h4>
        <span className="text-sm text-gray-500 flex items-center">
          <ClockCircleOutlined className="mr-1" />
          {getDurationText(chapter.duration)}
        </span>
      </div>
      <div className="space-y-2">
        {chapter.lessons.map((lesson, lessonIndex) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <PlayCircleOutlined className="text-gray-400" />
              <span className="text-sm text-gray-700">
                {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
              </span>
              {lesson.isFree && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-50 text-green-600 border border-green-200">
                  免费
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {getDurationText(lesson.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Row gutter={[32, 32]}>
        {/* 左侧课程信息 */}
        <Col xs={24} lg={16}>
          <CustomCard className="mb-6">
            <CustomCardContent>
              <div className="space-y-6">
                {/* 标题和基本信息 */}
                <div>
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {course.title}
                      </h1>
                      <p className="text-lg text-gray-600 mb-3">
                        {course.subtitle}
                      </p>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      {getPriceTag(course.pricePoints)}
                      {getDifficultyTag(course.difficultyLevel)}
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                    {course.description}
                  </p>
                </div>

                {/* 课程封面和视频 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="relative h-80 bg-white rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        className="bg-white/20 hover:bg-white/30 border-white text-white backdrop-blur-sm"
                      >
                        预览课程
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                      课程封面
                    </div>
                  </div>
                </div>

                {/* 课程详情 - 使用Markdown渲染 */}
                <CustomCard>
                  <CustomCardTitle>课程详情</CustomCardTitle>
                  <CustomCardContent>
                    <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                      <ReactMarkdown
                        options={{
                          overrides: {
                            h2: { component: 'h3', props: { className: 'text-xl font-semibold text-gray-800 mt-6 mb-3' } },
                            h3: { component: 'h4', props: { className: 'text-lg font-semibold text-gray-800 mt-4 mb-2' } },
                            ul: { props: { className: 'list-disc list-inside space-y-1' } },
                            li: { props: { className: 'text-gray-700' } },
                            p: { props: { className: 'text-gray-700 mb-3' } }
                          }
                        }}
                      >
                        {course.detailedDescription}
                      </ReactMarkdown>
                    </div>
                  </CustomCardContent>
                </CustomCard>

                {/* 课程目录 */}
                <CustomCard>
                  <CustomCardTitle>课程目录</CustomCardTitle>
                  <CustomCardContent>
                    <div className="space-y-4">
                      {course.chapters.map((chapter, index) => renderChapterItem(chapter, index))}
                    </div>
                  </CustomCardContent>
                </CustomCard>

                {/* 标签 */}
                <CustomCard>
                  <CustomCardTitle>课程标签</CustomCardTitle>
                  <CustomCardContent>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1.5 rounded text-sm font-medium border ${getTagColor(index)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CustomCardContent>
                </CustomCard>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 评价区域 */}
          <CustomCard>
            <CustomCardTitle>
              <div className="flex items-center">
                <span className="text-xl font-semibold text-gray-800">学员评价</span>
                <span className="ml-3 text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                  {reviews.length} 条评价
                </span>
              </div>
            </CustomCardTitle>
            <CustomCardContent>
              <div className="space-y-1">
                {reviews.map(review => renderReviewItem(review))}
              </div>
            </CustomCardContent>
          </CustomCard>
        </Col>

        {/* 右侧操作和信息面板 */}
        <Col xs={24} lg={8}>
          {/* 操作卡片 */}
          <CustomCard className="top-6 mb-6 z-1">
            <CustomCardContent>
              <div className="space-y-4">
                {/* 讲师信息 */}
                <div className="flex items-center space-x-10 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Avatar
                    size={48}
                    src={course.instructor.avatar}
                    icon={<UserOutlined />}
                    className="border border-gray-300"
                  />
                  <div className="flex-1 min-w-0 pl-4">
                    <div className="font-medium text-gray-800 truncate">
                      {course.instructor.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {course.instructor.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {course.instructor.experience} • {course.instructor.organization}
                    </div>
                  </div>
                </div>

                <Divider className="my-4 border-gray-200" />

                {/* 统计信息 */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                    <div className="text-xl font-bold text-gray-800">
                      {course.studentCount}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">观看量</div>
                  </div>
                  <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                    <div className="text-xl font-bold text-gray-800">
                      {course.averageRating}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">评分</div>
                  </div>
                  <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                    <div className="text-xl font-bold text-gray-800">
                      {getDurationText(course.totalDuration)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">时长</div>
                  </div>
                  <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                    <div className="text-xl font-bold text-gray-800">
                      {course.reviewCount}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">评价</div>
                  </div>
                </div>

                <Divider className="my-4 border-gray-200" />

                {/* 课程信息 */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-600">课程时长:</span>
                    <span className="font-medium text-gray-800">{getDurationText(course.totalDuration)}</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-600">难度级别:</span>
                    <span className="font-medium text-gray-800">{difficultyConfig[course.difficultyLevel].text}</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-600">更新时间:</span>
                    <span className="font-medium text-gray-800">{course.updateDate}</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-600">课程分类:</span>
                    <span className="font-medium text-gray-800">{course.category}</span>
                  </div>
                </div>

                <Divider className="my-4 border-gray-200" />

                {/* 操作按钮 */}
                <div className="space-y-3">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    className="w-full bg-gray-800 hover:bg-gray-700 border-gray-800 h-12 text-base font-medium"
                    onClick={handleStartLearning}
                  >
                    开始学习
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      size="large"
                      icon={favorited ? <StarFilled className="text-amber-500" /> : <StarOutlined />}
                      className={`h-12 border font-medium ${favorited
                        ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
                        : 'text-gray-600 bg-white border-gray-300 hover:bg-amber-50 hover:text-amber-500 hover:border-amber-200'
                        } transition-all`}
                      onClick={handleFavorite}
                    >
                      {favorited ? '已收藏' : '收藏'}
                    </Button>
                    <Button
                      size="large"
                      icon={liked ? <HeartFilled className="text-rose-500" /> : <HeartOutlined />}
                      className={`h-12 border font-medium ${liked
                        ? 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100'
                        : 'text-gray-600 bg-white border-gray-300 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
                        } transition-all`}
                      onClick={handleLike}
                    >
                      {liked ? '已点赞' : '点赞'}
                    </Button>
                  </div>

                  <Button
                    size="large"
                    icon={<ShareAltOutlined />}
                    className="w-full h-12 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all"
                  >
                    分享课程
                  </Button>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 提交评价卡片 */}
          <CustomCard>
            <CustomCardTitle>发表评价</CustomCardTitle>
            <CustomCardContent>
              <Form
                form={reviewForm}
                onFinish={handleReviewSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="rating"
                  label="评分"
                  rules={[{ required: true, message: '请选择评分' }]}
                >
                  <Rate className="text-lg text-amber-500" />
                </Form.Item>

                <Form.Item
                  name="content"
                  label="评价内容"
                  rules={[
                    { required: true, message: '请输入评价内容' },
                    { min: 10, message: '评价内容至少10个字符' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请分享您的学习体验和课程建议..."
                    className="resize-none border border-gray-300 hover:border-gray-400 focus:border-gray-500 rounded transition-colors"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    className="w-full bg-gray-800 hover:bg-gray-700 border-gray-800 h-10 font-medium"
                  >
                    {submitting ? '提交中...' : '提交评价'}
                  </Button>
                </Form.Item>
              </Form>
            </CustomCardContent>
          </CustomCard>
        </Col>
      </Row>
    </div>
  );
};

export default CourseDetail;