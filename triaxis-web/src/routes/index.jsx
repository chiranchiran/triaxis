import { useRoutes, useNavigate, Navigate } from "react-router-dom"
import { Button, Result } from "antd"
import Home from "../pages/Home/index.jsx"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useNotification } from "../hooks/common/useMessage.jsx"
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

//路由守卫组件
function Protect({ children }) {
  //检查token是否有效
  const notification = useNotification()
  const { isAuthenticated } = useSelector(state => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      notification.info({ message: "请先登录!" })
    }

  }, [isAuthenticated])

  return children
}

//路由配置
function Element() {
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
      element: <UploadResource />
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
      element: <PostDetail />
    },
    {
      path: '/community/create',
      element: <CreatePost />
    },
    {
      path: '/user/userinfo',
      element: <UserCenter />
    },
    {
      path: '/user/feedback',
      element: <FeedbackDisplay />
    },
    // {
    //   element: <Protect><Main /></Protect>,
    //   children: [{
    //     path: "/login",
    //     element: <Login />
    //   }, {
    //     path: "/register",
    //     element: <Login />
    //   },
    //   {
    //     path: '/coureses',
    //     element: < />
    //   }, , {
    //     path: '/coureses/:id',
    //     element: < />
    //   }, {
    //     path: '/resources',
    //     element: < />
    //   }, {
    //     path: '/resources/:id',
    //     element: < />
    //   }, {
    //     path: '/community',
    //     element: < />
    //   }, {
    //     path: '/community/posts/:id',
    //     element: < />
    //   }, {
    //     path: '/about',
    //     element: < />
    //   }, {
    //     path: '/user',
    //     element: < />
    //   }, {
    //     path: '/message',
    //     element: < />
    //   }, {
    //     path: '/upload',
    //     element: < />
    //   }, {
    //     path: '/introduce/vip',
    //     element: < />
    //   }, {
    //     path: '/introduce/feedback',
    //     element: < />
    //   }, {
    //     path: '/introduce/privacypolicy',
    //     element: < />
    //   }, {
    //     path: '/introduce/userpolicy',
    //     element: < />
    //   },
    {
      path: "*",
      element: <NotFound />
    }
  ])
}


export default Element