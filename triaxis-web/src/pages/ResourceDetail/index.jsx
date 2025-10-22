// ResourceDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  Skeleton,
  Space
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
  EyeOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'markdown-to-jsx';
import './index.less'
import MyButton from '../../components/MyButton';
import { CustomCard, DetailCard } from '../../components/DetailCard';
import VirtualList from 'rc-virtual-list';
import Review from '../../components/Review';
import { useCollect, useLike } from '../../hooks/api/common';
import { throttle } from 'lodash';
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
    school: '清华大学',
    major: "城乡规划",
    grade: "大二"
  },
  tags: ['商业建筑', '综合体设计', '现代风格', 'CAD图纸', '参考图集', '建筑设计'],
  category: {
    secondaryCategory: ['参考图库', '灵感图'],
    firstCategory: ['参考图', "设计方案"],
    softwareTools: ['AutoCAD', 'Photoshop', 'SketchUp'],
    subject: '建筑设计'
  }

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

// 用户等级颜色配置 - 更柔和的版本
const userLevelColors = {
  '初级用户': 'bg-gray-100 text-gray-400 border-gray-200',
  '高级用户': 'bg-blue-50 text-blue-400 border-blue-100',
  '专家用户': 'bg-purple-50 text-purple-400 border-purple-50',
  '资深设计师': 'bg-orange-50 text-orange-400 border-orange-100',
  '普通用户': 'bg-gray-100 text-gray-400 border-gray-200'
};


