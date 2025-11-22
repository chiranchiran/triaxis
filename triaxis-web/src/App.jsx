
import MyRoutes from './routes'
import { ConfigProvider, theme as antdTheme, theme } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import Header from './components/Header/index.jsx'
import { getLoginData, getUserData, removeAllData } from './utils/localStorage'
import Sidebar from './components/SideBar/index.jsx'
import SiteFooter from './components/SiteFooter/index.jsx'
import { useLocation } from 'react-router-dom'
import { logger } from './utils/logger.js'
import { ReactFlowProvider } from 'reactflow'
import { useChat } from './hooks/api/useChat.jsx'



function App() {
  const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;
  useChat(false);
  //每次刷新页面滚到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    //浏览器默认行为在刷新之后还是会回到原来的位置，可以在10ms后再滚动一次
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    return () => clearTimeout(timer);
  }, [])

  return (
    <MyRoutes />
  );
}

export default App