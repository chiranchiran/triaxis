import React, { useState } from 'react';
import { Avatar, Rate, Button, List, Input } from 'antd';
import { HeartOutlined, HeartFilled, MessageOutlined, UserOutlined, MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// 模拟评论数据
const generateMockReviews = () => [
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
    likes: 23,
    liked: false,

    replies: [
      {
        id: 101,
        user: {
          name: '资源作者',
          avatar: '/images/avatar-author.jpg',
          level: '专业认证'
        },
        content: '谢谢你的认可！后续我会更新更多建筑案例解析～',
        createTime: '2023-11-15 16:20',
        likes: 5,
        liked: false
      },
      {
        id: 102,
        user: {
          name: '建筑小白',
          avatar: '/images/avatar-5.jpg',
          level: '新手上路'
        },
        content: '同感！这个资料对我帮助也很大',
        createTime: '2023-11-16 09:15',
        likes: 2,
        liked: false
      }
    ]
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
    likes: 15,
    liked: true,
    replies: [
      {
        id: 201,
        user: {
          name: '资源作者',
          avatar: '/images/avatar-author.jpg',
          level: '专业认证'
        },
        content: '感谢专业建议！下个版本会补充技术参数细节',
        createTime: '2023-11-10 11:30',
        likes: 3,
        liked: false
      }
    ]
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
    likes: 18,
    liked: false,
    replies: []
  },
  {
    id: 4,
    user: {
      name: '室内设计师',
      avatar: '/images/avatar-6.jpg',
      level: '中级用户'
    },
    rating: 4,
    content: '色彩搭配和空间布局的分析很专业，如果能增加一些软装设计的建议就更完美了！',
    createTime: '2023-11-03 10:20',
    likes: 12,
    liked: false,
    replies: [
      {
        id: 401,
        user: {
          name: '设计爱好者',
          avatar: '/images/avatar-7.jpg',
          level: '初级用户'
        },
        content: '我也觉得软装部分可以再详细一些',
        createTime: '2023-11-03 14:45',
        likes: 1,
        liked: false
      },
      {
        id: 402,
        user: {
          name: '资源作者',
          avatar: '/images/avatar-author.jpg',
          level: '专业认证'
        },
        content: '收到建议！正在准备软装专题内容',
        createTime: '2023-11-04 09:30',
        likes: 4,
        liked: false
      }
    ]
  }
];

// 生成更多模拟数据
const generateMoreReviews = () => {
  const baseReviews = generateMockReviews();
  for (let i = 5; i <= 15; i++) {
    baseReviews.push({
      id: i,
      user: {
        name: `用户${i}`,
        avatar: `/images/avatar-${i % 8 + 1}.jpg`,
        level: ['新手上路', '初级用户', '中级用户', '高级用户', '专家用户'][i % 5]
      },
      rating: Math.floor(Math.random() * 2) + 4, // 4-5星
      content: `这是第${i}条模拟评论内容，用于测试评论区展示效果和交互功能。`,
      createTime: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm'),
      likes: Math.floor(Math.random() * 50),
      liked: Math.random() > 0.7,
      replies: []
    });
  }
  return baseReviews;
};

