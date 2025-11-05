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
  FilterOutlined,
  ArrowRightOutlined,
  UserOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ActionButton, MyButton, OrderButton } from './MyButton';
import Category from './Category';
import { useGetPosts, useGetPostTypes } from '../hooks/api/community';
import { BOUNTY_ORDER, communityFilterList, SORT_OPTIONS } from '../utils/constant/order';
import { addAll, filterNull, subUsername } from '../utils/error/commonUtil';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCollect, useLike } from '../hooks/api/common';
dayjs.extend(relativeTime);
//悬赏贴
export const BountyPost = ({ post, handleLike = null, handleCollect = null }) => {
  const navigate = useNavigate();
  // 获取紧急程度标签
  const getUrgencyTag = (urgency) => {
    const urgencyMap = {
      1: { color: 'tag-blue', text: '一般' },
      2: { color: 'tag-orange', text: '紧急' },
      3: { color: 'tag-red', text: '非常紧急' }
    };
    const info = urgencyMap[urgency] || { color: 'default', text: '一般' };
    return <Tag className={`${info.color}`}>{info.text}</Tag>;
  };

  const {
    postDetail: {
      id = 0,
      title = "未知标题",
      description = "",
      subject = "未知领域",
      topic = "未知主题",
      price = 0,
      urgency = 2,
      publishTime = "",
      updateTime = "",
      deadline = "",
      viewCount = 0,
      likeCount = 0,
      collectCount = 0,
      replyCount = 0,
      isSolved = false,
      isRecommended = false
    } = {},
    uploader: {
      userId = 0,
      username = "匿名用户",
      avatar = "",
      school = "",
      grade = "",
      major = ""
    } = {},

    userActions: {
      isLiked = false,
      isCollected = false,
    } = {}
  } = post || {};

  return (
    <Badge.Ribbon text={`${price} 积分`} className={"ribbon-blue"} size="large">
      <div
        className="border-0 shadow-sm hover:shadow-md rounded-lg p-3 transition-all duration-300 bg-blue-light"
      >
        {/* 顶部：悬赏积分和解决状态 */}
        <div className="flex justify-start items-start space-x-2">
          {isSolved ?
            <Tag className="tag-green">
              已解决
            </Tag> :
            <Tag className="tag-red">
              未解决
            </Tag>
          }
          {getUrgencyTag(urgency)}
        </div>
        {/* 中部：帖子描述和标题 */}
        <div className='space-y-3 mt-3 mb-1' onClick={() => navigate(`/community/posts/${id}`)}>
          <Link to={`/community/posts/${id}`} className="text-base mb-2 cursor-pointer line-clamp-1 block">
            【{topic}】{title}</Link>

          {/* 问题描述 */}
          <p className="text-main text-sm line-clamp-2 leading-5 h-10">
            {description || '该帖子没有具体描述'}
          </p>

          {/* 截止时间 */}
          <div className="text-xs text-secondary flex items-center text-center">
            <ClockCircleOutlined className="mr-1" />
            <span> 截止：{deadline}</span>
          </div>
        </div>

        {/* 底部：作者信息和统计 */}
        <div className="flex items-center justify-between text-xs text-secondary pt-2 border-t border-main">
          <div className="flex items-center justify-start gap-3 text-xs text-secondary">
            <span className="flex items-center cursor-pointer" title={avatar}>
              <Avatar
                size={16}
                src={avatar}
                icon={<UserOutlined />}
                className="border border-main !mr-1"
              />
              {subUsername(username, 15)}
            </span>
            {dayjs(publishTime, "YYYY.MM.DD HH:mm:ss").fromNow()}发布
          </div>
          <ActionButton id={id} targetType={3} gap={3}
            data={{ likeCount, replyCount, collectCount, viewCount }}
            config={{
              isLiked, isCollected, isReply: false, hasView: true
            }}
            actionFn={{
              handleLike, handleCollect
            }}
          />
        </div>
      </div>
    </Badge.Ribbon>
  )
}
export const NormalPost = ({ post, handleLike = null, handleCollect = null }) => {
  const navigate = useNavigate();
  // 获取紧急程度标签
  const {
    postDetail: {
      id = 0,
      title = "未知标题",
      description = "",
      subject = "未知领域",
      topic = "未知主题",
      price = 0,
      urgency = 2,
      publishTime = "",
      updateTime = "",
      deadline = "",
      viewCount = 0,
      likeCount = 0,
      collectCount = 0,
      replyCount = 0,
      isSolved = false,
      isRecommended = false
    } = {},
    uploader: {
      userId = 0,
      username = "匿名用户",
      avatar = "",
      school = "",
      grade = "",
      major = ""
    } = {},

    userActions: {
      isLiked = false,
      isCollected = false,
    } = {}
  } = post || {};

  return (
    <Badge.Ribbon text={`${price} 积分`} className={"ribbon-blue"} size="large">
      <div
        className="border-0 shadow-sm hover:shadow-md rounded-lg p-3 transition-all duration-300 bg-blue-light"
      >
        {/* 顶部：悬赏积分和解决状态 */}
        <div className="flex justify-start items-start space-x-2">
          <Tag className="tag-green">
            {subject}
          </Tag>

        </div>
        {/* 中部：帖子描述和标题 */}
        <div className='space-y-3 mt-3 mb-1' onClick={() => navigate(`/community/posts/${id}`)}>
          <Link to={`/community/posts/${id}`} className="text-base mb-2 cursor-pointer line-clamp-1 block">
            【{topic}】{title}</Link>

          {/* 问题描述 */}
          <p className="text-main text-sm line-clamp-2 leading-5 h-10">
            {description || '该帖子没有具体描述'}
          </p>
        </div>

        {/* 底部：作者信息和统计 */}
        <div className="flex items-center justify-between text-xs text-secondary pt-2 border-t border-main">
          <div className="flex items-center justify-start gap-3 text-xs text-secondary">
            <span className="flex items-center cursor-pointer" title={avatar}>
              <Avatar
                size={16}
                src={avatar}
                icon={<UserOutlined />}
                className="border border-main !mr-1"
              />
              {subUsername(username, 15)}
            </span>
            {dayjs(publishTime, "YYYY.MM.DD HH:mm:ss").fromNow()}发布
          </div>
          <ActionButton id={id} targetType={3} gap={3}
            data={{ likeCount, replyCount, collectCount, viewCount }}
            config={{
              isLiked, isCollected, isReply: false, hasView: true
            }}
            actionFn={{
              handleLike, handleCollect
            }}
          />
        </div>
      </div>
    </Badge.Ribbon>
  )
}