import React from "react";
import { ROLE } from "../utils/constant/role.js";
import { useRoutes, useNavigate, Navigate } from "react-router-dom";

// pages 组件全部改为懒加载
const SSOCallback = React.lazy(() => import("../pages/SSOCallback/index.jsx"));
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
        path: '/user/feedback',
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
    path: '/sso/callback',
    element: <SSOCallback />,
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
export default routesConfig;