const ResourceDetail = () => {
  const { mutation: dolike } = useLike();
  const { mutation: doCollect } = useCollect();
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

  // 获取价格标签
  const getPriceTag = (pricePoints) => {
    if (pricePoints === 0) {
      return ["tag-green", "免费"]
    } else if (pricePoints === -1) {
      return ["tag-orange", VIP专享]
    } else {
      return ["tag-blue", `${pricePoints}积分`]
    }
  };

  const Statis = ({ count, children }) => {
    return (
      <div className="text-center p-2">
        <div className="text-xl font-bold text-main">
          {count}
        </div>
        <div className="text-xs text-main mt-1">{children}</div>
      </div>)
  }
  const FileTime = ({ count, children }) => {
    if (Array.isArray(count)) {
      {
        return (
          <div className="flex justify-between text-sm p-2 gap-6">
            <span className="text-main text-nowrap">{children}</span>
            <span className="font-medium text-main flex justify-end gap-2 flex-wrap">
              {count.map((tool, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded text-xs bg-main text-main border border-main"
                >
                  {tool}
                </span>
              ))}
            </span>
          </div>
        )
      }
    } else {
      return (
        <div className="flex justify-between text-sm p-2 gap-10">
          <span className="text-main text-nowrap">{children}</span>
          <span className="font-medium text-main">{count}</span>
        </div>
      )
    }

  }
  // 渲染评论项的函数
  const renderReviewItem = (review) => (
    <div className="border-0 px-0 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <div className="flex space-x-4 w-full">
        <Avatar
          size={48}
          src={review.user.avatar}
          icon={<UserOutlined />}
          className="border border-main"
        />
        <div className="flex-1 pl-5 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <span className="font-medium text-gray-800 text-sm">
              {review.user.name}
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
  const data1 = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  }));

  const CONTAINER_HEIGHT = 400;
  const PAGE_SIZE = 20;
  const [data, setData] = useState([]);
  const appendData = () => {
    setTimeout(() => {
      setReviews(mockReviews);
    }, 800);
  };
  const sidebarRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);

  // 滚动事件处理：判断侧边栏顶部距离视口顶部是否 <= 20px
  const handleScroll = () => {
    if (!sidebarRef.current) return;

    // 获取侧边栏相对于视口的位置（关键！）
    const rect = sidebarRef.current.getBoundingClientRect();
    console.log('侧边栏顶部距离视口顶部：', rect.top);
    // rect.top 是侧边栏顶部到视口顶部的距离（正数：在视口内；负数：已滚动出视口）
    const isWithinThreshold = rect.top <= 50; // 距离顶部<=20px时需要固定

    // 更新固定状态
    if (isWithinThreshold && !isFixed) {
      setIsFixed(true);
    } else if (!isWithinThreshold && isFixed) {
      setIsFixed(false);
    }
  };

  // 监听滚动事件（添加节流优化性能）
  useEffect(() => {
    // 简单节流：50ms内只执行一次
    const throttledScroll = (e) => {
      let lastTime = 0;
      return () => {
        const now = Date.now();
        if (now - lastTime > 50) {
          handleScroll();
          lastTime = now;
        }
      };
    };

    const scrollHandler = throttledScroll();
    window.addEventListener('scroll', scrollHandler);
    // 初始加载时检查一次位置（避免页面刷新时已在固定区域）
    handleScroll();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [isFixed]);
  const onScroll = e => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (
      Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - CONTAINER_HEIGHT) <= 1
    ) {
      appendData();
    }
  };
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 flex flex-col justify-center">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-8">
      <Row gutter={[32, 32]}>
        {/* 左侧资源信息 */}
        <Col xs={24} lg={16}>
          <CustomCard className="mb-6">
            <div className="space-y-6">
              {/* 标题和基本信息 */}
              <div>
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <h1 className="text-2xl font-bold text-main mr-4 mb-2">
                    {resource.title}
                  </h1>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriceTag(resource.pricePoints)[0]}`} >
                      {getPriceTag(resource.pricePoints)[1]}</span>
                  </div>
                </div>
                <p className="text-main text-lg leading-relaxed bg-primary-light p-4 rounded-lg border border-main">
                  {resource.description}
                </p>
              </div>

              {/* 预览图片 */}
              <div className="bg-main rounded-lg p-4 border border-main">
                <div className="relative h-80 bg-card rounded-lg overflow-hidden border border-main">
                  <img
                    src={resource.thumbnailPath}
                    alt='预览图暂时无法加载'
                    title={resource.title}
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
                        className="preview w-20 h-20 bg-card rounded border border-main cursor-pointer hover:border-primary-dark transition-colors"
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
              <DetailCard
                title="资源详情"
              >
                <div className="prose prose-gray max-w-none text-main leading-relaxed">
                  <ReactMarkdown
                    options={{
                      overrides: {
                        h2: { component: 'h4', props: { className: 'text-xl font-semibold text-main mt-6 mb-3' } },
                        h3: { component: 'h5', props: { className: 'text-lg font-semibold text-main mt-4 mb-2' } },
                        ul: { props: { className: 'list-disc list-inside space-y-1' } },
                        li: { props: { className: 'text-main' } },
                        p: { props: { className: 'text-main 0 mb-3' } }
                      }
                    }}
                  >
                    {resource.detailedDescription}
                  </ReactMarkdown>
                </div>
              </DetailCard>

              {/* 标签 */}
              <div className='flex flex-col gap-4'>
                <div className="flex flex-wrap flex-col gap-2 text-base text-secondary">
                  <span>学科：{resource.category.subject}</span>
                  <span>一级分类：{resource.category.firstCategory.map((item, index) => (
                    <span key={index}>
                      {item}
                      {index !== resource.category.firstCategory.length - 1 && <span className="mx-2 separator">/</span>}
                    </span>
                  ))}</span>
                  <span>二级分类：{resource.category.secondaryCategory.map((item, index) => (
                    <span key={index}>
                      {item}
                      {index !== resource.category.secondaryCategory.length - 1 && <span className="mx-2 separator">/</span>}
                    </span>
                  ))}</span>
                </div>
                {
                  resource.category.map
                }
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex tag-orange items-center px-3 py-1.5 rounded text-sm font-medium border}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </CustomCard>

          {/* 评价区域 */}
          <DetailCard
            title="用户评价">
            <div className="ml-3 py-2 text-base text-main">
              共{reviews.length} 条评价
            </div>
            <div className="space-y-1">
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: page => {
                    console.log(page);
                  },
                  pageSize: 3,
                }}
                dataSource={data1}
                footer={
                  <div>
                    <b>ant design</b> footer part
                  </div>
                }
                renderItem={item => (
                  <List.Item
                    key={item.title}
                    actions={[
                      <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                      <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                      <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                    ]}
                    extra={
                      <img
                        draggable={false}
                        width={272}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                      />
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.description}
                    />
                    {item.content}
                  </List.Item>
                )}
              />
              <Review />
              {reviews.map((review, index) => renderReviewItem(review, index))}
            </div>
          </DetailCard>

        </Col>

        {/* 右侧操作和信息面板 */}
        <Col xs={24} lg={8} className="parent"  >
          {/* 操作卡片 */}
          <CustomCard className="mb-4 space-y-4 overflow-visible h-auto">
            {/* 上传者信息 */}
            <div className="flex items-center space-x-8 p-3">
              <Avatar
                size={48}
                src={resource.uploader.avatar}
                icon={<UserOutlined />}
                className="border border-main"
              />
              <div className="flex-1 min-w-0 pl-5">
                <div className="text-base text-main truncate mb-1">
                  {resource.uploader.name}
                </div>
                <div className='flex text-secondary justify-start flex-wrap'>
                  <span>{resource.uploader.school}</span>
                  <span className="mx-1 separator">/</span>
                  <span>{resource.uploader.major}</span>
                  <span className="mx-1 separator">/</span>
                  <span>{resource.uploader.grade}</span>
                </div>
              </div>
            </div>
            {/* 统计信息 */}
            <div className="grid grid-cols-4 gap-3 text-center bg-main rounded-lg">
              <Statis count={resource.downloadCount} >下载</Statis>
              <Statis count={resource.likeCount} >点赞</Statis>
              <Statis count={resource.viewCount} >收藏</Statis>
              <Statis count={resource.fileExtension} >格式</Statis>
            </div>
            {/* 文件信息 */}
            <div className="space-y-3">
              <FileTime count={resource.fileSize}>文件大小：</FileTime>
              <FileTime count={resource.uploadTime}>上传时间：</FileTime>
              <FileTime count={resource.updateTime}>更新时间：</FileTime>
              <FileTime count={resource.category.softwareTools}>适用软件：</FileTime>
            </div>
            {/* 操作按钮 */}
            <div ref={sidebarRef} className="side gap-3 flex flex-col justify-stretch" >
              <div className='flex'>
                <MyButton
                  size='large'
                  type="black"
                  icon={<DownloadOutlined />}

                  className="flex-1"
                >立即下载</MyButton>
              </div>


              <div className="grid grid-cols-2 gap-3">
                <MyButton
                  type="white"
                  icon={<StarOutlined />}

                  className="flex-1 py-4"
                >收藏</MyButton>
                <MyButton
                  type="white"
                  icon={<HeartOutlined />}

                  className="flex-1 py-4"
                >点赞</MyButton>
              </div>
              <div className='flex'>
                <MyButton
                  size='large'
                  type="white"
                  icon={<ShareAltOutlined />}

                  className="flex-1"
                >立即分享</MyButton>
              </div>
            </div>
          </CustomCard>

          {/* 提交评价卡片 */}
          <DetailCard
            title="发表评价"
            className='comment !shadow-md hover:!shadow-lg mt-8'
          >

            <Form
              form={reviewForm}

              layout="vertical"
              className='!pt-4'
            >
              <Form.Item
                name="rating"
                label="评分"
                rules={[{ required: true, message: '请选择评分' }]}
              >
                <Rate className="text-rate" />
              </Form.Item>

              <Form.Item
                name="content"
                label="评价内容"
                rules={[
                  { required: false, message: '请输入评价内容' },
                  { min: 10, message: '评价内容至少10个字符' }
                ]}
              >
                <TextArea
                  allowClear
                  rows={4}
                  placeholder="输入您对资源的评价..."
                  className="resize-none border border-light  focus:border-main rounded transition-colors"
                />
              </Form.Item>

              <Form.Item>
                <div className='flex'>
                  <MyButton
                    size='large'
                    type="black"
                    loading={submitting}
                    className="flex-1"
                  >提交评价</MyButton>
                </div>
              </Form.Item>
            </Form>
          </DetailCard>
        </Col>
      </Row>
    </section >
  );
}

export default ResourceDetail;