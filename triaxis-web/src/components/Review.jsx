import React, { useState } from 'react';
import { Avatar, Rate, Input, Spin, Space, Form } from 'antd';
import { HeartOutlined, HeartFilled, MessageOutlined, UserOutlined, MoreOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLike } from '../hooks/api/common';
import { useGetReviews, useGetReviewReplies } from '../hooks/api/reviews';
import { Radio, RadioGroup } from '@douyinfe/semi-ui';
import { ActionButton, MyButton, OrderButton } from './MyButton';
import { logger } from '../utils/logger';
import { useQueryClient } from '@tanstack/react-query';
import { POST_ORDER } from '../utils/constant/order';
import { subUsername } from '../utils/commonUtil';
import { CancelConfirmButton, SubmitConfirmButton } from './Mymodal';

dayjs.extend(relativeTime);
const { TextArea } = Input;
const Review = ({ targetType, targetId }) => {
  const queryClient = useQueryClient();
  const { mutation: doLike, isLoading: likeLoading, isSuccess: likeSuccess } = useLike();
  const [form] = Form.useForm();

  /**
   * @description state管理
   */
  //展开回复的评论id，每个id对应true或false
  const [expandedReplies, setExpandedReplies] = useState({});
  //存储正在回复的id
  const [replyTo, setReplyTo] = useState(null);
  //获取顶层评论的参数，匹配资源、课程、帖子
  const [reviewParams, setReviewParams] = useState({
    targetType,
    targetId,
    orderBy: 1
  })
  //获取回复的参数
  const [replyParams, setReplyParams] = useState({
    rootId: null,
    targetType,
    targetId
  });

  /**
 * @description 数据获取
 */
  //获取顶层评论
  const { data: reviewRes = {}, isFetching: reviewsLoading, refetch: refetchReviews } = useGetReviews(
    reviewParams,
    { enabled: !!reviewParams.targetId && !!reviewParams.targetType && !!reviewParams.orderBy });
  const { total = 0, records: reviews = [] } = reviewRes;
  //获取回复
  const { isFetching: repliesLoading, refetch: refetchReplies } = useGetReviewReplies(
    replyParams,
    { enabled: !!replyParams.targetId && !!replyParams.targetType && !!replyParams.rootId });
  // const { records: replies = [] } = replyRes;

  /**
* @description 事件处理
*/
  // 回复提交
  const submitReply = async (replyId, rootId) => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      logger.debug("初始数据", values);
      const submitData = {
        parentId: replyId,
        content: values.content,
        targetType,
        targetId,
        rootId: rootId,
      };

      logger.debug('准备提交数据:', submitData);
      doUploadPost(submitData);
    }).catch((error) => {
      logger.error('表单验证失败:', error);
    });
  };

  // 回复展开/收起
  const toggleReplies = (id) => {
    const isExpanded = expandedReplies[id];
    logger.debug("当前状态是", isExpanded, id)
    setExpandedReplies(prev => ({ ...prev, [id]: !isExpanded }));
    //展开发送请求
    if (!isExpanded) {
      const newreplyParams = {
        ...replyParams,
        rootId: id
      };
      setReplyParams(newreplyParams);
    }
  };
  //处理点击回复
  const handleAnswer = (id) => {
    if (id === replyTo) setReplyTo(null);
    else setReplyTo(id);
  };

  //处理点赞

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


  //回复的数据从queryClient里面拿，因为可以同时展开多个评论
  const getReply = (rootId) => {
    logger.debug("渲染回复区", rootId)
    return queryClient.getQueryData(['reviews', 'replies', targetType, targetId, rootId]);
  }
  //处理排序
  const handleOrder = (value) => {
    setReviewParams(pre => ({ ...pre, orderBy: value }))
    setExpandedReplies({})
  }


  // 加载组件
  const LoadingComponent = ({ isLoading, children }) => (
    <Spin
      spinning={isLoading}
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      tip="加载中..."
    >
      {children}
    </Spin>
  );

  // 评论回复组件
  const Answer = ({ id, username, rootId }) => {
    // 判断当前回复的id是不是展开的id
    if (id !== replyTo) return;
    return (
      <div className="flex space-x-3 mt-4">
        <div className="flex-1">
          <Form
            form={form}
            layout="horizontal"
            onFinish={() => submitReply(id, rootId)}
          >
            <Form.Item
              name="content"
              rules={[{ required: true, message: '请输入至少一个字的评论' },
              { min: 1, message: '回复至少有一个字' },
              { max: 1000, message: '回复不能超过1000字' }
              ]}>
              <TextArea
                allowClear
                placeholder={`回复 @${username}...`}
                rows={3}
                showCount
                maxLength={1000}
                className="mb-2 !text-base resize-none border border-main rounded transition-colors"
              />
            </Form.Item>
            <div className='flex gap-4 justify-end'>
              <CancelConfirmButton
              >
                取消
              </CancelConfirmButton>
              <SubmitConfirmButton
                type="blue"
                onConfirm={() => submitReply(id)}
              >
                发送
              </SubmitConfirmButton>
            </div>
          </Form>
        </div>
      </div>
    )
  }


  return (
    <div className="max-w-4xl mx-auto px-2 bg-card rounded-lg">
      {/* 评论区标题 + 排序 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-main">全部评论 ({total})</h2>
        <OrderButton
          size="small"
          list={POST_ORDER}
          value={reviewParams.orderBy}
          handleSortChange={handleOrder}
          className="small-radio"
        />

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
                      title={username}
                      className="border border-main cursor-pointer flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 pl-4">
                      {/* 主评论上传者 */}
                      <div className="flex flex-wrap items-baseline gap-4 text-sm text-muted text-secondary">
                        <span className="cursor-pointer font-semibold text-main text-base" title={username}>{subUsername(username, 15)}</span>

                        {[school, major, grade].filter(Boolean).join(" / ")}

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
                          <span className="font-semibold text-secondary cursor-pointer" onClick={() => handleAnswer(id)}>回复</span>
                        </div>
                        <ActionButton id={id} targetType={4} data={{ likeCount, replyCount }}
                          config={{
                            hasCollect: false, isLiked
                          }}
                          actionFn={{
                            handleLike, likeLoading, handleReply: toggleReplies
                          }}
                        />
                      </div>
                      {/* 回复输入框：当前回复该主评论时显示 */}
                      <Answer id={id} username={username} rootId={id} />
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
                                    parentId,
                                    rootId,
                                    user: replyUser = {},
                                    replyTo = {}
                                  } = reply;
                                  const {
                                    avatar: replyAvatar,
                                    userId: replyUserId,
                                    username: replyUsername = "匿名用户",
                                    school: replySchool,
                                    grade: replyGrade,
                                    major: replyMajor
                                  } = replyUser || {}
                                  const {
                                    uerId: replyToId,
                                    username: replyToUsername = "匿名用户"
                                  } = replyTo || {}
                                  return (
                                    <div key={replyId} className="flex space-x-3 flex-1 min-w-0 pl-4 py-2 border-l-2 border-secondary">
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
                                        <div className="flex flex-wrap items-baseline gap-4 text-xs">
                                          <span className="text-secondary font-semibold cursor-pointer text-sm">{replyUsername}</span>
                                          <span className="text-secondary ">
                                            {[replySchool, replyMajor, replyGrade].filter(Boolean).join(" / ")}
                                          </span>
                                        </div>
                                        {/* 回复标注：@主评论用户 */}
                                        <div className='py-2'>
                                          {parentId !== rootId &&
                                            <>
                                              <span className="text-main text-base" >回复</span>
                                              <span className="text-secondary font-semibold cursor-pointer text-base"> @{replyToUsername}：</span>
                                            </>}
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
                                            <span className="font-semibold text-secondary cursor-pointer" onClick={() => handleAnswer(replyId)}>回复</span>
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
                                        <Answer id={replyId} username={replyUsername} rootId={id} />
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