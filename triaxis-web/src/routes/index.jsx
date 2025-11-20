import { useRoutes, useNavigate, Navigate } from "react-router-dom";
import { Button, Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React, { Suspense, useEffect, useState } from "react";
import { ROLE } from "../utils/constant/role.js";
import { filterRoutes } from "./filterRoutes.jsx";
import { PermissionsProvider } from "./usePermissions.jsx";
import Loading from "../pages/Loading/index.jsx"

// pages 组件全部改为懒加载
const Main = React.lazy(() => import("../pages/Main/index.jsx"));
const Home = React.lazy(() => import("../pages/Home/index.jsx"));
const Resource = React.lazy(() => import("../pages/Resource/index.jsx"));
const Course = React.lazy(() => import("../pages/Course/index.jsx"));
const NotFound = React.lazy(() => import("../pages/NotFound/index.jsx"));
const About = React.lazy(() => import("../pages/About/index.jsx"));
const Login = React.lazy(() => import("../pages/Login/index.jsx"));
const Community = React.lazy(() => import("../pages/Community/index.jsx"));
const CommunityDetail = React.lazy(() => import("../pages/CommunityDetail/index.jsx"));
const Register = React.lazy(() => import("../pages/Register/index.jsx"));
const UserCenter = React.lazy(() => import("../pages/UserCenter/index.jsx"));
const FeedbackDisplay = React.lazy(() => import("../pages/Feedback/index.jsx"));
const ResourceDetail = React.lazy(() => import("../pages/ResourceDetail/index.jsx"));
const CourseDetail = React.lazy(() => import("../pages/CourseDetail/index.jsx"));
const UploadResource = React.lazy(() => import("../pages/UploadResource/index.jsx"));
const CreatePost = React.lazy(() => import("../pages/CreatPost/index.jsx"));
const PostDetail = React.lazy(() => import("../pages/PostDetail/index.jsx"));
const EditProfile = React.lazy(() => import("../pages/EditProfile/index.jsx"));
const Profile = React.lazy(() => import("../pages/UserCenter/Profile.jsx"));
const MySettings = React.lazy(() => import("../pages/UserCenter/MySettings.jsx"));
const MyResources = React.lazy(() => import("../pages/UserCenter/MyResources.jsx"));
const MyMessages = React.lazy(() => import("../pages/UserCenter/MyMessages.jsx"));
const MyVip = React.lazy(() => import("../pages/UserCenter/MyVip.jsx"));
const MyPoints = React.lazy(() => import("../pages/UserCenter/MyPoints.jsx"));
const Resume = React.lazy(() => import("../pages/Resume/index.jsx"));
const UnAuthorized = React.lazy(() => import("../pages/UnAuthorized/index.jsx"));
// //路由守卫组件
// const Protect = ({ children }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate()
//   const notification = useNotification()
//   logger.debug("路由组件")
//   //检查token是否有效
//   const { isAuthenticated } = useSelector(state => state.auth)

//   useEffect(() => {
//     if (!isAuthenticated) {
//       console.log("当前认证状态", isAuthenticated)
//       navigate('/login')
//       dispatch(logout());
//       notification.info({ message: "请先登录!", description: "登录后才能进行操作" })
//     }
//   }, [isAuthenticated])

//   return children
// }
const { GUEST, USER, ADMIN } = ROLE
const routesConfig = [
  {
    path: "/",
    element: <Main />,
    public: true,
    children: [
      {
        path: "/",
        element: <Home />,
        public: true
      }, {
        path: '/home',
        element: <Navigate to="/" />,
        public: true
      }, {
        path: '/resources',
        element: <Resource />,
        public: true
      },
      {
        path: '/resources/:id',
        element: <ResourceDetail />,
        public: true
      },
      {
        path: '/courses',
        element: <Course />,
        public: true
      },
      {
        path: '/courses/:id',
        element: <CourseDetail />,
        public: true
      },
      {
        path: '/about',
        element: <About />,
        public: true
      }, {
        path: '/upload',
        element: <UploadResource />,
        allowedRoles: [USER, ADMIN],
      }, {
        path: '/community',
        element: <Community />,
        public: true
      },
      {
        path: '/community/bounty',
        element: <CommunityDetail />,
        public: true
      },
      {
        path: '/community/normal',
        element: <CommunityDetail />,
        public: true
      },
      {
        path: '/community/posts',
        element: <CommunityDetail />,
        public: true
      },
      {
        path: '/community/posts/:id',
        element: <PostDetail />,
        public: true

      },
      {
        path: '/community/create',
        element: <CreatePost />,
        allowedRoles: [USER, ADMIN],

      },
      {
        path: '/user',
        element: <UserCenter />,
        allowedRoles: [USER, ADMIN],
        children: [{
          path: 'profile',
          element: <Profile />
        }, {
          path: 'settings',
          element: <MySettings />
        }, {
          path: 'messages',
          element: <MyMessages />
        },
        {
          path: 'resources',
          element: <MyResources />
        },
        // {
        //   path: 'courses',
        //   element: <MyCourses />
        // },
        {
          path: 'vip',
          element: <MyVip />
        },
        {
          path: 'points',
          element: <MyPoints />
        },

        ]
      },
      {
        path: '/user/edit',
        element: <EditProfile />,
        allowedRoles: [USER, ADMIN],
      },
      {
        path: '/feedback',
        element: <FeedbackDisplay />,
        allowedRoles: [USER, ADMIN],

      },
    ]
  },

  {
    path: '/resume',
    element: <Resume />,
    public: true
  },

  {
    path: '/login',
    element: <Login />,
    public: true
  },

  {
    path: '/register',
    element: <Register />,
    public: true
  },

  {
    path: '/403',
    element: <UnAuthorized />,
    public: true
  },
  {
    path: "*",
    element: <NotFound />,
    public: true
  }
]
//路由配置
const Element = () => {
  const [routes, setRoutes] = useState([]);
  const { role = null, permissions = [] } = useSelector(state => state.auth)
  useEffect(() => {
    // 根据当前角色生成路由表
    const newRoutes = filterRoutes(routesConfig, role);
    setRoutes(newRoutes);
  }, [role]);
  return useRoutes(routes);
}

const MyRoutes = () => {
  return (
    <PermissionsProvider>
      <Suspense fallback={<Loading />}>
        <Element />
      </Suspense>
    </PermissionsProvider>
  )
}
export default MyRoutes