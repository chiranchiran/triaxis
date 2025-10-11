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
  Select
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
  SafetyCertificateOutlined
} from '@ant-design/icons';

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
  joinDate: '2022-03-15',
  followers: 245,
  following: 128,
  posts: 89,
  resources: 34,
  courses: 12,
  bindAccounts: {
    wechat: true,
    github: false,
    qq: true,
    weibo: false
  }
};

// 消息类型
const MESSAGE_TYPES = [
  { key: 'chat', name: '聊天', icon: <MessageOutlined />, color: '#7fb6f5', count: 5 },
  { key: 'like', name: '点赞', icon: <HeartOutlined />, color: '#f7a8a8', count: 12 },
  { key: 'collect', name: '收藏', icon: <StarOutlined />, color: '#f7d6a8', count: 8 },
  { key: 'follow', name: '关注', icon: <UserOutlined />, color: '#a8d8f7', count: 3 },
  { key: 'comment', name: '评论', icon: <BellOutlined />, color: '#c8a8f7', count: 7 },
  { key: 'system', name: '系统', icon: <SafetyCertificateOutlined />, color: '#b8b8b8', count: 2 }
];

const UserCenter = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [activeMessageType, setActiveMessageType] = useState('chat');
  const [theme, setTheme] = useState('light');
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [createCollectionVisible, setCreateCollectionVisible] = useState(false);
  const [activeResourceTab, setActiveResourceTab] = useState('collections');
  const [activeCourseTab, setActiveCourseTab] = useState('collections');
  const [user, setUser] = useState(userData);

  // 模拟数据
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [collections, setCollections] = useState([]);
  const [chatList, setChatList] = useState([]);

  // Tab项配置
  const tabItems = [
    {
      key: 'profile',
      label: (
        <span className="flex items-center">
          <UserOutlined className="mr-2" />
          个人信息
        </span>
      ),
      children: null,
    },
    {
      key: 'settings',
      label: (
        <span className="flex items-center">
          <SettingOutlined className="mr-2" />
          我的设置
        </span>
      ),
      children: null,
    },
    {
      key: 'messages',
      label: (
        <Badge count={23} size="small">
          <span className="flex items-center">
            <BellOutlined className="mr-2" />
            我的消息
          </span>
        </Badge>
      ),
      children: null,
    },
    {
      key: 'resources',
      label: (
        <span className="flex items-center">
          <FolderOutlined className="mr-2" />
          我的资源
        </span>
      ),
      children: null,
    },
    {
      key: 'courses',
      label: (
        <span className="flex items-center">
          <BookOutlined className="mr-2" />
          我的课程
        </span>
      ),
      children: null,
    },
    {
      key: 'vip',
      label: (
        <span className="flex items-center">
          <CrownOutlined className="mr-2" />
          我的会员
        </span>
      ),
      children: null,
    },
    {
      key: 'points',
      label: (
        <span className="flex items-center">
          <StarOutlined className="mr-2" />
          我的积分
        </span>
      ),
      children: null,
    },
  ];

  // 资源子标签
  const resourceTabItems = [
    { key: 'collections', label: '收藏夹', icon: <FolderOutlined />, color: '#7fb6f5' },
    { key: 'favorites', label: '收藏', icon: <StarOutlined />, color: '#f7d6a8' },
    { key: 'likes', label: '点赞', icon: <HeartOutlined />, color: '#f7a8a8' },
    { key: 'uploads', label: '上传', icon: <DownloadOutlined />, color: '#a8d8f7' },
    { key: 'purchased', label: '已购买', icon: <CheckCircleOutlined />, color: '#a8f7c8' }
  ];

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

    setMessages(mockMessages);
    setResources(mockResources);
    setCourses(mockCourses);
    setCollections(mockResources.collections);
    setChatList(mockChatList);
  }, []);

  // 主题切换
  const handleThemeChange = (checked) => {
    setTheme(checked ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : 'light');
  };

  // 编辑个人信息
  const handleEditProfile = (values) => {
    setUser({ ...user, ...values });
    setEditProfileVisible(false);
    message.success('个人信息更新成功');
  };

  // 修改密码
  const handleChangePassword = (values) => {
    console.log('修改密码:', values);
    setChangePasswordVisible(false);
    message.success('密码修改成功');
  };

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

  // 过滤消息
  const filteredMessages = activeMessageType === 'chat'
    ? chatList
    : messages.filter(msg => msg.type === activeMessageType);

  return (
    <div className="min-h-screen bg-gray-50" data-theme={theme}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <div className="mb-8 bg-blue-50 rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* 头像区域 */}
            <div className="text-center">
              <Badge count={user.level} offset={[-10, 80]} color="#7fb6f5">
                <Avatar
                  size={100}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-md"
                />
              </Badge>
              <div className="mt-4">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditProfileVisible(true)}
                  className="bg-blue-400 hover:bg-blue-500 border-blue-400"
                >
                  编辑资料
                </Button>
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{user.realName}</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {user.title}
                </span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">{user.bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-800">{user.posts}</div>
                  <div className="text-sm text-gray-500">帖子</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-800">{user.followers}</div>
                  <div className="text-sm text-gray-500">粉丝</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-800">{user.following}</div>
                  <div className="text-sm text-gray-500">关注</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-800">{user.resources}</div>
                  <div className="text-sm text-gray-500">资源</div>
                </div>
              </div>

              <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                <ClockCircleOutlined className="mr-2" />
                加入时间：{user.joinDate}
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm sticky top-4">
              <div className="space-y-1">
                {tabItems.map(item => (
                  <div
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${activeTab === item.key
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3">
            {/* 个人信息 */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">个人信息</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">基本信息</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <span className="text-gray-600">用户名：</span>
                          <span className="font-medium text-gray-800">{user.username}</span>
                        </div>
                        <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <span className="text-gray-600">真实姓名：</span>
                          <span className="font-medium text-gray-800">{user.realName}</span>
                        </div>
                        <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <span className="text-gray-600">用户等级：</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Lv.{user.level}</span>
                        </div>
                        <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <span className="text-gray-600">学校：</span>
                          <span className="text-gray-800">{user.school}</span>
                        </div>
                        <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <span className="text-gray-600">专业：</span>
                          <span className="text-gray-800">{user.major}</span>
                        </div>
                        <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <span className="text-gray-600">年级：</span>
                          <span className="text-gray-800">{user.grade}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">个人简介</h3>
                      <p className="text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg">{user.bio}</p>

                      <h3 className="text-lg font-medium text-gray-800 mb-4 mt-6">账户绑定</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <div className="flex items-center">
                            <WechatOutlined className="text-green-500 text-xl mr-3" />
                            <span className="text-gray-700">微信</span>
                          </div>
                          {user.bindAccounts.wechat ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">已绑定</span>
                          ) : (
                            <Button size="small" type="link" className="text-blue-400">绑定</Button>
                          )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <div className="flex items-center">
                            <GithubOutlined className="text-gray-700 text-xl mr-3" />
                            <span className="text-gray-700">GitHub</span>
                          </div>
                          {user.bindAccounts.github ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">已绑定</span>
                          ) : (
                            <Button size="small" type="link" className="text-blue-400">绑定</Button>
                          )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <div className="flex items-center">
                            <QqOutlined className="text-blue-400 text-xl mr-3" />
                            <span className="text-gray-700">QQ</span>
                          </div>
                          {user.bindAccounts.qq ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">已绑定</span>
                          ) : (
                            <Button size="small" type="link" className="text-blue-400">绑定</Button>
                          )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <div className="flex items-center">
                            <WeiboOutlined className="text-red-400 text-xl mr-3" />
                            <span className="text-gray-700">微博</span>
                          </div>
                          {user.bindAccounts.weibo ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">已绑定</span>
                          ) : (
                            <Button size="small" type="link" className="text-blue-400">绑定</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">数据统计</h3>
                    <Row gutter={16}>
                      <Col span={6}>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Statistic title="发布帖子" value={user.posts} valueStyle={{ color: '#7fb6f5' }} />
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Statistic title="上传资源" value={user.resources} valueStyle={{ color: '#8bc78b' }} />
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <Statistic title="粉丝数量" value={user.followers} valueStyle={{ color: '#b296f7' }} />
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <Statistic title="关注用户" value={user.following} valueStyle={{ color: '#f7b896' }} />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            )}

            {/* 我的设置 */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">我的设置</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">主题设置</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div>
                        <div className="font-medium text-gray-800">深色模式</div>
                        <div className="text-sm text-gray-600">切换明暗主题</div>
                      </div>
                      <Switch
                        checked={theme === 'dark'}
                        onChange={handleThemeChange}
                        checkedChildren="深色"
                        unCheckedChildren="浅色"
                      />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">安全设置</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <div className="font-medium text-gray-800">登录密码</div>
                          <div className="text-sm text-gray-600">定期更改密码有助于保护账户安全</div>
                        </div>
                        <Button
                          type="primary"
                          onClick={() => setChangePasswordVisible(true)}
                          className="bg-blue-400 hover:bg-blue-500 border-blue-400"
                        >
                          修改密码
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">隐私设置</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <div className="font-medium text-gray-800">公开个人信息</div>
                          <div className="text-sm text-gray-600">允许他人查看您的个人资料</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <div className="font-medium text-gray-800">消息通知</div>
                          <div className="text-sm text-gray-600">接收系统消息和更新通知</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <div className="font-medium text-gray-800">邮件订阅</div>
                          <div className="text-sm text-gray-600">接收产品更新和促销信息</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 我的消息 */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                {/* 消息类型筛选 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {MESSAGE_TYPES.map(type => (
                      <div
                        key={type.key}
                        onClick={() => setActiveMessageType(type.key)}
                        className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${activeMessageType === type.key
                          ? 'bg-white border-2 scale-105 shadow-sm'
                          : 'bg-gray-50 hover:bg-white hover:shadow-sm'
                          }`}
                        style={{
                          borderColor: activeMessageType === type.key ? type.color : 'transparent',
                          minWidth: '100px'
                        }}
                      >
                        <div
                          className="text-2xl mb-2"
                          style={{ color: type.color }}
                        >
                          {type.icon}
                        </div>
                        <div className="text-sm font-medium text-gray-700">{type.name}</div>
                        <div
                          className="text-xs mt-1 px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: type.color }}
                        >
                          {type.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {MESSAGE_TYPES.find(t => t.key === activeMessageType)?.name}
                    </h3>
                    <div
                      className="ml-2 text-xs px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: MESSAGE_TYPES.find(t => t.key === activeMessageType)?.color }}
                    >
                      {MESSAGE_TYPES.find(t => t.key === activeMessageType)?.count}
                    </div>
                  </div>

                  {activeMessageType === 'chat' ? (
                    chatList.length > 0 ? (
                      <div className="space-y-4">
                        {chatList.map(item => (
                          <div key={item.id} className="flex items-center p-4 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                            <div className="relative mr-4">
                              <Avatar src={item.user.avatar} size={50} />
                              {item.user.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">{item.user.name}</span>
                                {item.unread > 0 && (
                                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {item.unread}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 truncate">{item.lastMessage}</p>
                              <div className="text-sm text-gray-500 mt-1">{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty description="暂无聊天记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )
                  ) : filteredMessages.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMessages.map(item => (
                        <div key={item.id} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                          <Avatar
                            src={item.sender?.avatar}
                            icon={!item.sender ? <SafetyCertificateOutlined /> : null}
                            size={50}
                            className="mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={!item.read ? 'font-semibold text-gray-800' : 'text-gray-700'}>
                                {item.sender ? item.sender.name : '系统通知'}
                              </span>
                              <span
                                className="px-2 py-1 text-xs rounded-full text-white"
                                style={{ backgroundColor: MESSAGE_TYPES.find(t => t.key === item.type)?.color }}
                              >
                                {MESSAGE_TYPES.find(t => t.key === item.type)?.name}
                              </span>
                            </div>
                            <p className={!item.read ? 'font-medium text-gray-800 mt-2' : 'text-gray-600 mt-2'}>
                              {item.content}
                            </p>
                            <div className="text-sm text-gray-500 mt-2">{item.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description={`暂无${MESSAGE_TYPES.find(t => t.key === activeMessageType)?.name}`} />
                  )}
                </div>
              </div>
            )}

            {/* 我的资源 */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex space-x-2">
                    {resourceTabItems.map(item => (
                      <button
                        key={item.key}
                        onClick={() => setActiveResourceTab(item.key)}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeResourceTab === item.key
                          ? 'text-white shadow-sm'
                          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          }`}
                        style={{
                          backgroundColor: activeResourceTab === item.key ? item.color : undefined
                        }}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  {activeResourceTab === 'collections' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">我的收藏夹</h3>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => setCreateCollectionVisible(true)}
                          className="bg-blue-400 hover:bg-blue-500 border-blue-400"
                        >
                          新建收藏夹
                        </Button>
                      </div>
                      {resources.collections && resources.collections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {resources.collections.map(collection => (
                            <div
                              key={collection.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
                            >
                              <div className="flex items-center mb-3">
                                <FolderOutlined className="text-2xl text-blue-400 mr-3" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{collection.name}</h4>
                                  <p className="text-sm text-gray-500">包含 {collection.count} 个项目</p>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>{collection.isPublic ? '公开' : '私密'}</span>
                                <span>{collection.createTime}</span>
                              </div>
                              <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                                <button className="text-blue-400 hover:text-blue-500 text-sm">查看</button>
                                <button className="text-gray-500 hover:text-gray-700 text-sm">编辑</button>
                                <button className="text-orange-400 hover:text-orange-500 text-sm flex items-center">
                                  <StarOutlined className="mr-1" />
                                  {collection.count}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty description="暂无收藏夹" />
                      )}
                    </div>
                  )}

                  {activeResourceTab === 'favorites' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">收藏的资源</h3>
                      {resources.favorites && resources.favorites.length > 0 ? (
                        <div className="space-y-4">
                          {resources.favorites.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-orange-50 rounded-lg transition-colors border border-gray-100">
                              <div className="flex items-center">
                                <FolderOutlined className="text-2xl text-orange-400 mr-4" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                                  <div className="text-sm text-gray-500 mt-1">
                                    <span>类型: {item.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>大小: {item.size}</span>
                                    <span className="mx-2">•</span>
                                    <span>作者: {item.author}</span>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    收藏时间: {item.favoriteTime}
                                  </div>
                                </div>
                              </div>
                              <Button type="link" className="text-blue-400">下载</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty description="暂无收藏资源" />
                      )}
                    </div>
                  )}

                  {activeResourceTab === 'likes' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">点赞的资源</h3>
                      {resources.likes && resources.likes.length > 0 ? (
                        <div className="space-y-4">
                          {resources.likes.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-pink-50 rounded-lg transition-colors border border-gray-100">
                              <div className="flex items-center">
                                <HeartOutlined className="text-2xl text-pink-400 mr-4" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                                  <div className="text-sm text-gray-500 mt-1">
                                    <span>类型: {item.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>大小: {item.size}</span>
                                    <span className="mx-2">•</span>
                                    <span>作者: {item.author}</span>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    点赞时间: {item.likeTime}
                                  </div>
                                </div>
                              </div>
                              <Button type="link" className="text-blue-400">下载</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty description="暂无点赞资源" />
                      )}
                    </div>
                  )}

                  {activeResourceTab === 'uploads' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">上传的资源</h3>
                      {resources.uploads && resources.uploads.length > 0 ? (
                        <div className="space-y-4">
                          {resources.uploads.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-green-50 rounded-lg transition-colors border border-gray-100">
                              <div className="flex items-center">
                                <DownloadOutlined className="text-2xl text-green-400 mr-4" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                                  <div className="text-sm text-gray-500 mt-1">
                                    <span>类型: {item.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>大小: {item.size}</span>
                                    <span className="mx-2">•</span>
                                    <span>下载: {item.downloads}</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.status === '审核通过'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-orange-100 text-orange-700'
                                      }`}>
                                      {item.status}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      上传时间: {item.uploadTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-x-2">
                                <Button size="small">编辑</Button>
                                <Button size="small" type="text" danger>删除</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty description="暂无上传资源" />
                      )}
                    </div>
                  )}

                  {activeResourceTab === 'purchased' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">已购买的资源</h3>
                      {resources.purchased && resources.purchased.length > 0 ? (
                        <div className="space-y-4">
                          {resources.purchased.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-purple-50 rounded-lg transition-colors border border-gray-100">
                              <div className="flex items-center">
                                <CheckCircleOutlined className="text-2xl text-purple-400 mr-4" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                                  <div className="text-sm text-gray-500 mt-1">
                                    <span>类型: {item.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>大小: {item.size}</span>
                                    <span className="mx-2">•</span>
                                    <span>价格: {item.price}</span>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    购买时间: {item.purchaseTime}
                                  </div>
                                </div>
                              </div>
                              <Button type="link" className="text-blue-400">下载</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty description="暂无购买资源" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 我的课程 */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex space-x-2">
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
            )}

            {/* 我的会员 */}
            {activeTab === 'vip' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">会员中心</h2>
                <div className="space-y-6">
                  {/* 会员状态 */}
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">普通会员</h3>
                        <p className="text-gray-600 mt-2">剩余 15 天，享受基础权益</p>
                        <div className="mt-4">
                          <Progress percent={60} strokeColor="#f7b896" />
                          <div className="text-sm text-gray-500 mt-2">会员有效期至 2024-02-15</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-500">¥298/年</div>
                        <Button type="primary" size="large" className="mt-2 bg-orange-400 hover:bg-orange-500 border-orange-400">
                          立即续费
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 会员权益 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">会员权益</h3>
                    <Row gutter={16}>
                      <Col span={8}>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <CrownOutlined className="text-2xl text-blue-400 mb-2" />
                          <div className="font-medium text-gray-800">专属课程</div>
                          <div className="text-sm text-gray-600">会员专享精品课程</div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <DownloadOutlined className="text-2xl text-green-400 mb-2" />
                          <div className="font-medium text-gray-800">资源下载</div>
                          <div className="text-sm text-gray-600">无限量资源下载</div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <UserOutlined className="text-2xl text-purple-400 mb-2" />
                          <div className="font-medium text-gray-800">专家咨询</div>
                          <div className="text-sm text-gray-600">专业问题一对一解答</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            )}

            {/* 我的积分 */}
            {activeTab === 'points' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">积分中心</h2>
                <div className="space-y-6">
                  {/* 积分概览 */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">1,258 积分</div>
                        <p className="text-gray-600 mt-2">可用积分，可兑换精美礼品</p>
                      </div>
                      <Button type="primary" size="large" className="bg-green-400 hover:bg-green-500 border-green-400">
                        积分兑换
                      </Button>
                    </div>
                  </div>

                  {/* 积分进度 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">等级进度</h3>
                    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">当前等级: Lv.{user.level}</span>
                        <span className="text-gray-700">下一等级: Lv.{user.level + 1}</span>
                      </div>
                      <Progress
                        percent={65}
                        strokeColor={{
                          '0%': '#7fb6f5',
                          '100%': '#8bc78b',
                        }}
                      />
                      <div className="text-sm text-gray-600">
                        还需 350 积分升级到 Lv.{user.level + 1}
                      </div>
                    </div>
                  </div>

                  {/* 积分记录 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">积分记录</h3>
                    <div className="space-y-4">
                      {[
                        { action: '每日签到', points: '+10', time: '2024-01-20', type: 'earn' },
                        { action: '发布资源', points: '+50', time: '2024-01-19', type: 'earn' },
                        { action: '课程学习', points: '+30', time: '2024-01-18', type: 'earn' },
                        { action: '兑换礼品', points: '-100', time: '2024-01-15', type: 'spend' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${item.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {item.type === 'earn' ? '+' : '-'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-gray-800">{item.action}</span>
                              <span className={item.type === 'earn' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {item.points}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{item.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 编辑个人信息弹窗 */}
      <Modal
        title="编辑个人信息"
        open={editProfileVisible}
        onCancel={() => setEditProfileVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          layout="vertical"
          initialValues={user}
          onFinish={handleEditProfile}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="用户名" name="username">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="真实姓名" name="realName">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="个人简介" name="bio">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="学校" name="school">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="专业" name="major">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="年级" name="grade">
                <Select>
                  <Option value="本科一年级">本科一年级</Option>
                  <Option value="本科二年级">本科二年级</Option>
                  <Option value="本科三年级">本科三年级</Option>
                  <Option value="本科四年级">本科四年级</Option>
                  <Option value="研究生一年级">研究生一年级</Option>
                  <Option value="研究生二年级">研究生二年级</Option>
                  <Option value="研究生三年级">研究生三年级</Option>
                  <Option value="博士生">博士生</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="头像">
            <Upload listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="bg-blue-400 hover:bg-blue-500 border-blue-400">
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="bg-blue-400 hover:bg-blue-500 border-blue-400">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>

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
    </div>
  );
};

export default UserCenter;