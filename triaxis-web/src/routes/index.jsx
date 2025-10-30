import { useRoutes, useNavigate, Navigate } from "react-router-dom"
import { Button, Result } from "antd"
import Home from "../pages/Home/index.jsx"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import Resource from "../pages/Resource/index.jsx"
import Course from "../pages/Course/index.jsx"
import NotFound from "../pages/NotFound/index.jsx"
import About from "../pages/About/index.jsx"
import Login from "../pages/Login/index.jsx"
import Community from "../pages/Community/index.jsx"
import CommunityDetail from "../pages/CommunityDetail/index.jsx"
import Register from "../pages/Register/index.jsx"
import UserCenter from "../pages/UserCenter/index.jsx"
import FeedbackDisplay from "../pages/Feedback/index.jsx"
import ResourceDetail from "../pages/ResourceDetail/index.jsx"
import CourseDetail from "../pages/CourseDetail/index.jsx"
import UploadResource from "../pages/UploadResource/index.jsx"
import CreatePost from "../pages/CreatPost/index.jsx"
import PostDetail from "../pages/PostDetail/index.jsx"
import { useNotification } from "../components/AppProvider.jsx"
import { logger } from "../utils/logger.js"


//路由守卫组件
const Protect = ({ children }) => {
  logger.debug("路由组件")
  //检查token是否有效
  const notification = useNotification()
  const { isAuthenticated } = useSelector(state => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      notification.info({ message: "请先登录!", description: "登录后才能进行操作" })
    }
  }, [isAuthenticated])

  return children
}

//路由配置
const Element = () => {
  return useRoutes([
    {
      path: "/",
      element: <Home />
    }, {
      path: '/home',
      element: <Navigate to="/" />
    },
    {
      path: '/resources',
      element: <Resource />
    },
    {
      path: '/resources/:id',
      element: <ResourceDetail />
    },
    {
      path: '/courses',
      element: <Course />
    },
    {
      path: '/courses/:id',
      element: <CourseDetail />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/upload',
      element: <Protect><UploadResource /></Protect>
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/community',
      element: <Community />
    },
    {
      path: '/community/bounty',
      element: <CommunityDetail />
    },
    {
      path: '/community/posts',
      element: <CommunityDetail />
    },
    {
      path: '/community/posts/:id',
      element: <Protect><PostDetail /></Protect>
    },
    {
      path: '/community/create',
      element: <CreatePost />
    },
    {
      path: '/user/userinfo',
      element: <Protect> <UserCenter /></Protect>
    },
    {
      path: '/user/feedback',
      element: <FeedbackDisplay />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ])
}


export default Element