import React, { useState } from 'react';
import { Avatar, Rate, Input, Spin, Space } from 'antd';
import { HeartOutlined, HeartFilled, MessageOutlined, UserOutlined, MoreOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLike } from '../hooks/api/common';
import { useGetReviews, useGetReviewReplies } from '../hooks/api/reviews';
import { Radio, RadioGroup } from '@douyinfe/semi-ui';
import { MyButton } from './MyButton';
import { logger } from '../utils/logger';
import { useQueryClient } from '@tanstack/react-query';

dayjs.extend(relativeTime);
const { TextArea } = Input;

// 排序选项配置（与后端orderBy参数对应：1=最新发布，2=最多点赞，3=最多回复）
const SORT_OPTIONS = [
  { name: "最新发布", id: 1 },
  { name: "最多点赞", id: 2 },
  { name: "最多回复", id: 3 }
];

const Review = ({ targetType, targetId }) => {
  const queryClient = useQueryClient();
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState([])
  let content
  const [replyContent, setReplyContent] = useState({
    id: null,
    content: ""
  });

  //获取顶层评论
  const [reviewParams, setReviewParams] = useState({
    targetType,
    targetId,
    orderBy: 1
  })
  const { data: reviewRes = {}, isFetching: reviewsLoading, refetch: refetchReviews } = useGetReviews(
    reviewParams,
    { enabled: !!reviewParams.targetId && !!reviewParams.targetType && !!reviewParams.orderBy });
  const { total = 0, records: reviews = [] } = reviewRes;

  //获取二级评论
  const [replyParams, setReplyParams] = useState({
    parentId: null,
    rootId: null,
    targetType,
    targetId,
    orderBy: 1
  });
  const { isFetching: repliesLoading, refetch: refetchReplies } = useGetReviewReplies(
    replyParams,
    { enabled: !!replyParams.targetId && !!replyParams.targetType && !!replyParams.orderBy && !!replyParams.parentId });
  // const { records: replies = [] } = replyRes;

  //处理点赞
  const { mutation: doLike, isLoading: likeLoading, isSuccess: likeSuccess } = useLike();
  const handleLike = async (targetId, isReply = false) => {
    await doLike({
      targetType: 4,
      targetId,
      isLiked: !isReply
        ? !reviews.find(r => r.id === targetId)?.isLiked
        : !replies.find(r => r.id === targetId)?.isLiked
    });
    // 点赞成功后刷新对应数据
    if (isReply) refetchReplies();
    else refetchReviews();
  };

  // 回复展开/收起
  const toggleReplies = (id) => {
    const isExpanded = expandedReplies[id];
    logger.debug("当前状态是", isExpanded, id)
    setExpandedReplies(prev => ({ ...prev, [id]: !isExpanded }));

    if (!isExpanded) {
      const newreplyParams = {
        ...replyParams,
        parentId: id,
        rootId: id
      };
      setReplyParams(newreplyParams);
    }
  };
  const getReply = (parentId) => {
    return queryClient.getQueryData(['reviews', 'replies', targetType, targetId, parentId]);
  }
  //处理排序
  const handleOrder = (value) => {
    setReviewParams(pre => ({ ...pre, orderBy: value }))
    setExpandedReplies({})
  }
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent({
      id: null,
      content: ""
    });
  };
  // 回复提交（需对接新增回复的Hook，此处预留逻辑）
  const submitReply = async (id) => {
    setReplyContent((pre) => ({ ...pre, content }))
    if (!replyContent.trim()) return;
    try {
      // 1. 调用新增回复的Hook（需项目提供，示例代码）
      // const addReplyRes = await doAddReply({
      //   parentId: id,
      //   rootId: id,
      //   targetType,
      //   targetId,
      //   content: replyContent,
      //   isAnonymous: false // 可加匿名开关
      // });
      // 2. 提交成功后刷新回复列表
      // refetchReplies();
      // 3. 清空输入
      cancelReply();
    } catch (error) {
      console.error("回复失败：", error);
    }
  };

  const LoadingComponent = ({ isLoading, children }) => (
    <Spin
      spinning={isLoading}
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      tip="加载中..."
    >
      {children}
    </Spin>
  );
  const Answer = ({ id, username }) => {
    const flag = replyContent.id === id
    if (!flag) {
      return
    }
    return (
      <div className="flex space-x-3 mt-4">
        <div className="flex-1">
          <TextArea
            allowClear
            value={content}
            onChange={(e) => content = e}
            placeholder={`回复 @${username}...`}
            rows={3}
            className="mb-2 !text-base"
          />
          <div className="flex justify-end gap-2 pt-2">
            <MyButton size="small" type="gray" onClick={cancelReply}>取消</MyButton>
            <MyButton
              size="small"
              type="gray"
              onClick={() => submitReply(id)}
              disabled={!replyContent.content.trim()}
            >
              发送
            </MyButton>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg">
      {/* 评论区标题 + 排序 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-main">全部评论 ({total})</h2>
        <div className="flex items-center space-x-2">
          <Space vertical="true" spacing='loose' align='start'>
            <RadioGroup
              onChange={(e) => handleOrder(e.target.value)}
              type='button'
              MyButtonSize='middle'
              value={reviewParams.orderBy}
              aria-label="单选组合示例"
              name="demo-radio-large"
              className='!text-sm'
            >
              {SORT_OPTIONS.map((item, index) => (
                <Radio key={item.id} value={item.id}>
                  {item.name}
                </Radio>
              ))}
            </RadioGroup>
          </Space>
        </div>
      </div>

      {/* 评论列表 */}
      <LoadingComponent isLoading={reviewsLoading}>
        <div className="space-y-4">
          {reviews.length === 0 && !reviewsLoading ? (
            <div className="text-center py-10 text-secondary">
              暂无评论，快来抢沙发～
            </div>
          ) : (
            reviews.map(mainReview => {
              const {
                id,
                rate = 3,
                content = "该用户没有评价",
                publishTime = "",
                likeCount = 0,
                isLiked = false,
                replyCount = 0,
                user = {},
              } = mainReview || {};
              const {
                avatar,
                userId,
                username = "匿名用户",
                school,
                grade,
                major
              } = user || {};

              return (
                <div key={id} className="border-b border-main pb-4 last:border-b-0">
                  {/* 主评论内容 */}
                  <div className="flex space-x-4">
                    <Avatar
                      size={40}
                      src={avatar}
                      icon={<UserOutlined />}
                      className="border border-main cursor-pointer flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 pl-4">
                      {/* 主评论上传者 */}
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-secondary text-sm cursor-pointer">{username}</span>
                        <span className="text-secondary text-sm">
                          {[school, major, grade].filter(Boolean).join(" / ")}
                        </span>
                        <Rate
                          disabled
                          defaultValue={rate}
                          className="text-sm text-rate ml-auto"
                        />
                      </div>
                      {/* 主评论内容 */}
                      <p className="text-main text-base leading-relaxed py-2">
                        {content}
                      </p>
                      {/* 主评论时间 + 操作 */}
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-secondary mr-4">
                            {dayjs(publishTime, "YYYY.MM.DD HH:mm:ss").fromNow()}
                          </span>
                          <span className="font-semibold text-secondary cursor-pointer" onClick={() => setReplyContent({ content: "", id })}>回复</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLike(id)}
                            disabled={likeLoading}
                            className={`flex items-center gap-1 cursor-pointer transition-colors ${isLiked ? "text-like" : "text-secondary hover:!text-like"
                              }`}
                          >  {isLiked ? <HeartFilled /> : <HeartOutlined />}
                            {likeCount}
                          </button>
                          <button
                            onClick={() => toggleReplies(id)}
                            className="flex cursor-pointer items-center gap-1 text-secondary transition-colors"
                          >
                            <MessageOutlined />{replyCount}
                          </button>

                          <MoreOutlined className="text-secondary cursor-pointer" />
                        </div>
                      </div>
                      {/* 回复输入框：当前回复该主评论时显示 */}
                      <Answer id={id} username={username} />
                      {/* 回复区域：展开时显示 */}
                      {expandedReplies[id] && (
                        <div className="mt-4 space-y-4">
                          {/* 回复列表 */}
                          <LoadingComponent isLoading={repliesLoading}>
                            {
                              getReply(id)?.total === 0 && !repliesLoading ? (
                                <div className="text-center py-4 text-secondary text-sm">
                                  暂无回复，快来回复吧～
                                </div>
                              ) : (
                                getReply(id)?.records.map(reply => {
                                  const {
                                    id: replyId,
                                    content: replyContent,
                                    publishTime: replyPublishTime,
                                    likeCount: replyLikeCount,
                                    isLiked: replyIsLiked,
                                    user: replyUser = {}
                                  } = reply;
                                  const {
                                    avatar: replyAvatar,
                                    userId: replyUserId,
                                    username: replyUsername = "匿名用户",
                                    school: replySchool,
                                    grade: replyGrade,
                                    major: replyMajor
                                  } = replyUser || {}
                                  return (
                                    <div key={replyId} className="flex space-x-3 flex-1 min-w-0 pl-3 py-2">
                                      {/* 回复用户头像 */}
                                      <Avatar
                                        size={32}
                                        src={replyAvatar}
                                        icon={<UserOutlined />}
                                        className="border cursor-pointer border-main flex-shrink-0"
                                      />
                                      {/* 回复内容区 */}

                                      <div className="flex-1 min-w-0 pl-4">
                                        {/* 主评论上传者 */}
                                        <div className="flex flex-wrap items-center gap-4">
                                          <span className="text-secondary cursor-pointer text-sm">{replyUsername}</span>
                                          <span className="text-secondary text-sm">
                                            {[replySchool, replyMajor, replyGrade].filter(Boolean).join(" / ")}
                                          </span>
                                        </div>
                                        {/* 回复标注：@主评论用户 */}
                                        <div className='py-2'>

                                          <span className="text-main text-base">回复</span>
                                          <span className="text-secondary cursor-pointer text-base"> @{username}：</span>
                                          <span className="text-main text-base leading-relaxed py-2">
                                            {replyContent}
                                          </span>
                                        </div>

                                        {/* 评论时间 + 操作 */}
                                        <div className="flex items-center justify-between text-sm">
                                          <div>
                                            <span className="text-secondary mr-4">
                                              {dayjs(replyPublishTime, "YYYY.MM.DD HH:mm:ss").fromNow()}
                                            </span>
                                            <span className="font-semibold text-secondary cursor-pointer" onClick={() => setReplyContent({ content: "", id: replyId })}>回复</span>
                                          </div>
                                          <div className="flex items-center gap-6">
                                            <button
                                              onClick={() => handleLike(replyId)}
                                              disabled={likeLoading}
                                              className={`flex items-center gap-1 cursor-pointer transition-colors ${replyIsLiked ? "text-like" : "text-secondary hover:!text-like"
                                                }`}
                                            >  {replyIsLiked ? <HeartFilled /> : <HeartOutlined />}
                                              {replyLikeCount}
                                            </button>

                                            <MoreOutlined className="text-secondary cursor-pointer" />
                                          </div>
                                        </div>
                                        <Answer id={replyId} username={replyUsername} />
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                          </LoadingComponent>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </LoadingComponent>
    </div>
  );
}




export default Review;