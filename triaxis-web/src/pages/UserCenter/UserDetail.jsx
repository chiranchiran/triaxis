
import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Button,
  Tabs,
  List,
  Badge,
  Tag,
  Switch,
  Progress,
  Statistic,
  Row,
  Col,
  Divider,
  Input,
  Modal,
  Form,
  Upload,
  message,
  Empty,
  Select,
  Space,
  Radio,
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  FolderOutlined,
  BookOutlined,
  CrownOutlined,
  StarOutlined,
  HeartOutlined,
  MessageOutlined,
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  LockOutlined,
  WechatOutlined,
  GithubOutlined,
  QqOutlined,
  WeiboOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { MyButton } from '../../components/MyButton';
import { Statis } from '../../components/DetailCard';
import { useNavigate } from 'react-router-dom';


export default function UserDetail({ user }) {
  const navigate = useNavigate();

  // 解构用户字段
  const {
    id = null,
    username = "",
    email = "",
    phone = "",
    avatar = "",
    wechatOpenid = "",
    qqOpenid = "",
    weiboUid = "",
    githubId = "",
    bio = "",
    gender = 0, // 0未知，1男2女
    school = "",
    major = "",
    grade = "",
    subject = "", // 研究领域
    vipLevel = 0,
    vipTime = "",
    createTime = "",
    points = 0,
    pointsGet = 0,
    pointsSpent = 0,
    resourceCount = 0,
    postCount = 0,
    courseCount = 0,
    likeCount = 0,
    purchaseCount = 0,
    status = 1, // 0禁用
    role = 0, // 0普通
  } = user;

  return (
    <div className="mb-6 bg-blue-light rounded-lg p-6 shadow-md flex flex-col md:flex-row items-center md:items-start gap-12">
      {/* 头像区域（保持不变） */}
      <div className="flex flex-col gap-4 items-center">
        <Avatar
          size={100}
          src={avatar}
          icon={<UserOutlined />}
          title={username}
          className="border-4 border-main shadow-md"
        />
        <div className='space-x-4'>
          {gender === 1 ? <ManOutlined className='text-primary-dark' /> : gender === 2 ? <WomanOutlined className='text-like' /> : null}
          {vipLevel > 0 && <span className='text-vip' ><CrownOutlined className='text-vip mr-1' />VIP</span>}
        </div>
        {vipLevel > 0 && (
          <span className='text-secondary text-sm text-center' >
            <div>VIP到期时间</div>
            {vipTime}
          </span>
        )}
        <MyButton
          type="black"
          size='large'
          icon={<EditOutlined />}
          onClick={() => navigate('/user/edit')}
          className="w-full"
        >
          编辑资料
        </MyButton>
      </div>

      {/* 用户信息展示 */}
      <div className="flex-1 text-center md:text-left flex flex-col gap-6">
        <div className='flex flex-col gap-1'>
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 text-secondary">
            <h1 className="text-2xl font-bold text-main">{username}</h1>
            <div>{[school, major, grade].filter(Boolean).join(" / ")}</div>
          </div>
          <div className="flex gap-20 flex-wrap">
            <div className="flex items-center gap-2">
              <TagsOutlined />
              <span>研究领域：{subject || "未设置"}</span>
            </div>
            <div className="flex items-center gap-2">
              <LockOutlined className={status === 0 ? 'text-red-500' : 'text-green-500'} />
              <span>
                账户状态：
                {status === 0 ? <Badge status="error" text="禁用" /> : <Badge status="success" text="正常" />}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserOutlined className="text-gray-500" />
              <span>
                角色：
                {role === 0 ? "普通用户" : role === 1 ? "管理员" : "未知角色"}
              </span>
            </div>
          </div>
        </div>
        <p>个人简介：{bio || "未填写"}</p>
        <div className="grid grid-cols-8 gap-3 text-center bg-orange-light rounded-lg">
          <Statis count={points} className='text-sm mt-2' >积分</Statis>
          <Statis count={pointsGet} className='text-sm mt-2' >已获得积分</Statis>
          <Statis count={pointsSpent} className='text-sm mt-2' >已使用积分</Statis>
          <Statis count={postCount} className='text-sm mt-2' >帖子</Statis>
          <Statis count={resourceCount} className='text-sm mt-2' >上传资源</Statis>
          <Statis count={courseCount} className='text-sm mt-2' >上传课程</Statis>
          <Statis count={purchaseCount} className='text-sm mt-2' >已购买</Statis>
          <Statis count={likeCount} className='text-sm mt-2' >获赞</Statis>
        </div>
        <div className="text-sm text-secondary flex items-center justify-center md:justify-start">
          <ClockCircleOutlined className="mr-2" />
          加入时间：{createTime}
        </div>
      </div>
    </div>
  );
}
