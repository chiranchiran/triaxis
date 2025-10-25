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
  MessageOutlined,
  ConsoleSqlOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'markdown-to-jsx';
import './index.less'
import { MyButton } from '../../components/MyButton';
import { CustomCard, DetailCard, FileTime, Statis } from '../../components/DetailCard';
import VirtualList from 'rc-virtual-list';
import Review from '../../components/Review';
import { useCollect, useLike } from '../../hooks/api/common';
import { throttle } from 'lodash';
import { useGetResource } from '../../hooks/api/resources';
import { useParams } from 'react-router-dom';
import { useAddReview, useGetReviews } from '../../hooks/api/reviews';
const { TextArea } = Input;

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

const ResourceDetail = () => {
  const { id } = useParams()
  const { mutation: dolike } = useLike();
  const { mutation: doCollect } = useCollect();
  const { data: resource = {}, isLoading: resourceLoading, isError: resourceError } = useGetResource(id, { enabled: !!id })
  const { isFetching: submitting } = useAddReview();
  const [reviewForm] = Form.useForm();

  // 获取价格标签
  const getPriceTag = (right, pricePoints) => {
    if (right === 1) {
      return ["tag-green", "免费"]
    } else if (right === 2) {
      return ["tag-orange", "VIP专享"]
    } else {
      return ["tag-blue", `${pricePoints}积分`]
    }
  };

  if (resourceLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 flex flex-col justify-center">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }
  const {
    resourceDetail: {
      title = "",
      description = "没有具体介绍",
      right,
      price = 0,
      coverImage = "",
      details = "",
      likeCount = 0,
      collectCount = 0,
      downloadCount = 0,
      extension,
      size = 100,
      publishTime,
      updateTime,
    } = {},
    images = [],
    tags = [],
    category: {
      subject,
      tools = [],
      categoriesFirst = [],
      categoriesSecondary = [],
    } = {},
    uploader: {
      userId,
      username = "已注销",
      school,
      major,
      grade,
      avatar,
    } = {},
    userActions: {
      isLiked = false,
      isCollected = false,
      isPurchased = false
    } = {}
  } = resource || {}

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
                    {title}
                  </h1>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriceTag(right, price)[0]}`} >
                      {getPriceTag(right, price)[1]}</span>
                  </div>
                </div>
                <p className="text-main text-lg leading-relaxed bg-primary-light p-4 rounded-lg border border-main">
                  {description}
                </p>
              </div>

              {/* 预览图片 */}
              <div className="bg-main rounded-lg p-4 border border-main">
                <div className="relative h-80 bg-card rounded-lg overflow-hidden border border-main">
                  <img
                    src={coverImage}
                    alt='封面预览图暂时无法加载'
                    title={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    预览图
                  </div>
                </div>

                {/* 小图预览 */}
                {images && images.length > 0 && (
                  <div className="flex space-x-3 mt-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="preview w-20 h-20 bg-card rounded border border-main cursor-pointer hover:border-primary-dark transition-colors"
                      >
                        <img
                          src={img.name}
                          title={`预览图 ${index + 1}`}
                          alt="预览图暂时无法加载"
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
                        h2: { component: 'h3', props: { className: 'text-xl font-semibold text-main mt-6 mb-3' } },
                        h3: { component: 'h4', props: { className: 'text-lg font-semibold text-main mt-4 mb-2' } },
                        ul: { props: { className: 'list-disc list-inside space-y-1' } },
                        li: { props: { className: 'text-main' } },
                        p: { props: { className: 'text-main 0 mb-3' } }
                      }
                    }}
                  >
                    {details}
                  </ReactMarkdown>
                </div>
              </DetailCard>

              {/* 标签 */}
              <div className='flex flex-col gap-4 px-2'>
                <div className="flex flex-wrap flex-col gap-2 text-sm text-secondary">
                  <span>学科：{subject}</span>
                  <span>一级分类：{categoriesFirst && categoriesFirst.map((item, index) => (
                    <span key={index}>
                      {item.name}
                      {index !== categoriesFirst.length - 1 && <span className="mx-2 separator">/</span>}
                    </span>
                  ))}</span>
                  <span>二级分类：{categoriesSecondary && categoriesSecondary.map((item, index) => (
                    <span key={index}>
                      {item.name}
                      {index !== categoriesSecondary.length - 1 && <span className="mx-2 separator">/</span>}
                    </span>
                  ))}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags && tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex tag-orange items-center px-3 py-1.5 rounded text-sm font-medium border}`}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </CustomCard>
          {/* 评价区域 */}
          <DetailCard title="用户评价">
            <Review targetType={1} targetId={id} />
          </DetailCard>
        </Col>

        {/* 右侧操作和信息面板 */}
        <Col xs={24} lg={8}>
          <div className={`flex flex-col gap-8`}>
            {/* 操作卡片 */}
            <CustomCard className="space-y-4 overflow-visible h-auto">
              {/* 上传者信息 */}
              <div className="flex items-center space-x-8 p-3">
                <Avatar
                  size={48}
                  src={avatar}
                  icon={<UserOutlined />}
                  className="border border-main"
                />
                <div className="flex-1 min-w-0 pl-5">
                  <div className="text-base text-main truncate mb-1">
                    {username}
                  </div>
                  <div className='flex text-secondary justify-start flex-wrap'>
                    <span>{school}</span>
                    {school && <span className="mx-1 separator">/</span>}
                    <span>{major}</span>
                    {major && <span className="mx-1 separator">/</span>}
                    <span>{grade}</span>
                  </div>
                </div>
              </div>
              {/* 统计信息 */}
              <div className="grid grid-cols-4 gap-3 text-center bg-main rounded-lg">
                <Statis count={downloadCount} >下载</Statis>
                <Statis count={likeCount} >点赞</Statis>
                <Statis count={collectCount} >收藏</Statis>
                <Statis count={extension} >格式</Statis>
              </div>
              {/* 文件信息 */}
              <div className="space-y-3">
                <FileTime count={size}>文件大小：</FileTime>
                <FileTime count={publishTime}>上传时间：</FileTime>
                <FileTime count={updateTime}>更新时间：</FileTime>
                <FileTime count={tools}>适用软件：</FileTime>
              </div>
              {/* 操作按钮 */}
              <div className="gap-3 z-999999 flex flex-col justify-stretch" >
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
              className='comment !shadow-md hover:!shadow-lg !overflow-visible h-auto'
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
          </div>
        </Col>
      </Row>
    </section >
  );
}

export default ResourceDetail;