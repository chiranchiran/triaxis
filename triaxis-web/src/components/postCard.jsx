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

const urgencyMap = {
  1: { color: 'tag-blue', text: '一般' },
  2: { color: 'tag-orange', text: '紧急' },
  3: { color: 'tag-red', text: '非常紧急' }
};
//悬赏贴
export const BountyPost = ({ post, handleLike = null, handleCollect = null }) => {
  const navigate = useNavigate();
  // 获取紧急程度标签

  const getUrgencyTag = (urgency) => {
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
      solvedTime = "",
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
    } = {},
    tags = []
  } = post || {};

  return (
    <Badge.Ribbon text={`${price} 积分`} className={"ribbon-blue"} size="large">
      <div
        className="border-0 shadow-sm hover:shadow-md rounded-lg p-3 transition-all duration-300 bg-blue-light bounty"
      >
        {/* 顶部：悬赏积分和解决状态 */}
        <div className="flex justify-start items-start space-x-2 mb-2">
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
        {/* 作者信息 */}
        <div className="flex items-center justify-start gap-3 text-sm text-secondary">
          <div className="flex items-center cursor-pointer" title={username}>
            <Avatar
              size={32}
              src={avatar}
              icon={<UserOutlined />}
              className="border border-main1"
            />

          </div>
          <div className='flex flex-col items-start gap-0'>
            <div className=' text-main flex gap-3 items-end'>
              <div className='font-bold cursor-pointer' title={username}>
                {subUsername(username, 15)}
              </div>
              <div className='flex text-secondary justify-start flex-wrap text-xs'>
                {[school, major, grade].filter(Boolean).join(" / ")}
              </div>
            </div>
            <span className='text-xs'> {dayjs(publishTime, "YYYY.MM.DD HH:mm:ss").fromNow()}</span>
          </div>
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
            {isSolved ? <span> 解决时间：{solvedTime}</span> : <span> 截止：{deadline}</span>}
          </div>
        </div>

        {/* 底部：tag和统计 */}
        <div className="flex items-center justify-between text-xs text-secondary pt-2 border-t border-secondary">
          <div className='text-xs flex gap-2 h-4 overflow-hidden flex-wrap'>
            {
              tags && tags.map(tag => (
                <span className='text-nowrap flex-shrink-0' key={tag.id}>#{tag.name}</span>
              ))
            }
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
    } = {},
    tags = []
  } = post || {};

  return (
    <div
      className="transition-all duration-300"
    >
      {/* 作者信息 */}
      <div className="flex items-center justify-start gap-3 text-sm text-secondary mb-2">
        <div className="flex items-center cursor-pointer" title={username}>
          <Avatar
            size={36}
            src={avatar}
            icon={<UserOutlined />}
            className="border border-main1"
          />

        </div>
        <div className='flex flex-col items-start gap-1'>
          <div className=' text-main flex gap-3 items-end'>
            <div className='font-bold cursor-pointer' title={username}>
              {subUsername(username, 15)}
            </div>
            <div className='flex text-secondary justify-start flex-wrap text-xs'>
              {[school, major, grade].filter(Boolean).join(" / ")}
            </div>
          </div>
          <span className='text-xs'> {dayjs(publishTime, "YYYY.MM.DD HH:mm:ss").fromNow()}</span>
        </div>
      </div>
      {/* 顶部：帖子描述和标题 */}
      <div className='mb-4' onClick={() => navigate(`/community/posts/${id}`)}>
        {/*tag和标题*/}
        <div className="flex items-center gap-0 mb-2">
          {isRecommended && (
            <Tag className="tag-orange">精华</Tag>
          )}
          <Tag className="tag-blue">
            {topic}
          </Tag>

          {/* 标题 */}
          <Link
            to={`/community/posts/${id}`}
            className="text-base cursor-pointer flex-1  line-clamp-2 block overflow-hidden"
          >
            {title}
          </Link>
        </div>

        {/* 问题描述 */}
        <p className="text-main text-base line-clamp-2 leading-5 ">
          {description || '该帖子没有具体描述'}
        </p>
      </div>

      {/* 底部：作者信息和统计 */}
      <div className="flex items-center justify-between text-sm text-secondary pb-2 border-b border-secondary">
        <div className='text-small flex gap-2 h-6 overflow-hidden flex-wrap'>
          {
            tags && tags.map(tag => (
              <span className='text-nowrap flex-shrink-0' key={tag.id}>#{tag.name}</span>
            ))
          }
        </div>
        <ActionButton id={id} targetType={3} gap={5}
          data={{ likeCount, replyCount, collectCount, viewCount }}
          config={{
            isLiked, isCollected, hasView: true
          }}
          actionFn={{
            handleLike, handleCollect
          }}
        />
      </div>
    </div>
  )
}
export const SquarePost = ({ post, handleLike = null, handleCollect = null }) => {
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
      solvedTime = "",
      type = 0,
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
    } = {},
    tags = []
  } = post || {};

  return (
    <div
      className="transition-all duration-300 mb-4"
    >
      {/* 作者信息 */}
      <div className="flex justify-between text-base  mb-2">
        <div className='flex items-center justify-start gap-3 text-secondary'>
          <div className="flex items-center cursor-pointer" title={username}>
            <Avatar
              size={40}
              src={avatar}
              icon={<UserOutlined />}
              className="border border-main1"
            />

          </div>
          <div className='flex flex-col items-start gap-1'>
            <div className=' text-main flex gap-3 items-end'>
              <div className='font-bold cursor-pointer' title={username}>
                {subUsername(username, 15)}
              </div>
              <div className='flex text-secondary justify-start flex-wrap text-sm'>
                {[school, major, grade].filter(Boolean).join(" / ")}
              </div>
            </div>
            <span className='text-xs'> {dayjs(publishTime, "YYYY.MM.DD HH:mm:ss").fromNow()}</span>
          </div>
        </div>
        <div className='mr-4 text-center text-sm text-secondary'>
          浏览量
          <p className='text-main font-bold'>{viewCount}</p>
        </div>
      </div>
      {/* 顶部：帖子描述和标题 */}
      <div className='mb-2' onClick={() => navigate(`/community/posts/${id}`)}>
        {/*tag和标题*/}
        <div className="flex items-center gap-0 mb-2 text-lg">
          {isRecommended && (
            <Tag className="tag-orange">精华</Tag>
          )}
          <Tag className="tag-blue">
            {subject}
          </Tag>
          <Tag className="tag-orange">
            {topic}
          </Tag>

          {/* 标题 */}
          <Link
            to={`/community/posts/${id}`}
            className="cursor-pointer flex-1 line-clamp-2 block overflow-hidden !font-medium"
          >
            {title}
          </Link>
        </div>

        {/* 问题描述 */}
        <p className="text-main text-base line-clamp-2 leading-5 ">
          {description || '该帖子没有具体描述'}
        </p>
        {/* 悬赏贴的信息 */}
        {/* 未解决 */}
        {
          type === 2 && !isSolved && (
            <div className='flex gap-4 text-secondary mt-6 text-sm items-center'>
              <div className='flex gap-0 items-center'>
                <Tag className="tag-red">
                  悬赏贴
                </Tag>
                {urgencyMap[urgency].text}
              </div>

              <span>积分：{price}</span>
              <div className=" flex items-center text-center">
                <ClockCircleOutlined className="mr-1" />
                <span> 截止：{deadline}</span>
              </div>
            </div>
          )
        }
        {/* 已解决 */}
        {
          type === 2 && isSolved && (
            <div className='flex gap-4 text-secondary mt-6 text-sm items-center'>
              <div className='flex gap-0 items-center'>
                <Tag className="tag-red">
                  悬赏贴
                </Tag>
                积分：{price}
              </div>
              <div className=" flex items-center text-center">
                <ClockCircleOutlined className="mr-1" />
                <span> 解决时间：{solvedTime}</span>
              </div>
            </div>
          )
        }
      </div>

      {/* 底部：作者信息和统计 */}
      <div className="flex items-center justify-between text-sm text-secondary pb-3 border-b border-secondary">
        <div className='text-small flex gap-3 h-6 overflow-hidden flex-wrap'>
          {
            tags && tags.map(tag => (
              <span className='text-nowrap flex-shrink-0' key={tag?.id}>#{tag?.name}</span>
            ))
          }
        </div>
        <ActionButton id={id} targetType={3} gap={6}
          data={{ likeCount, replyCount, collectCount }}
          config={{
            isLiked, isCollected, hasView: false
          }}
          actionFn={{
            handleLike, handleCollect
          }}
        />
      </div>
    </div>
  )
}