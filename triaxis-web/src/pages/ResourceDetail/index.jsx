// ResourceDetail.jsx
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
  Spin
} from 'antd';
import {
  DownloadOutlined,
  HeartOutlined,
  HeartFilled,
  StarOutlined,
  StarFilled,
  ClockCircleOutlined,
  FileOutlined,
  UserOutlined,
  ShareAltOutlined,
  EyeOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'markdown-to-jsx';

const { TextArea } = Input;

// 模拟资源详情数据
const mockResourceDetail = {
  id: 1,
  title: '现代建筑设计参考图集 - 商业综合体专题',
  description: '这是一份精心整理的高质量现代商业综合体建筑设计参考图集，包含国内外知名商业综合体的平面布局、立面设计、空间组织等详细图纸。特别适合建筑学专业学生、建筑设计师和城市规划师参考使用。',
  detailedDescription: `## 资源详细介绍
  
本资源包包含以下内容：

### 主要内容
- 50+ 张高清商业综合体设计图纸
- 20+ 个国内外知名商业综合体案例分析
- 平面图、立面图、剖面图完整套图
- 设计说明和技术指标文档

### 适用人群
- 建筑学专业学生
- 建筑设计师
- 城市规划师
- 房地产开发商

### 文件格式
- CAD图纸 (.dwg)
- PDF文档 (.pdf)
- 高清图片 (.jpg, .png)
- 说明文档 (.docx)

### 技术亮点
- 所有图纸均为矢量格式，支持无损放大
- 包含完整的图层管理
- 提供多种设计风格参考
- 附带详细的设计说明文档`,

  thumbnailPath: '/images/resource-detail.jpg',
  previewImages: [
    '/images/preview-1.jpg',
    '/images/preview-2.jpg',
    '/images/preview-3.jpg'
  ],
  pricePoints: 0,
  fileExtension: '.zip',
  fileSize: '245.6 MB',
  downloadCount: 1247,
  likeCount: 568,
  favoriteCount: 342,
  viewCount: 2890,
  uploadTime: '2023-08-15',
  updateTime: '2023-10-20',
  uploader: {
    id: 1,
    name: '建筑设计师小王',
    avatar: '/images/avatar-1.jpg',
    level: '资深设计师'
  },
  tags: ['商业建筑', '综合体设计', '现代风格', 'CAD图纸', '参考图集', '建筑设计'],
  category: '参考图库',
  subCategory: '参考图',
  softwareTools: ['AutoCAD', 'Photoshop', 'SketchUp'],
  professionalField: '建筑设计'
};

// 模拟评价数据
const mockReviews = [
  {
    id: 1,
    user: {
      name: '设计学院学生',
      avatar: '/images/avatar-2.jpg',
      level: '初级用户'
    },
    rating: 5,
    content: '这个资源非常实用，图纸质量很高，对我的课程设计帮助很大！强烈推荐给建筑学的同学们。',
    createTime: '2023-11-15 14:30',
    likes: 23
  },
  {
    id: 2,
    user: {
      name: '资深建筑师',
      avatar: '/images/avatar-3.jpg',
      level: '专家用户'
    },
    rating: 4,
    content: '内容很全面，特别是几个知名项目的分析很到位。建议可以增加更多技术指标的说明。',
    createTime: '2023-11-10 09:15',
    likes: 15
  },
  {
    id: 3,
    user: {
      name: '城市规划师',
      avatar: '/images/avatar-4.jpg',
      level: '高级用户'
    },
    rating: 5,
    content: '非常好的参考资料，商业综合体的流线组织分析特别有帮助，期待作者更多类似资源。',
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

const ResourceDetail = () => {
  const [resource, setResource] = useState(null);
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
          setResource(mockResourceDetail);
          setReviews(mockReviews);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('加载资源详情失败:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 处理点赞
  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setResource(prev => ({
        ...prev,
        likeCount: prev.likeCount + 1
      }));
      message.success('点赞成功！');
    } else {
      setResource(prev => ({
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
      setResource(prev => ({
        ...prev,
        favoriteCount: prev.favoriteCount + 1
      }));
      message.success('收藏成功！');
    } else {
      setResource(prev => ({
        ...prev,
        favoriteCount: prev.favoriteCount - 1
      }));
      message.info('已取消收藏');
    }
  };

  // 处理下载
  const handleDownload = () => {
    message.success('开始下载资源...');
    // 这里应该是实际的下载逻辑
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

  // 获取文件类型标签
  const getFileTypeTag = (fileExtension) => {
    if (!fileExtension) return null;

    const extension = fileExtension.toLowerCase();
    const typeMap = {
      '.pdf': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'PDF' },
      '.zip': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: '压缩包' },
      '.dwg': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'CAD' },
      '.skp': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'SketchUp' },
      '.psd': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'PSD' },
      '.ai': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: 'AI' }
    };

    const typeInfo = typeMap[extension] || {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      label: extension.slice(1).toUpperCase()
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeInfo.bg} ${typeInfo.text} border ${typeInfo.border}`}>
        {typeInfo.label}
      </span>
    );
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
        <div className="flex-1 pl-5 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <span className="font-medium text-gray-800 text-sm">
              {review.user.name}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getUserLevelColor(review.user.level)}`}>
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
          {/* 左侧资源信息 */}
          <Col xs={24} lg={16}>
            <CustomCard className="mb-6">
              <CustomCardContent>
                <div className="space-y-6">
                  {/* 标题和基本信息 */}
                  <div>
                    <div className="flex flex-wrap items-start justify-between mb-4">
                      <h1 className="text-2xl font-bold text-gray-800 mr-4 mb-2">
                        {resource.title}
                      </h1>
                      <div className="flex space-x-2">
                        {getPriceTag(resource.pricePoints)}
                        {getFileTypeTag(resource.fileExtension)}
                      </div>
                    </div>

                    <p className="text-gray-700 text-lg leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                      {resource.description}
                    </p>
                  </div>

                  {/* 预览图片 */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="relative h-80 bg-white rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={resource.thumbnailPath}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                        预览图
                      </div>
                    </div>

                    {/* 小图预览 */}
                    {resource.previewImages && resource.previewImages.length > 0 && (
                      <div className="flex space-x-3 mt-4">
                        {resource.previewImages.map((img, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 bg-white rounded border border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
                          >
                            <img
                              src={img}
                              alt={`预览图 ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 详细描述 - 使用Markdown渲染 */}
                  <CustomCard>
                    <CustomCardTitle>资源详情</CustomCardTitle>
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
                          {resource.detailedDescription}
                        </ReactMarkdown>
                      </div>
                    </CustomCardContent>
                  </CustomCard>

                  {/* 标签 */}
                  <CustomCard>
                    <CustomCardTitle>标签分类</CustomCardTitle>
                    <CustomCardContent>
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.map((tag, index) => (
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
                  <span className="text-xl font-semibold text-gray-800">用户评价</span>
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
            <CustomCard className="top-6 mb-6">
              <CustomCardContent>
                <div className="space-y-4">
                  {/* 上传者信息 */}
                  <div className="flex items-center space-x-8 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Avatar
                      size={48}
                      src={resource.uploader.avatar}
                      icon={<UserOutlined />}
                      className="border border-gray-300"
                    />
                    <div className="flex-1 min-w-0 pl-5">
                      <div className="font-medium text-gray-800 truncate">
                        {resource.uploader.name}
                      </div>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 border ${getUserLevelColor(resource.uploader.level)}`}>
                        {resource.uploader.level}
                      </div>
                    </div>
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* 统计信息 */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                      <div className="text-xl font-bold text-gray-800">
                        {resource.downloadCount}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">下载量</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                      <div className="text-xl font-bold text-gray-800">
                        {resource.likeCount}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">点赞</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 rounded border border-gray-200">
                      <div className="text-xl font-bold text-gray-800">
                        {resource.viewCount}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">浏览</div>
                    </div>
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* 文件信息 */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-600">文件大小:</span>
                      <span className="font-medium text-gray-800">{resource.fileSize}</span>
                    </div>
                    <div className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-600">上传时间:</span>
                      <span className="font-medium text-gray-800">{resource.uploadTime}</span>
                    </div>
                    <div className="flex justify-between text-sm p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-600">更新时间:</span>
                      <span className="font-medium text-gray-800">{resource.updateTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-600">适用软件:</span>
                      <div className="flex flex-wrap justify-end gap-1">
                        {resource.softwareTools.map((tool, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-300"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* 操作按钮 */}
                  <div className="space-y-3">
                    <Button
                      type="primary"
                      size="large"
                      icon={<DownloadOutlined />}
                      className="w-full bg-gray-800 hover:bg-gray-700 border-gray-800 h-12 text-base font-medium"
                      onClick={handleDownload}
                    >
                      立即下载
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
                      分享资源
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
                      placeholder="请详细描述您使用这个资源的体验和建议..."
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
    </div>
  );
};

export default ResourceDetail;