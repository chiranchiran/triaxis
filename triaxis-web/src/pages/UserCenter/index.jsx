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
  TagsOutlined,
  UsergroupAddOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { MyButton } from '../../components/MyButton';
import { Statis } from '../../components/DetailCard';
import { useGetUserProfile } from '../../hooks/api/user';
import { Profile } from './Profile';
import './index.less'
import { MySettings } from './MySettings';
import UserDetail from './UserDetail';
import { MyPoints } from './MyPoints';
import { MyVip } from './MyVip';
import { MyMessages } from './MyMessages';
import { MyResources } from './MyResources';

const { Search } = Input;
const { Meta } = Card;
const { Option } = Select;

// 模拟用户数据
const userData = {
  id: 1,
  username: 'zhangming',
  realName: '张明',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  level: 5,
  title: '高级城乡规划师',
  bio: '专注于城市规划与设计，热爱分享专业知识，希望通过这个平台与更多同行交流学习。',
  school: '清华大学',
  major: '城乡规划',
  grade: '研究生三年级',
  createTime: '2022-03-15',
  followers: 245,
  following: 128,
  posts: 89,
  resources: 34,
  courses: 12,
  likes: 0,


  bindAccounts: {
    wechat: true,
    github: false,
    qq: true,
    weibo: false
  }
};