const Review = () => {
  const [reviews, setReviews] = useState(generateMoreReviews());
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyCounts, setReplyCounts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  // 处理点赞
  const handleLike = (reviewId, isReply = false, parentId = null) => {
    setReviews(prev => prev.map(review => {
      if (isReply && review.id === parentId) {
        return {
          ...review,
          replies: review.replies.map(reply =>
            reply.id === reviewId
              ? { ...reply, likes: reply.liked ? reply.likes - 1 : reply.likes + 1, liked: !reply.liked }
              : reply
          )
        };
      }
      if (!isReply && review.id === reviewId) {
        return {
          ...review,
          likes: review.liked ? review.likes - 1 : review.likes + 1,
          liked: !review.liked
        };
      }
      return review;
    }));
  };

  // 切换回复展开状态
  const toggleReplies = (reviewId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // 加载更多回复
  const loadMoreReplies = (reviewId) => {
    setReplyCounts(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 1) + (prev[reviewId] === 1 ? 10 : 20)
    }));
  };

  // 收起回复
  const collapseReplies = (reviewId) => {
    setReplyCounts(prev => ({
      ...prev,
      [reviewId]: 1
    }));
  };

  // 开始回复
  const startReply = (reviewId) => {
    setReplyingTo(reviewId);
    setReplyContent('');
  };

  // 提交回复
  const submitReply = (reviewId) => {
    if (!replyContent.trim()) return;

    const newReply = {
      id: Date.now(),
      user: {
        name: '当前用户',
        avatar: '/images/avatar-current.jpg',
        level: '中级用户'
      },
      content: replyContent,
      createTime: dayjs().format('YYYY-MM-DD HH:mm'),
      likes: 0,
      liked: false
    };

    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, replies: [...review.replies, newReply] }
        : review
    ));

    setReplyingTo(null);
    setReplyContent('');
  };

  // 渲染单条回复
  const renderReply = (reply, parentId) => (
    <div key={reply.id} className="flex space-x-3 py-3">
      <Avatar
        size={32}
        src={reply.user.avatar}
        icon={<UserOutlined />}
        className="border border-gray-200 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-800 text-sm">{reply.user.name}</span>
          <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded">
            {reply.user.level}
          </span>
          <span className="text-gray-400 text-xs">{dayjs(reply.createTime).fromNow()}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleLike(reply.id, true, parentId)}
            className={`flex items-center text-xs transition-colors ${reply.liked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
              }`}
          >
            {reply.liked ? <HeartFilled className="mr-1" /> : <HeartOutlined className="mr-1" />}
            <span>{reply.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染回复列表
  const renderReplies = (replies, reviewId) => {
    const displayCount = replyCounts[reviewId] || 1;
    const visibleReplies = replies.slice(0, displayCount);
    const hasMore = replies.length > displayCount;

    return (
      <div className="ml-11 mt-3 space-y-1">
        {visibleReplies.map(reply => renderReply(reply, reviewId))}

        {hasMore && (
          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={() => loadMoreReplies(reviewId)}
              className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
            >
              展开{replies.length - displayCount}条回复
            </button>
            {displayCount > 1 && (
              <button
                onClick={() => collapseReplies(reviewId)}
                className="text-gray-500 text-sm hover:text-gray-600 transition-colors"
              >
                收起
              </button>
            )}
          </div>
        )}

        {displayCount > 1 && !hasMore && replies.length > 1 && (
          <button
            onClick={() => collapseReplies(reviewId)}
            className="text-gray-500 text-sm hover:text-gray-600 transition-colors pt-2"
          >
            收起回复
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      {/* 评论区标题 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">全部评论 ({reviews.length})</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>最新</span>
          <span>最热</span>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            {/* 主评论 */}
            <div className="flex space-x-4">
              <Avatar
                size={48}
                src={review.user.avatar}
                icon={<UserOutlined />}
                className="border border-main flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800 text-sm">
                      {review.user.name}
                    </span>
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      {review.user.level}
                    </span>
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      className="text-sm text-amber-500"
                    />
                  </div>
                  <MoreOutlined className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {review.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {dayjs(review.createTime).fromNow()}
                  </span>
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(review.id)}
                      className={`flex items-center text-sm transition-colors ${review.liked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
                        }`}
                    >
                      {review.liked ? <HeartFilled className="mr-1" /> : <HeartOutlined className="mr-1" />}
                      <span>{review.likes}</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleReplies(review.id);
                        if (!expandedReplies[review.id]) {
                          setReplyCounts(prev => ({ ...prev, [review.id]: 1 }));
                        }
                      }}
                      className="flex items-center text-gray-500 hover:text-blue-600 text-sm transition-colors"
                    >
                      <MessageOutlined className="mr-1" />
                      <span>{review.replies.length}</span>
                    </button>
                  </div>
                </div>

                {/* 回复输入框 */}
                {replyingTo === review.id && (
                  <div className="mt-4 flex space-x-3">
                    <Avatar size={32} src="/images/avatar-current.jpg" className="flex-shrink-0" />
                    <div className="flex-1">
                      <Input.TextArea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="写下你的回复..."
                        rows={2}
                        className="mb-2"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button onClick={() => setReplyingTo(null)}>取消</Button>
                        <Button type="primary" onClick={() => submitReply(review.id)}>
                          回复
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 回复列表 */}
                {expandedReplies[review.id] && review.replies.length > 0 && (
                  <>
                    {renderReplies(review.replies, review.id)}
                    <button
                      onClick={() => startReply(review.id)}
                      className="ml-11 mt-2 text-blue-500 text-sm hover:text-blue-600 transition-colors"
                    >
                      回复
                    </button>
                  </>
                )}

                {/* 没有回复时的回复按钮 */}
                {expandedReplies[review.id] && review.replies.length === 0 && (
                  <div className="ml-11 mt-3">
                    <button
                      onClick={() => startReply(review.id)}
                      className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
                    >
                      成为第一个回复的人
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;