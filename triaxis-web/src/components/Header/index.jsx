import React, { useState } from 'react';
import { Input, Button, Tooltip, Dropdown, Avatar, Menu, Divider, Badge } from 'antd';
import {
  SearchOutlined, CrownOutlined, GlobalOutlined, UserOutlined, MoonOutlined, SunOutlined, SettingOutlined, BellOutlined, UploadOutlined, FolderOutlined, BookOutlined, StarOutlined, LogoutOutlined
} from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './index.less'
import { useLogout } from '../../hooks/api/login';
import Logo from '../Logo';
import { usePrefernce } from '../../hooks/usePreference';
import MyButton from '../MyButton';

const Header = () => {
  const { Search } = Input;
  const navigate = useNavigate()
  const { isDark, isEnglish, changeLanguage, changeTheme } = usePrefernce()
  const { mutate: doLogout } = useLogout()
  const { username, isAuthenticated, role } = useSelector(state => state.auth);

  const unreadMessageCount = 3;

  //导航栏选项，普通用户role为0，管理员role为1，会显示管理的选项
  const navs = role !== 0 ? [
    { name: '首页', path: '/' },
    { name: '资源', path: '/resources' },
    { name: '课程', path: '/courses' },
    { name: '社区', path: '/community' },
    { name: '关于', path: '/about' }
  ] : [
    { name: '首页', path: '/' },
    { name: '资源', path: '/resources' },
    { name: '课程', path: '/courses' },
    { name: '社区', path: '/community' },
    { name: '关于', path: '/about' },
    { name: '管理', path: '/admin' }
  ]

  // 处理下拉菜单点击事件，转跳不同的页面
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'userinfo':
        navigate('/user/userinfo')
        break;
      case 'setting':
        navigate('/user/setting')
        break;
      case 'message':
        navigate('/user/message')
        break;
      case 'upload':
        navigate('/user/upload')
        break;
      case 'resource':
        navigate('/user/resources')
        break;
      case 'course':
        navigate('/user/courses')
        break;
      case 'vip':
        navigate('/user/vip')
        break;
      case 'points':
        navigate('/user/points')
        break;
      case 'logout':
        doLogout()
        break;
      default:
        break;
    }
  }

  // 用户下拉菜单项
  const menuItems = [
    {
      key: 'userinfo',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: '我的设置',
    },
    {
      key: 'message',
      icon: <BellOutlined />,
      label: (
        <Badge count={unreadMessageCount} size="small">
          我的消息
        </Badge>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'upload',
      icon: <UploadOutlined />,
      label: '我的上传',
    },
    {
      key: 'resource',
      icon: <FolderOutlined />,
      label: '我的资源',
    },
    {
      key: 'course',
      icon: <BookOutlined />,
      label: '我的课程',
    },
    {
      type: 'divider',
    },
    {
      key: 'vip',
      icon: <CrownOutlined />,
      label: '我的会员',
    },
    {
      key: 'points',
      icon: <StarOutlined />,
      label: '我的积分',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];


  return (
    <header className="header fixed top-0 w-full z-99 bg-card border-b border-main shadow-card">
      <div className="max-w-10xl w-full px-6">
        <div className="flex overflow-y-hidden items-center justify-between h-20">
          {/* Logo 和导航 */}
          <div className="flex items-center md:space-x-6 lg:spaca-x-20">
            <Logo size="default" isNav={true} />
            <nav className="nav-top md:flex">
              {navs.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => [
                    "py-7 px-5 transition-all duration-300 text-title",
                    // 活跃状态样式
                    isActive ? "bg-dark text-light " :
                      // 非活跃状态样式
                      "text-main"
                  ].join(' ')}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 max-w-lg lg:mx-10 xl:mx-10 2xl:mx-25">
            <Search
              placeholder="搜索资源、课程、帖子..."
              enterButton={<SearchOutlined />}
              size="large"
              className="min-x-10 rounded-lg"
            />
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-3">
            <MyButton
              type="blue"
              icon={<UploadOutlined />}
              styles="text-main"
              onClick={() => navigate("/upload")}
            >上传</MyButton>
            <MyButton
              type="orange"
              icon={<CrownOutlined />}
              styles="text-main"
              onClick={() => navigate('/user/vip')}
            >    会员</MyButton>

            <Tooltip title={isEnglish ? '切换中文' : '切换英文'}>
              <Button
                type="text"
                size="large"
                onClick={changeLanguage}
                icon={<GlobalOutlined />}
                className="change text-muted transition-colors"
              />
            </Tooltip>

            <Tooltip title={isDark ? '切换亮色模式' : '切换暗色模式'}>
              <Button
                type="text"
                size="large"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={changeTheme}
                className="text-muted transition-colors"
              />
            </Tooltip>

            {!isAuthenticated ? (
              <div className="flex space-x-3">
                <MyButton
                  type="gray"
                  onClick={() => navigate("/register")}
                >注册</MyButton>
                <MyButton
                  type="gray"
                  onClick={() => navigate("/login")}
                >登录</MyButton>
              </div>
            ) : (
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: handleMenuClick
                }}
                trigger={['click']}
                placement="bottomRight"
              >
                <div className="cursor-pointer">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    className="bg-primary hover:bg-primary-dark transition-colors"
                  />
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;