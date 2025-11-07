// ShowDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Row,
  Col,
  Skeleton,
  Tag,
} from 'antd';
import {
  DownloadOutlined,
  HeartOutlined,
  StarOutlined,
  UserOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'markdown-to-jsx';
import { MyButton } from '../../components/MyButton';
import { CustomCard } from '../../components/DetailCard';
import Review from '../../components/Review';
import { useCollect, useLike } from '../../hooks/api/common';
import { throttle } from 'lodash';
import { useParams } from 'react-router-dom';
import { AddReview } from '../addReview';
import { isArrayValid } from '../../utils/error/commonUtil';

export const SmallTitle = ({ children }) => {
  return (
    <div className="flex items-center text-lg">
      <span className='bg-primary w-4 border border-primary text-primary'>2</span>
      <span className="text-lg font-semibold text-main px-2 text-secondary border-b-2 border-primary">{children}
      </span>
    </div>
  )
}

export const renderMutiple = (list, label) => {
  if (!isArrayValid(list)) return;
  return <span>{label}： <span className='text-secondary'>{list.map(i => i.name).filter(Boolean).join(" / ")}</span></span>
}
export const renderSingle = (text, label) => {
  if (text === null || text === undefined || text === "") return;
  return <span>{label}：<span className='text-secondary'>{text}</span></span>
}

const ShowDetail = ({
  useGetDetail = null,
  targetType = 1,
  textContent = {},
  categoryTag: CategoryTag = () => { },
  targetStatis: TargetStatis = () => { },
  targetTime: TargetTime = () => { },
  coverImage: CoverImage = () => { },
  image: Image = () => { },
  handleReturn = {} }) => {
  const { titleText = "", detailText = "" } = textContent
  const { id } = useParams()
  const { mutation: dolike } = useLike();
  const { mutation: doCollect } = useCollect();

  const downloadRef = useRef(null)

  /**
   * @description state管理
   */
  const [stickyTop, setStickyTop] = useState(0);

  /**
   * @description 获取数据
   */

  const { data = {}, isLoading } = useGetDetail(id, { enabled: !!id });


  /**
   * @description 右边工具栏粘性定位
   */

  // 计算top值
  const updateStickyPosition = () => {
    if (downloadRef.current) {
      const rect = downloadRef.current.getBoundingClientRect();
      const distanceToTop = Math.floor(rect.top);
      const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize)
      const remValue = distanceToTop / rootFontSize;
      if (!stickyTop) {
        setStickyTop(() => remValue - 12)
      } else {
        setStickyTop(pre => pre - (6 - remValue))
      }
    }
  };

  const handleResize = throttle(() => {
    updateStickyPosition(); // 屏幕变化时重新计算
  }, 100);

  useEffect(() => {
    updateStickyPosition();
    // 监听屏幕变化（包括窗口缩小、旋转等）
    window.addEventListener('resize', handleResize);
    // 监听滚动（如果滚动也会影响元素位置）
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      handleResize.cancel();
    };

  }, [data]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 flex flex-col justify-center">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }
  const {
    detail = {},
    images = [],
    tags = [],
    category = {},
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
  } = data || {}
  const { title = "",
    description = "没有具体介绍",
    right,
    price = 0,
    coverImage = "",
    details = "",
    content = "",
    likeCount = 0,
    collectCount = 0,
    downloadCount = 0,
    extension,
    size = 100,
    publishTime = null,
    updateTime = null, } = detail;
  const {
    subject,
    tools = [],
    categoriesFirst = [],
    categoriesSecondary = []
  } = category


  return (
    <section className="max-w-7xl mx-auto py-4">
      <Row gutter={[32, 32]}>
        {/* 左侧资源信息 */}
        <Col xs={24} lg={16}>

          <CustomCard className="mb-6">
            <div className="space-y-6">
              {/* 资源简介，描述，封面图，预览图 */}
              <>
                <h1 className="text-2xl font-bold text-main ml-2 mb-8 text-center">
                  {title}
                </h1>
                <SmallTitle>{titleText}</SmallTitle>
                <CategoryTag data={{ ...detail, ...category }} />
                {/* 描述 */}
                <p className="text-main text-base leading-relaxed">
                  简介：{description}
                </p>
                {/* 预览图片 */}
                <CoverImage coverImage={coverImage} title={title} images={images} />
              </>
              {/* 详情描述、分类信息、tag */}
              <>
                <SmallTitle>{detailText}</SmallTitle>
                {/* 详细描述 - 使用Markdown渲染 */}
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
                    {details || content}
                  </ReactMarkdown>
                  <Image images={images} />
                </div>
                {/* 标签 */}


                <div className="flex flex-wrap gap-1 border-b border-main py-6 mb-6">
                  {
                    isArrayValid(tags) && tags.map((tag, index) => (
                      <Tag
                        key={index}
                        className="inline-flex tag-orange"
                      >
                        #{tag.name}
                      </Tag>
                    ))
                  }
                </div>


              </>
              {/* 评论区 */}
              <Review targetType={targetType} targetId={id} />
            </div>
          </CustomCard>
        </Col>

        {/* 右侧操作和信息面板 */}
        <Col xs={24} lg={8}>
          <div style={{ top: `-${stickyTop}rem` }} className={`flex flex-col gap-8 sticky`}>
            {/* 操作卡片 */}
            <CustomCard className="space-y-4 overflow-visible h-auto !shadow-md ">
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
                    {[school, major, grade].filter(Boolean).join(" / ")}
                  </div>
                </div>
              </div>
              {/* 统计信息 */}
              <TargetStatis data={detail} />
              <TargetTime data={detail} />
              {/* 文件信息 */}

              {/* 操作按钮 */}
              <div ref={downloadRef} className="gap-3 z-999999 flex flex-col justify-stretch" >
                <div className='flex'>
                  <MyButton
                    size='middle'
                    type="black"
                    icon={<DownloadOutlined />}
                    className="flex-1"
                  >立即下载</MyButton>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MyButton
                    icon={<StarOutlined />}
                    type={isCollected ? "black" : "white"}
                    className="flex-1 py-4"
                  >收藏</MyButton>
                  <MyButton
                    type={isLiked ? "black" : "white"}
                    icon={<HeartOutlined />}
                    className="flex-1 py-4"
                  >点赞</MyButton>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MyButton
                    onClick={handleReturn}
                    icon={<ArrowLeftOutlined />}
                    type="black"
                    className="flex-1 py-4"
                  >返回搜索</MyButton>
                  <MyButton
                    type="white"
                    icon={<ShareAltOutlined />}
                    className="flex-1 py-4"
                  >立即分享</MyButton>
                </div>
                {/* <div className='flex'>
                  <MyButton
                    size='large'
                    type="white"
                    icon={<ShareAltOutlined />}
                    className="flex-1"
                  >立即分享</MyButton>
                </div> */}
              </div>
            </CustomCard>

            {/* 提交评价卡片 */}
            <AddReview isPurchased={isPurchased} targetId={id} targetType={targetType} />
          </div>
        </Col>
      </Row>
    </section >
  );
}

export default ShowDetail;