export const ItemLayout = ({ children, label, className }) => {
  return (
    <div className={`bg-card rounded-lg border border-secondary p-6 shadow-sm ${className}`}>
      <h2 className="text-xl font-semibold mb-6">{label}</h2>
      <div className="space-y-10">
        {children}
      </div>
    </div>
  )
}
export const SecondTitle = ({ children, label }) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">{label}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </>
  )
}
export const TabIcon = ({ children, icon }) => {
  return (
    <span className="flex items-center px-4 gap-4">
      {icon}
      {children}
    </span>
  )
}
export const SwitchOption = ({ title, description, checked = null, onChange = null, defaultChecked = null, checkedText = null, unCheckedText = null }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-light rounded-lg setting">
      <div>
        <div className="font-medium mb-1">{title}</div>
        <div className="text-sm text-secondary">{description}</div>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        defaultChecked={defaultChecked}
        checkedChildren={checkedText}
        unCheckedChildren={unCheckedText}
      />
    </div>
  )
}
export const ButtonOption = ({ title, description, onClick, text }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-light rounded-lg setting">
      <div>
        <div className="font-medium mb-1">{title}</div>
        <div className="text-sm text-secondary">{description}</div>
      </div>
      <MyButton
        type="black"
        onClick={onClick}
      >
        {text}
      </MyButton>
    </div>
  )
}
const UserCenter = () => {
  console.log('22222')
  const [createCollectionVisible, setCreateCollectionVisible] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState('collections');
  // 模拟数据
  const [courses, setCourses] = useState([]);
  const [collections, setCollections] = useState([]);






  // 课程子标签
  const courseTabItems = [
    { key: 'collections', label: '收藏夹', icon: <FolderOutlined />, color: '#7fb6f5' },
    { key: 'favorites', label: '收藏', icon: <StarOutlined />, color: '#f7d6a8' },
    { key: 'likes', label: '点赞', icon: <HeartOutlined />, color: '#f7a8a8' },
    { key: 'purchased', label: '已购买', icon: <CheckCircleOutlined />, color: '#a8f7c8' },
    { key: 'learning', label: '学习中', icon: <BookOutlined />, color: '#c8a8f7' }
  ];

  // 加载模拟数据
  useEffect(() => {
    // 模拟消息数据
    const mockMessages = [
      {
        id: 1,
        type: 'like',
        content: '李华点赞了您的帖子《城市规划设计要点》',
        time: '2小时前',
        read: false,
        sender: {
          name: '李华',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
        }
      },
      {
        id: 2,
        type: 'comment',
        content: '王伟评论了您的资源：这个资料很有用，谢谢分享！',
        time: '5小时前',
        read: true,
        sender: {
          name: '王伟',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
        }
      },
      {
        id: 3,
        type: 'follow',
        content: '新用户张丽关注了您',
        time: '1天前',
        read: false,
        sender: {
          name: '张丽',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
        }
      },
      {
        id: 4,
        type: 'system',
        content: '系统通知：您的会员即将到期，请及时续费',
        time: '2天前',
        read: true
      }
    ];

    // 模拟资源数据
    const mockResources = {
      collections: [
        {
          id: 1,
          name: '城市规划资料',
          count: 23,
          type: 'resource',
          createTime: '2024-01-01',
          isPublic: true
        },
        {
          id: 2,
          name: '设计规范',
          count: 15,
          type: 'resource',
          createTime: '2024-01-05',
          isPublic: false
        }
      ],
      favorites: [
        {
          id: 1,
          title: '城市规划设计规范2024',
          type: 'pdf',
          size: '2.3MB',
          author: '李教授',
          favoriteTime: '2024-01-15'
        }
      ],
      likes: [
        {
          id: 1,
          title: '建筑设计方案模板',
          type: 'zip',
          size: '15.7MB',
          author: '王设计师',
          likeTime: '2024-01-10'
        }
      ],
      uploads: [
        {
          id: 1,
          title: '我的设计作品集',
          type: 'zip',
          size: '45.2MB',
          uploadTime: '2024-01-18',
          downloads: 156,
          status: '审核通过'
        }
      ],
      purchased: [
        {
          id: 1,
          title: '高级城市规划素材包',
          type: 'zip',
          size: '120.5MB',
          price: '298积分',
          purchaseTime: '2024-01-12'
        }
      ]
    };

    // 模拟课程数据
    const mockCourses = {
      collections: [
        {
          id: 1,
          name: '专业提升课程',
          count: 8,
          type: 'course',
          createTime: '2024-01-01'
        }
      ],
      favorites: [
        {
          id: 1,
          title: '城市规划原理与实践',
          teacher: '王教授',
          duration: '12小时',
          favoriteTime: '2024-01-15'
        }
      ],
      likes: [
        {
          id: 1,
          title: '景观生态设计',
          teacher: '李老师',
          duration: '8小时',
          likeTime: '2024-01-10'
        }
      ],
      purchased: [
        {
          id: 1,
          title: 'BIM技术高级应用',
          teacher: '张工程师',
          price: '599积分',
          purchaseTime: '2024-01-08'
        }
      ],
      learning: [
        {
          id: 1,
          title: '城市规划原理与实践',
          progress: 75,
          lastStudy: '2024-01-18',
          duration: '12小时',
          teacher: '王教授',
          rating: 4.8
        },
        {
          id: 2,
          title: '景观生态设计',
          progress: 30,
          lastStudy: '2024-01-16',
          duration: '8小时',
          teacher: '李老师',
          rating: 4.6
        }
      ]
    };

    // 模拟私聊数据
    const mockChatList = [
      {
        id: 1,
        user: {
          name: '李华',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
          online: true
        },
        lastMessage: '关于那个设计方案，我有一些建议...',
        time: '10:30',
        unread: 2
      },
      {
        id: 2,
        user: {
          name: '王伟',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
          online: false
        },
        lastMessage: '谢谢分享的资料，很有帮助！',
        time: '昨天',
        unread: 0
      }
    ];

    // setMessages(mockMessages);
    // setResources(mockResources);
    // setCourses(mockCourses);
    // setCollections(mockResources.collections);
    // setChatList(mockChatList);
  }, []);






  // 创建收藏夹
  const handleCreateCollection = (values) => {
    const newCollection = {
      id: collections.length + 1,
      ...values,
      count: 0,
      createTime: new Date().toISOString().split('T')[0]
    };
    setCollections([...collections, newCollection]);
    setCreateCollectionVisible(false);
    message.success('收藏夹创建成功');
  };



  /**
   * @description 数据获取
   */
  const { data: user = {} } = useGetUserProfile();


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
    gender = 0,//0未知，1男2女
    school = "",
    major = "",
    grade = "",
    subject = "",
    vipLevel = 0,
    vipTime = "",
    createTime = "",
    points = 0,
    pointsGet = 0,
    pointsSpent = 0,
    resourceCount = 0,
    postCount = 0,
    courseCount = 0,
    likeCount = 0,
    purchaseCount = 0,
    status = 1,//0禁用
    role = 0,//0普通
  } = user
  // Tab项配置



  const MyCourses = ({ }) => {
    return (
      <div className="space-y-6">
        {/* 课程类型筛选 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {courseTabItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveCourseTab(item.key)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeCourseTab === item.key
                  ? 'text-white shadow-sm'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                style={{
                  backgroundColor: activeCourseTab === item.key ? item.color : undefined
                }}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 课程内容区 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {activeCourseTab === 'learning' && courses.learning && courses.learning.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.learning.map(course => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-white"
                >
                  <div className="flex items-start mb-4">
                    <BookOutlined className="text-2xl text-blue-400 mr-3 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">{course.title}</h4>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>讲师: {course.teacher}</span>
                        <span>时长: {course.duration}</span>
                      </div>
                      <Progress percent={course.progress} size="small" />
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-700">进度: {course.progress}%</span>
                        <span className="text-orange-500">评分: ⭐{course.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        最后学习: {course.lastStudy}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <Button type="link" className="text-blue-400 p-0">继续学习</Button>
                    <button className={`flex items-center text-sm ${course.isFavorite ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                      <StarOutlined className="mr-1" />
                      {course.isFavorite ? '已收藏' : '收藏'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {courseTabItems.find(t => t.key === activeCourseTab)?.label}的课程
              </h3>
              {courses[activeCourseTab] && courses[activeCourseTab].length > 0 ? (
                <div className="space-y-4">
                  {courses[activeCourseTab].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100">
                      <div className="flex items-center">
                        <BookOutlined className="text-2xl text-blue-400 mr-4" />
                        <div>
                          <h4 className="font-medium text-gray-800">{item.title || item.name}</h4>
                          <div className="text-sm text-gray-500 mt-1">
                            讲师: {item.teacher}
                          </div>
                          {item.duration && (
                            <div className="text-sm text-gray-500">
                              时长: {item.duration}
                            </div>
                          )}
                          {item.progress !== undefined && (
                            <Progress percent={item.progress} size="small" className="mt-2" />
                          )}
                          {item.purchaseTime && (
                            <div className="text-sm text-gray-500 mt-1">
                              购买时间: {item.purchaseTime}
                            </div>
                          )}
                          {item.favoriteTime && (
                            <div className="text-sm text-gray-500 mt-1">
                              收藏时间: {item.favoriteTime}
                            </div>
                          )}
                          {item.likeTime && (
                            <div className="text-sm text-gray-500 mt-1">
                              点赞时间: {item.likeTime}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button type="link" className="text-blue-400">查看详情</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description={`暂无${courseTabItems.find(t => t.key === activeCourseTab)?.label}的课程`} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };


  const tabItems = [
    {
      key: 'profile',
      label: <TabIcon icon={<UserOutlined />}>个人信息</TabIcon>,
      children: <Profile />
    },
    {
      key: 'settings',
      label: <TabIcon icon={<SettingOutlined />}>我的设置</TabIcon>,
      children: <MySettings />
    },
    {
      key: 'messages',
      label: (
        <Badge count={23} size="small" offset={[-3, 1]} overflowCount={999}>
          <TabIcon icon={<BellOutlined />}>我的消息</TabIcon>
        </Badge>
      ),
      children: <MyMessages />
    },
    {
      key: 'resources',
      label: <TabIcon icon={<FolderOutlined />}>我的资源</TabIcon>,
      children: <MyResources />
    },
    {
      key: 'courses',
      label: <TabIcon icon={<BookOutlined />}>我的课程</TabIcon>,
      children: <MyCourses />
    },
    {
      key: 'vip',
      label: <TabIcon icon={<CrownOutlined />}>我的会员</TabIcon>,
      children: <MyVip />
    },
    {
      key: 'points',
      label: <TabIcon icon={<StarOutlined />}>我的积分</TabIcon>,
      children: <MyPoints />
    },
  ];
  return (
    <section className="max-w-7xl mx-auto py-4 userCenter mb-4">
      {/* 用户信息卡片 */}
      <UserDetail />
      {/* 主要内容区域 */}
      <Tabs
        tabPosition="left"
        items={tabItems}
        tabBarGutter={4}
      />
      {/* 创建收藏夹弹窗 */}
      <Modal
        title="新建收藏夹"
        open={createCollectionVisible}
        onCancel={() => setCreateCollectionVisible(false)}
        footer={null}
        width={400}
      >
        <Form layout="vertical" onFinish={handleCreateCollection}>
          <Form.Item
            label="收藏夹名称"
            name="name"
            rules={[{ required: true, message: '请输入收藏夹名称' }]}
          >
            <Input placeholder="请输入收藏夹名称" />
          </Form.Item>
          <Form.Item label="收藏夹类型" name="type">
            <Select placeholder="请选择收藏夹类型">
              <Option value="resource">资源</Option>
              <Option value="course">课程</Option>
            </Select>
          </Form.Item>
          <Form.Item name="isPublic" valuePropName="checked">
            <Switch checkedChildren="公开" unCheckedChildren="私密" defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="bg-blue-400 hover:bg-blue-500 border-blue-400">
              创建收藏夹
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default UserCenter;