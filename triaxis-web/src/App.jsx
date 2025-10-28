
import Element from './routes'
import { ConfigProvider, theme as antdTheme, theme } from 'antd'
import React, { useCallback, useEffect } from 'react'
import Header from './components/Header/index.jsx'
import { getLoginData, getUserData, removeAllData } from './utils/localStorage'
import { useAutoLogin } from './hooks/api/login.js'
import Sidebar from './components/SideBar/index.jsx'
import SiteFooter from './components/SiteFooter/index.jsx'
import { useLocation } from 'react-router-dom'
import { logger } from './utils/logger.js'
import { ReactFlowProvider } from 'reactflow'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'


function App() {
  const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;
  const { mutate } = useAutoLogin()
  const location = useLocation();
  //每次刷新页面滚到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])

  //检查是否自动登录
  const checkAutoLogin = useCallback(() => {
    const { rememberMe, autoLoginExpire } = getUserData()
    if (rememberMe === true && autoLoginExpire) {
      if (Date.now() < autoLoginExpire) {
        logger.debug("检查进行自动登录")
        mutate()
      } else {
        removeAllData()
      }
    }
  }, [mutate])

  // 只在组件挂载时检查自动登录
  useEffect(() => {
    checkAutoLogin()
  }, [checkAutoLogin])
  //检查语言和主题设置
  useEffect(() => {
    dayjs.locale('zh-cn');
  }, [])
  return (

    <div className="min-h-screen bg-main">
      <Header />
      <main className="pt-20 relative">
        <ReactFlowProvider>
          <Element />
        </ReactFlowProvider>
        <Sidebar />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App