// PostDetail.jsx
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
  Dropdown,
  Menu
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  StarOutlined,
  StarFilled,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
  TrophyOutlined,
  UserOutlined,
  LikeOutlined,
  LikeFilled,
  FileTextOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'markdown-to-jsx';
import { useParams, useNavigate } from 'react-router-dom';

const { TextArea } = Input;

// 模拟帖子详情数据
const mockPostDetail = {
  id: 1,
  title: '关于城市更新中历史建筑保护的思考与实践',
  content: `## 问题背景

最近在参与一个城市更新项目，遇到了一个棘手的问题：如何在现代化改造中有效保护历史建筑？

### 项目概况
- 项目位置：某历史文化名城的老城区
- 涉及建筑：3栋民国时期建筑，5栋建国初期建筑
- 改造目标：提升区域功能，改善居民生活条件

### 遇到的挑战

1. **结构安全问题**
   - 部分建筑年久失修，存在安全隐患
   - 需要在不破坏原貌的前提下进行加固

2. **功能适应性**
   - 原有空间布局难以满足现代使用需求
   - 需要在保护与实用之间找到平衡点

3. **法规限制**
   - 文物保护法规对改造有严格限制
   - 审批流程复杂，周期长

### 我的思考

我认为可以从以下几个方面着手：

#### 技术层面
- 采用现代加固技术，如碳纤维加固
- 使用可逆的改造方案，便于未来修复

#### 设计层面
- 保留建筑外立面，内部进行功能重组
- 新旧材料结合，体现时代对话

#### 管理层面
- 建立详细的建筑档案
- 制定长期维护计划

### 寻求建议

想听听大家在类似项目中的经验：
- 有哪些成功案例可以参考？
- 在技术选择上有什么建议？
- 如何平衡保护与发展的关系？

期待与大家的交流！`,
  author: {
    id: 1,
    name: '城市规划师张工',
    avatar: '/images/avatar-1.jpg',
    level: '专家用户',
    experience: '12年规划经验',
    organization: '某知名设计研究院'
  },
  topic: {
    id: 1,
    name: '学术讨论',
    icon: '📚',
    color: 'blue'
  },
  field: {
    id: 1,
    name: '城乡规划'
  },
  tags: ['历史建筑', '城市更新', '文物保护', '改造技术', '案例分析'],
  viewCount: 2847,
  likeCount: 156,
  favoriteCount: 89,
  replyCount: 42,
  createTime: '2023-11-15 14:30',
  updateTime: '2023-11-16 09:15',
  isLiked: false,
  isFavorited: false,
  isSolved: false,
  bounty: 0,
  attachments: [
    { id: 1, name: '项目区位图.pdf', size: '2.3MB', type: 'pdf' },
    { id: 2, name: '建筑现状照片.zip', size: '15.6MB', type: 'zip' }
  ]
};

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    content: '这个问题很有代表性！我们之前在苏州平江路历史街区改造项目中采用了"微更新"策略，既保留了历史风貌，又提升了空间品质。建议可以参考《历史文化街区保护与更新导则》。',
    author: {
      name: '资深建筑师李老师',
      avatar: '/images/avatar-2.jpg',
      level: '专家用户'
    },
    createTime: '2023-11-15 16:45',
    likeCount: 23,
    isLiked: false,
    isAuthor: false,
    replies: [
      {
        id: 101,
        content: '感谢李老师的建议！苏州平江路的案例确实很有参考价值，我去查阅相关资料。',
        author: {
          name: '城市规划师张工',
          avatar: '/images/avatar-1.jpg',
          level: '专家用户'
        },
        createTime: '2023-11-15 17:20',
        likeCount: 5,
        isLiked: false,
        isAuthor: true
      }
    ]
  },
  {
    id: 2,
    content: '在结构加固方面，我们推荐使用碳纤维布加固技术。这种技术施工便捷，对原结构影响小，而且强度高。具体可以参照《建筑结构加固技术规范》。',
    author: {
      name: '结构工程师王工',
      avatar: '/images/avatar-3.jpg',
      level: '高级用户'
    },
    createTime: '2023-11-16 09:30',
    likeCount: 18,
    isLiked: false,
    isAuthor: false,
    replies: []
  },
  {
    id: 3,
    content: '关于功能适应性，我们最近在做的项目采用了"功能置换"策略。将一些不适合现代使用的空间重新规划，比如将储藏室改为共享办公空间，既保留了建筑特色，又提升了使用效率。',
    author: {
      name: '室内设计师陈小姐',
      avatar: '/images/avatar-4.jpg',
      level: '高级用户'
    },
    createTime: '2023-11-16 11:15',
    likeCount: 12,
    isLiked: false,
    isAuthor: false,
    replies: []
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

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentForm] = Form.useForm();

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        setTimeout(() => {
          setPost(mockPostDetail);
          setComments(mockComments);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('加载帖子详情失败:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 处理点赞帖子
  const handleLikePost = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
    }));
    message.success(post.isLiked ? '已取消点赞' : '点赞成功！');
  };

  // 处理收藏帖子
  const handleFavoritePost = () => {
    setPost(prev => ({
      ...prev,
      isFavorited: !prev.isFavorited,
      favoriteCount: prev.isFavorited ? prev.favoriteCount - 1 : prev.favoriteCount + 1
    }));
    message.success(post.isFavorited ? '已取消收藏' : '收藏成功！');
  };

  // 处理点赞评论
  const handleLikeComment = (commentId) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1
        };
      }
      return comment;
    }));
  };

  // 处理点赞回复
  const handleLikeReply = (commentId, replyId) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                isLiked: !reply.isLiked,
                likeCount: reply.isLiked ? reply.likeCount - 1 : reply.likeCount + 1
              };
            }
            return reply;
          })
        };
      }
      return comment;
    }));
  };

  // 处理回复评论
  const handleReply = (comment) => {
    setReplyingTo(comment);
    setReplyContent('');
  };

  // 提交回复
  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      message.warning('请输入回复内容');
      return;
    }

    const newReply = {
      id: Date.now(),
      content: replyContent,
      author: {
        name: '当前用户',
        avatar: '/images/avatar-current.jpg',
        level: '普通用户'
      },
      createTime: new Date().toLocaleString('zh-CN'),
      likeCount: 0,
      isLiked: false,
      isAuthor: false
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === replyingTo.id) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    }));

    setReplyingTo(null);
    setReplyContent('');
    message.success('回复成功！');
  };

  // 提交评论
  const handleCommentSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        const newComment = {
          id: comments.length + 1,
          content: values.content,
          author: {
            name: '当前用户',
            avatar: '/images/avatar-current.jpg',
            level: '普通用户'
          },
          createTime: new Date().toLocaleString('zh-CN'),
          likeCount: 0,
          isLiked: false,
          isAuthor: false,
          replies: []
        };

        setComments(prev => [newComment, ...prev]);
        commentForm.resetFields();
        message.success('评论发表成功！');
        setSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('发表评论失败:', error);
      message.error('发表评论失败，请重试');
      setSubmitting(false);
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

  // 渲染评论项
  const renderCommentItem = (comment) => (
    <div key={comment.id} className="border-0 px-0 py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex space-x-4 w-full">
        <Avatar
          size={44}
          src={comment.author.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0 border border-gray-300"
        />
        <div className="flex-1 min-w-0 pl-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-800 text-sm">
                {comment.author.name}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getUserLevelColor(comment.author.level)}`}>
                {comment.author.level}
              </span>
              {comment.isAuthor && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-600 border border-blue-200">
                  楼主
                </span>
              )}
            </div>
            <span className="text-gray-500 text-xs">
              {comment.createTime}
            </span>
          </div>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed mb-3">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center text-sm transition-colors ${comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                onClick={() => handleLikeComment(comment.id)}
              >
                {comment.isLiked ? <LikeFilled className="mr-1" /> : <LikeOutlined className="mr-1" />}
                <span>{comment.likeCount}</span>
              </button>
              <button
                className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                onClick={() => handleReply(comment)}
              >
                回复
              </button>
            </div>
          </div>

          {/* 回复列表 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
              {comment.replies.map(reply => (
                <div key={reply.id} className="flex space-x-3">
                  <Avatar
                    size={32}
                    src={reply.author.avatar}
                    icon={<UserOutlined />}
                    className="flex-shrink-0 border border-gray-300"
                  />
                  <div className="flex-1 min-w-0 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800 text-sm">
                          {reply.author.name}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getUserLevelColor(reply.author.level)}`}>
                          {reply.author.level}
                        </span>
                        {reply.isAuthor && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-600 border border-blue-200">
                            楼主
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs">
                        {reply.createTime}
                      </span>
                    </div>

                    <div className="text-gray-700 text-sm leading-relaxed mb-2">
                      {reply.content}
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        className={`flex items-center text-xs transition-colors ${reply.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                        onClick={() => handleLikeReply(comment.id, reply.id)}
                      >
                        {reply.isLiked ? <LikeFilled className="mr-1" /> : <LikeOutlined className="mr-1" />}
                        <span>{reply.likeCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 回复输入框 */}
          {replyingTo && replyingTo.id === comment.id && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <TextArea
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`回复 @${comment.author.name}...`}
                className="border-gray-300 hover:border-gray-400 focus:border-gray-500 resize-none mb-2"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  size="small"
                  onClick={() => setReplyingTo(null)}
                  className="border-gray-300 text-gray-600 hover:border-gray-400"
                >
                  取消
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={handleSubmitReply}
                  className="bg-gray-800 hover:bg-gray-700 border-gray-800"
                >
                  回复
                </Button>
              </div>
            </div>
          )}
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Row gutter={[32, 32]}>
          {/* 左侧帖子内容 */}
          <Col xs={24} lg={16}>
            <CustomCard className="mb-6">
              <CustomCardContent>
                <div className="space-y-6">
                  {/* 帖子标题和基本信息 */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${getTagColor(0)}`}>
                            {post.topic.icon} {post.topic.name}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${getTagColor(1)}`}>
                            {post.field.name}
                          </span>
                          {post.bounty > 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-orange-50 text-orange-600 border border-orange-200">
                              <TrophyOutlined className="mr-1" />
                              {post.bounty}积分
                            </span>
                          )}
                        </div>
                        <h1 className="text-2xl font-bold text-main mb-3">
                          {post.title}
                        </h1>
                      </div>
                    </div>

                    {/* 作者信息和统计 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-20">
                        <Avatar
                          size={48}
                          src={post.author.avatar}
                          icon={<UserOutlined />}
                          className="border border-gray-300 mr-5"
                        />
                        <div className='pl-5'>
                          <div className="font-medium main">
                            {post.author.name}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getUserLevelColor(post.author.level)}`}>
                              {post.author.level}
                            </span>
                            <span className="text-xs text-gray-500">
                              {post.author.experience}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">发布于 {post.createTime}</div>
                        <div className="text-sm text-gray-600">更新于 {post.updateTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* 帖子内容 */}
                  <CustomCard>
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
                          {post.content}
                        </ReactMarkdown>
                      </div>
                    </CustomCardContent>
                  </CustomCard>

                  {/* 附件 */}
                  {post.attachments && post.attachments.length > 0 && (
                    <CustomCard>
                      <CustomCardTitle>附件下载</CustomCardTitle>
                      <CustomCardContent>
                        <div className="space-y-2">
                          {post.attachments.map(attachment => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <FileTextOutlined className="text-gray-400" />
                                <span className="text-gray-700">{attachment.name}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">{attachment.size}</span>
                                <Button size="small" className="border-gray-300 text-gray-600 hover:border-gray-400">
                                  下载
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CustomCardContent>
                    </CustomCard>
                  )}

                  {/* 标签 */}

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1.5 rounded text-sm font-medium border ${getTagColor(index)}`}
                      >
                        {tag}
                      </span>
                    ))}

                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>

            {/* 评论区域 */}
            <CustomCard>
              <CustomCardTitle>
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-gray-800">评论回复</span>
                  <span className="ml-3 text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                    {comments.length} 条评论
                  </span>
                </div>
              </CustomCardTitle>
              <CustomCardContent>
                <div className="space-y-1">
                  {comments.map(comment => renderCommentItem(comment))}
                </div>
              </CustomCardContent>
            </CustomCard>
          </Col>

          {/* 右侧操作和信息面板 */}
          <Col xs={24} lg={8}>
            {/* 操作卡片 */}
            <CustomCard className="sticky top-6 mb-6 z-1">
              <CustomCardContent>
                <div className="space-y-4">
                  {/* 统计信息 */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                      <div className="text-xl font-bold text-gray-800">
                        {post.viewCount}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">浏览</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                      <div className="text-xl font-bold text-gray-800">
                        {post.likeCount}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">点赞</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                      <div className="text-xl font-bold text-gray-800">
                        {post.replyCount}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">回复</div>
                    </div>
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* 操作按钮 */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        size="large"
                        icon={post.isLiked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                        className={`h-12 border font-medium ${post.isLiked
                          ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
                          : 'text-gray-600 bg-white border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                          } transition-all`}
                        onClick={handleLikePost}
                      >
                        {post.isLiked ? '已点赞' : '点赞'}
                      </Button>
                      <Button
                        size="large"
                        icon={post.isFavorited ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
                        className={`h-12 border font-medium ${post.isFavorited
                          ? 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                          : 'text-gray-600 bg-white border-gray-300 hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-200'
                          } transition-all`}
                        onClick={handleFavoritePost}
                      >
                        {post.isFavorited ? '已收藏' : '收藏'}
                      </Button>
                    </div>

                    <Button
                      size="large"
                      icon={<ShareAltOutlined />}
                      className="w-full h-12 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all"
                    >
                      分享帖子
                    </Button>
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* 相关操作 */}
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start border-gray-300 text-gray-600 hover:border-gray-400"
                      onClick={() => navigate('/community')}
                    >
                      ← 返回社区
                    </Button>
                    <Button
                      className="w-full justify-start border-gray-300 text-gray-600 hover:border-gray-400"
                      onClick={() => window.scrollTo(0, document.body.scrollHeight)}
                    >
                      跳转到评论区
                    </Button>
                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>

            {/* 发表评论卡片 */}
            <CustomCard>
              <CustomCardTitle>发表评论</CustomCardTitle>
              <CustomCardContent>
                <Form
                  form={commentForm}
                  onFinish={handleCommentSubmit}
                  layout="vertical"
                >
                  <Form.Item
                    name="content"
                    rules={[
                      { required: true, message: '请输入评论内容' },
                      { min: 10, message: '评论内容至少10个字符' }
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="请输入您的评论...（支持Markdown语法）"
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
                      {submitting ? '发表中...' : '发表评论'}
                    </Button>
                  </Form.Item>
                </Form>
              </CustomCardContent>
            </CustomCard>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PostDetail;