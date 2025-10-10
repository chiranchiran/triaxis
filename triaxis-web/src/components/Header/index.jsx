import React, { useState } from 'react';
import { Input, Button, Tooltip, Dropdown, Avatar, Menu, Divider, Badge } from 'antd';
import {
  SearchOutlined,
  CrownOutlined,
  GlobalOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  SettingOutlined,
  BellOutlined,
  UploadOutlined,
  FolderOutlined,
  BookOutlined,
  StarOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './index.less'

const { Search } = Input;

const Header = ({ onThemeToggle, currentTheme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, isAuthenticated, role } = useSelector(state => state.auth);

  const unreadMessageCount = 3;

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
  ];

  // 处理下拉菜单点击事件
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/user/userinfo');
        break;
      case 'setting':
        navigate('/user/setting');
        break;
      case 'message':
        navigate('/user/message');
        break;
      case 'upload':
        navigate('/user/upload');
        break;
      case 'resource':
        navigate('/user/resources');
        break;
      case 'course':
        navigate('/user/courses');
        break;
      case 'vip':
        navigate('/user/vip');
        break;
      case 'points':
        navigate('/user/points');
        break;
      case 'logout':
        // 这里需要调用你的退出登录 action
        // dispatch(logout());
        navigate('/login');
        break;
      default:
        break;
    }
  };

  // 定义下拉菜单项
  const menuItems = [
    {
      key: 'profile',
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
    <header className="header fixed top-0 w-full z-50 bg-white border-b border-main shadow-card">
      <div className="max-w-10xl w-full px-6">
        <div className="flex overflow-y-hidden items-center justify-between h-20">
          {/* Logo 和导航 */}
          <div className="flex items-center md:space-x-4 lg:spaca-x-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Triaxis" className="w-10 h-10" />
              </div>
              <span className="text-2xl font-bold text-main">Triaxis</span>
            </div>
            <nav className="md:flex">
              {navs.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-black-light text-white py-7 px-5 hover:bg-gray hover:text-white text-title'
                      : 'text-title font-medium py-7 px-5 transition-all duration-300 hover:!bg-gray-200 hover:!text-black text-tittle hover:!text-tittle'
                  }
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
            <Button
              type="text"
              icon={<UploadOutlined />}
              className="bg-primary text-white border-primary transition-colors"
            >
              上传
            </Button>

            <Button
              type="text"
              icon={<CrownOutlined />}
              className="bg-orange text-main border-orange transition-colors"
            >
              会员
            </Button>

            <Tooltip title="语言切换">
              <Button
                type="text"
                icon={<GlobalOutlined />}
                className="text-muted hover:text-primary transition-colors"
              />
            </Tooltip>

            <Tooltip title={currentTheme === 'light' ? '暗色模式' : '亮色模式'}>
              <Button
                type="text"
                icon={currentTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                onClick={onThemeToggle}
                className="text-muted hover:text-primary transition-colors"
              />
            </Tooltip>

            {!isAuthenticated ? (
              <div className="flex space-x-3">
                <Button
                  type="text"
                  className="bg-gray border-main text-main transition-colors"
                  onClick={() => navigate("/register")}
                >
                  注册
                </Button>
                <Button
                  type="text"
                  className="bg-gray border-main text-main transition-colors"
                  onClick={() => navigate("/login")}
                >
                  登录
                </Button>
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