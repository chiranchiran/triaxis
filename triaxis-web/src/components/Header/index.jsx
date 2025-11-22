import React, { useCallback, useEffect, useState } from 'react';
import { Input, Button, Tooltip, Dropdown, Avatar, Menu, Divider, Badge, InputNumber } from 'antd';
import {
  SearchOutlined, CrownOutlined, GlobalOutlined, UserOutlined, MoonOutlined, SunOutlined, SettingOutlined, BellOutlined, UploadOutlined, FolderOutlined, BookOutlined, StarOutlined, LogoutOutlined
} from '@ant-design/icons';
import { Form, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './index.less'
import { useGoLogin, useLogout } from '../../hooks/api/login';
import Logo from '../Logo';
import { usePreference } from '../usePreference';
import { MyButton } from '../MyButton';
import { useTranslation } from 'react-i18next';
import { setLoginState, setMessageCount } from '../../store/slices/userCenterSlice';
import { useGetUserMessagesCount } from '../../hooks/api/user';
import { useChat } from '../../hooks/api/useChat';
import { generateSafeState } from '../../utils/commonUtil';

const Header = () => {

  const { t } = useTranslation()
  const { Search } = Input;
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const { total } = useSelector((state) => state.userCenter.messageCount)
  const { isDark, isEnglish, changeLanguage, changeTheme } = usePreference()
  const { mutateAsync: doLogout } = useLogout()
  const dispatch = useDispatch();
  const { username, isAuthenticated, role, avatar, id: userId } = useSelector(state => state.auth);
  const { mutateAsync: doGoLogin } = useGoLogin()
  // const { data } = useGetUserMessagesCount({
  //   onSuccess: (data) => dispatch(setMessageCount(data)),
  // });;
  const { getMessagesCount, SubscriptionTypes, subscribeMessageCount } = useChat(false)
  useEffect(() => {
    if (!userId) return;
    console.log('初始化聊天列表，用户ID:', userId);
    const id = subscribeMessageCount('chats', {
      [SubscriptionTypes.MESSAGE_COUNT]: handleChats,
    })
    getMessagesCount(userId)
  }, [userId]);

  const handleChats = useCallback((message) => {
    dispatch(setMessageCount(message));
  }, [])
  //导航栏选项，普通用户role为0，管理员role为1，会显示管理的选项
  const navKeys = [
    { key: 'home', path: '/' },
    { key: 'resources', path: '/resources' },
    { key: 'courses', path: '/courses' },
    { key: 'community', path: '/community' },
    { key: 'about', path: '/about' }
  ];

  // 处理下拉菜单点击事件，转跳不同的页面
  const handleMenuClick = ({ key }) => {
    if (!key) return
    if (key === 'logout') {
      doLogout(userId)
    } else {
      navigate(`/user/${key}`)
    }
  }
  // sso登录
  const handleLogin = async () => {
    const state = generateSafeState();
    await doGoLogin({ state })

    // dispatch(setLoginState(state))
    const redirectUri = '/sso/callback';
    navigate(`/login?state=${state}&redirectUri=${redirectUri}&originalPath=${pathname}`)
  }

  // 用户下拉菜单项
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '我的设置',
    },
    {
      key: 'messages',
      icon: <BellOutlined />,
      label: (
        <Badge count={total} size="small" offset={[8, -3]}>
          我的消息
        </Badge>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'resources',
      icon: <FolderOutlined />,
      label: '我的资源',
    },
    {
      key: 'courses',
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
              {navKeys.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={({ isActive }) => [
                    "py-7 px-5 transition-all duration-300 text-title",
                    isActive ? "bg-dark text-light" : "text-main"
                  ].join(' ')}
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 max-w-lg lg:mx-10 xl:mx-10 2xl:mx-25">
            <Search
              placeholder="搜索资源、课程、帖子..."
              enterButton={<SearchOutlined />}
              size="middle"
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
                  onClick={handleLogin}
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
                className='user'
              >
                <div className="cursor-pointer">
                  <Avatar
                    size="small"
                    src={avatar}
                    icon={avatar ? null : <UserOutlined />}
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