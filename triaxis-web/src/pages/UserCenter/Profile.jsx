
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
  Descriptions,
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
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { MyButton } from '../../components/MyButton';
import { Statis } from '../../components/DetailCard';
import { ItemLayout, SecondTitle } from '.';
import { useGetUserProfile } from '../../hooks/api/user';

const { Search } = Input;
const { Meta } = Card;
const { Option } = Select;


export const Profile = () => {

  /**
   * @description 数据获取
   */
  const { data: userProfile = {} } = useGetUserProfile();
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
    gender = 0,
    school = "",
    major = "",
    grade = "",
    subject = "",
    vipLevel = 0,
    vipTime = "",
    vipStart = "",
    createTime = "",
    points = 0,
    pointsGet = 0,
    pointsSpent = 0,
    resourceCount = 0,
    postCount = 0,
    courseCount = 0,
    likeCount = 0,
    purchaseCount = 0,
    status = 1,
    role = 0,
  } = userProfile

  const infoList = [{
    key: "1",
    label: "用户名",
    children: username,
  }, {
    key: "2",
    label: "性别",
    children: gender === 0 ? "未知" : (gender === 1 ? "男" : "女")
  }, {

    key: "3",
    label: "领域",
    children: subject.name
  }, {
    key: "4",
    label: "身份",
    children: role === 0 ? '普通用户' : "管理员"
  }, {
    key: "5",
    label: "账户状态",
    children: status === 0 ? < Badge status="error" text="禁用" /> : < Badge status="success" text="正常" />,
    span: 3
  }, {
    key: "6",
    label: "学校",
    children: school
  }, {
    key: "7",
    label: "专业",
    children: major
  }, {
    key: "8",
    label: "年级",
    children: grade
  }, {
    key: "9",
    label: "VIP等级",
    children: vipLevel === 0 ? < Badge status="warning" text="您还不是vip" /> : vipLevel
  }, {
    key: "10",
    label: "VIP开通时间",
    children: vipLevel === 0 || !vipStart ? "暂无" : vipStart
  }, {
    key: "11",
    label: "VIP到期",
    children: vipLevel === 0 || !vipTime ? "暂无" : vipTime
  }, {
    key: "12",
    label: "加入网站时间",
    children: createTime
  }
  ]

  const countInfo = [
    {
      label: "邮箱",
      icon: <MailOutlined className="text-xl" />,
      id: email,
    },
    {
      label: "手机号",
      icon: <PhoneOutlined className="text-xl" />,
      id: phone,
    },
    {
      label: "微信",
      icon: <WechatOutlined className="text-xl" />,
      id: wechatOpenid,
    }, {
      label: "QQ",
      icon: <QqOutlined className="text-xl" />,
      id: qqOpenid,
    },
    {
      label: "GitHub",
      icon: <GithubOutlined className="text-xl" />,
      id: githubId,
    },
    {
      label: "微博",
      icon: <WeiboOutlined className="text-xl" />,
      id: weiboUid,
    },
  ]
  return (
    <ItemLayout label="个人信息">
      <SecondTitle label="基本信息">
        <Descriptions bordered items={infoList} />
      </SecondTitle>
      <SecondTitle label="个人简介">
        <p className="text-gray-700 leading-relaxed p-4 bg-gray-light rounded-lg">{bio}</p>
      </SecondTitle>
      <SecondTitle label="账户绑定">
        {
          countInfo.map(info => (
            <div className='text-base flex items-center setting bg-gray-light rounded-lg py-2 px-4 w-80' key={info.label}>
              <div className='w-50 flex gap-2 items-center'>
                {info.icon}
                {info.label}：
              </div>
              {
                info.id ? <span className="px-1 text-secondary">已绑定</span> : <MyButton
                  size='long'
                  className="!w-24"
                  type="black"
                >
                  绑定
                </MyButton>
              }
            </div>
          ))
        }
      </SecondTitle>
    </ItemLayout>
  )
}