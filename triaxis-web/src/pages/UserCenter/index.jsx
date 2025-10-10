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
  Dropdown,
  Input,
  Modal,
  Form,
  Upload,
  message,
  Timeline,
  Empty
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
  FilterOutlined,
  MailOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Meta } = Card;

// 模拟用户数据
const userData = {
  id: 1,
  name: '张明',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  level: 5,
  title: '高级城乡规划师',
  bio: '专注于城市规划与设计，热爱分享专业知识',
  joinDate: '2022-03-15',
  followers: 245,
  following: 128,
  posts: 89,
  resources: 34,
  courses: 12
};

// 消息类型
const MESSAGE_TYPES = [
  { key: 'all', name: '全部消息', icon: <BellOutlined />, color: 'blue' },
  { key: 'like', name: '点赞', icon: <HeartOutlined />, color: 'red' },
  { key: 'collect', name: '收藏', icon: <StarOutlined />, color: 'orange' },
  { key: 'follow', name: '关注', icon: <TeamOutlined />, color: 'green' },
  { key: 'comment', name: '评论', icon: <MessageOutlined />, color: 'purple' },
  { key: 'system', name: '系统', icon: <SafetyCertificateOutlined />, color: 'gray' }
];

const UserCenter = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [messageType, setMessageType] = useState('all');
  const [theme, setTheme] = useState('light');
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [createCollectionVisible, setCreateCollectionVisible] = useState(false);
  const [user, setUser] = useState(userData);

  // 模拟数据
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [collections, setCollections] = useState([]);
  const [chatList, setChatList] = useState([]);

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

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
        <Badge count={messages.filter(msg => !msg.read).length} size="small">
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
    const mockResources = [
      {
        id: 1,
        title: '城市规划设计规范2024',
        type: 'pdf',
        size: '2.3MB',
        downloads: 156,
        likes: 89,
        collects: 45,
        createTime: '2024-01-15',
        isPublic: true
      },
      {
        id: 2,
        title: '建筑设计方案模板',
        type: 'zip',
        size: '15.7MB',
        downloads: 234,
        likes: 167,
        collects: 98,
        createTime: '2024-01-10',
        isPublic: false
      }
    ];

    // 模拟课程数据
    const mockCourses = [
      {
        id: 1,
        title: '城市规划原理与实践',
        progress: 75,
        lastStudy: '2024-01-18',
        duration: '12小时',
        teacher: '王教授',
        rating: 4.8,
        isFavorite: true
      },
      {
        id: 2,
        title: '景观生态设计',
        progress: 30,
        lastStudy: '2024-01-16',
        duration: '8小时',
        teacher: '李老师',
        rating: 4.6,
        isFavorite: false
      }
    ];

    // 模拟收藏夹数据
    const mockCollections = [
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
        name: '精品课程',
        count: 12,
        type: 'course',
        createTime: '2024-01-05',
        isPublic: false
      }
    ];

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
    setCollections(mockCollections);
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
  const filteredMessages = messageType === 'all'
    ? messages
    : messages.filter(msg => msg.type === messageType);

  // 未读消息数量
  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="min-h-screen bg-gray-50" data-theme={theme}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <Card className="mb-8 shadow-sm border-0 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* 头像区域 */}
            <div className="text-center">
              <Badge count={user.level} offset={[-10, 80]} color="blue">
                <Avatar
                  size={100}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg"
                />
              </Badge>
              <div className="mt-4">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditProfileVisible(true)}
                >
                  编辑资料
                </Button>
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <Tag color="blue" className="text-sm">{user.title}</Tag>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">{user.bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.posts}</div>
                  <div className="text-sm text-gray-500">帖子</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.followers}</div>
                  <div className="text-sm text-gray-500">粉丝</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.following}</div>
                  <div className="text-sm text-gray-500">关注</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.resources}</div>
                  <div className="text-sm text-gray-500">资源</div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <ClockCircleOutlined className="mr-2" />
                加入时间：{user.joinDate}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="flex flex-col space-y-3">
              <Button icon={<SettingOutlined />}>账户设置</Button>
              <Button icon={<CrownOutlined />} type="primary">
                会员中心
              </Button>
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button icon={<UserOutlined />}>更多操作</Button>
              </Dropdown>
            </div>
          </div>
        </Card>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-0 sticky top-4">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                tabPosition="left"
                className="vertical-tabs"
                items={tabItems.map(item => ({
                  ...item,
                  children: null // 清空children，内容在下面单独渲染
                }))}
              />
            </Card>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3">
            {/* 个人信息 */}
            {activeTab === 'profile' && (
              <Card title="个人信息" className="shadow-sm border-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">基本信息</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">用户名：</span>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">用户等级：</span>
                          <Tag color="blue">Lv.{user.level}</Tag>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">职业头衔：</span>
                          <span>{user.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">注册时间：</span>
                          <span>{user.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">个人简介</h3>
                      <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">数据统计</h3>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic title="发布帖子" value={user.posts} />
                      </Col>
                      <Col span={6}>
                        <Statistic title="上传资源" value={user.resources} />
                      </Col>
                      <Col span={6}>
                        <Statistic title="粉丝数量" value={user.followers} />
                      </Col>
                      <Col span={6}>
                        <Statistic title="关注用户" value={user.following} />
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            )}

            {/* 我的设置 */}
            {activeTab === 'settings' && (
              <Card title="我的设置" className="shadow-sm border-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">主题设置</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">深色模式</div>
                        <div className="text-sm text-gray-500">切换明暗主题</div>
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
                    <h3 className="text-lg font-semibold mb-4">语言设置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow border-2 border-blue-200 bg-blue-50"
                        onClick={() => message.info('已切换为简体中文')}
                      >
                        <div className="text-center">
                          <div className="font-semibold">简体中文</div>
                          <div className="text-sm text-gray-500">Chinese Simplified</div>
                        </div>
                      </Card>
                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => message.info('已切换为English')}
                      >
                        <div className="text-center">
                          <div className="font-semibold">English</div>
                          <div className="text-sm text-gray-500">英语</div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">隐私设置</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">公开个人信息</div>
                          <div className="text-sm text-gray-500">允许他人查看您的个人资料</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">消息通知</div>
                          <div className="text-sm text-gray-500">接收系统消息和更新通知</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">邮件订阅</div>
                          <div className="text-sm text-gray-500">接收产品更新和促销信息</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 我的消息 */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                {/* 消息类型筛选 */}
                <Card className="shadow-sm border-0">
                  <div className="flex flex-wrap gap-2">
                    {MESSAGE_TYPES.map(type => (
                      <Button
                        key={type.key}
                        type={messageType === type.key ? 'primary' : 'default'}
                        icon={type.icon}
                        onClick={() => setMessageType(type.key)}
                        className={`flex items-center ${messageType === type.key ? `bg-${type.color}-500 border-${type.color}-500` : ''
                          }`}
                      >
                        {type.name}
                      </Button>
                    ))}
                  </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 消息列表 */}
                  <div className="lg:col-span-2">
                    <Card title="消息通知" className="shadow-sm border-0">
                      {filteredMessages.length > 0 ? (
                        <List
                          dataSource={filteredMessages}
                          renderItem={item => (
                            <List.Item className="hover:bg-gray-50 p-4 rounded-lg transition-colors">
                              <List.Item.Meta
                                avatar={
                                  item.sender ? (
                                    <Avatar src={item.sender.avatar} />
                                  ) : (
                                    <Avatar icon={<SafetyCertificateOutlined />} />
                                  )
                                }
                                title={
                                  <div className="flex items-center justify-between">
                                    <span className={!item.read ? 'font-semibold' : ''}>
                                      {item.sender ? item.sender.name : '系统通知'}
                                    </span>
                                    <Tag color={MESSAGE_TYPES.find(t => t.key === item.type)?.color}>
                                      {MESSAGE_TYPES.find(t => t.key === item.type)?.name}
                                    </Tag>
                                  </div>
                                }
                                description={
                                  <div>
                                    <p className={!item.read ? 'font-medium' : ''}>{item.content}</p>
                                    <div className="text-sm text-gray-500 mt-1">{item.time}</div>
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty description="暂无消息" />
                      )}
                    </Card>
                  </div>

                  {/* 私聊列表 */}
                  <div>
                    <Card
                      title={
                        <div className="flex items-center justify-between">
                          <span>私信聊天</span>
                          <Button type="link" icon={<PlusOutlined />} size="small">
                            新对话
                          </Button>
                        </div>
                      }
                      className="shadow-sm border-0"
                    >
                      {chatList.length > 0 ? (
                        <List
                          dataSource={chatList}
                          renderItem={item => (
                            <List.Item className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                              <List.Item.Meta
                                avatar={
                                  <Badge dot={item.user.online} color="green" offset={[-5, 5]}>
                                    <Avatar src={item.user.avatar} />
                                  </Badge>
                                }
                                title={
                                  <div className="flex justify-between items-center">
                                    <span>{item.user.name}</span>
                                    {item.unread > 0 && (
                                      <Badge count={item.unread} size="small" />
                                    )}
                                  </div>
                                }
                                description={
                                  <div>
                                    <p className="text-sm truncate">{item.lastMessage}</p>
                                    <div className="text-xs text-gray-500">{item.time}</div>
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty description="暂无聊天" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* 我的资源 */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <Card className="shadow-sm border-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex space-x-2">
                      <Button type="primary" icon={<PlusOutlined />}>
                        上传资源
                      </Button>
                      <Button icon={<PlusOutlined />} onClick={() => setCreateCollectionVisible(true)}>
                        新建收藏夹
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Search placeholder="搜索资源" style={{ width: 200 }} />
                      <Button icon={<FilterOutlined />}>筛选</Button>
                    </div>
                  </div>
                </Card>

                {/* 收藏夹 */}
                <Card title="我的收藏夹" className="shadow-sm border-0">
                  {collections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {collections.map(collection => (
                        <Card
                          key={collection.id}
                          className="hover:shadow-md transition-shadow cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-green-50"
                          actions={[
                            <Button type="link" icon={<EyeOutlined />}>查看</Button>,
                            <Button type="link" icon={<EditOutlined />}>编辑</Button>,
                            <Button type="link" danger icon={<StarOutlined />}>
                              {collection.count}
                            </Button>
                          ]}
                        >
                          <Meta
                            avatar={<FolderOutlined className="text-2xl text-blue-500" />}
                            title={collection.name}
                            description={
                              <div>
                                <div>包含 {collection.count} 个项目</div>
                                <div className="text-sm text-gray-500">
                                  {collection.isPublic ? '公开' : '私密'} • {collection.createTime}
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Empty description="暂无收藏夹" />
                  )}
                </Card>

                {/* 资源列表 */}
                <Card title="资源管理" className="shadow-sm border-0">
                  {resources.length > 0 ? (
                    <List
                      dataSource={resources}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <Button icon={<DownloadOutlined />}>下载</Button>,
                            <Button icon={<EditOutlined />}>编辑</Button>,
                            <Button type="link" danger>删除</Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<FolderOutlined className="text-2xl text-orange-500" />}
                            title={
                              <div className="flex items-center space-x-2">
                                <span>{item.title}</span>
                                <Tag color={item.isPublic ? 'green' : 'orange'}>
                                  {item.isPublic ? '公开' : '私密'}
                                </Tag>
                              </div>
                            }
                            description={
                              <div className="space-y-1">
                                <div className="flex space-x-4 text-sm text-gray-500">
                                  <span>类型: {item.type}</span>
                                  <span>大小: {item.size}</span>
                                  <span>下载: {item.downloads}</span>
                                </div>
                                <div className="flex space-x-4 text-sm">
                                  <span className="flex items-center">
                                    <HeartOutlined className="mr-1" />
                                    {item.likes}
                                  </span>
                                  <span className="flex items-center">
                                    <StarOutlined className="mr-1" />
                                    {item.collects}
                                  </span>
                                  <span>{item.createTime}</span>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="暂无资源" />
                  )}
                </Card>
              </div>
            )}

            {/* 我的课程 */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <Card className="shadow-sm border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">学习进度</h3>
                      <p className="text-gray-600">继续学习，提升专业技能</p>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />}>
                      浏览课程
                    </Button>
                  </div>
                </Card>

                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(course => (
                      <Card
                        key={course.id}
                        className="shadow-sm border-0 hover:shadow-md transition-shadow"
                        actions={[
                          <Button type="link">继续学习</Button>,
                          <Button
                            type="link"
                            icon={<StarOutlined />}
                            className={course.isFavorite ? 'text-yellow-500' : ''}
                          >
                            {course.isFavorite ? '已收藏' : '收藏'}
                          </Button>
                        ]}
                      >
                        <Meta
                          avatar={<BookOutlined className="text-2xl text-blue-500" />}
                          title={course.title}
                          description={
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>讲师: {course.teacher}</span>
                                <span>时长: {course.duration}</span>
                              </div>
                              <Progress percent={course.progress} size="small" />
                              <div className="flex justify-between text-sm">
                                <span>进度: {course.progress}%</span>
                                <span>评分: ⭐{course.rating}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                最后学习: {course.lastStudy}
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="shadow-sm border-0">
                    <Empty description="暂无课程" />
                  </Card>
                )}
              </div>
            )}

            {/* 我的会员 */}
            {activeTab === 'vip' && (
              <Card title="会员中心" className="shadow-sm border-0">
                <div className="space-y-6">
                  {/* 会员状态 */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">普通会员</h3>
                        <p className="text-gray-600 mt-2">剩余 15 天，享受基础权益</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-500">¥298/年</div>
                        <Button type="primary" size="large" className="mt-2">
                          立即续费
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 会员权益 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">会员权益</h3>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Card className="text-center border-0 bg-blue-50">
                          <CrownOutlined className="text-2xl text-blue-500 mb-2" />
                          <div className="font-semibold">专属课程</div>
                          <div className="text-sm text-gray-600">会员专享精品课程</div>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card className="text-center border-0 bg-green-50">
                          <DownloadOutlined className="text-2xl text-green-500 mb-2" />
                          <div className="font-semibold">资源下载</div>
                          <div className="text-sm text-gray-600">无限量资源下载</div>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card className="text-center border-0 bg-purple-50">
                          <TeamOutlined className="text-2xl text-purple-500 mb-2" />
                          <div className="font-semibold">专家咨询</div>
                          <div className="text-sm text-gray-600">专业问题一对一解答</div>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  {/* 会员记录 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">会员记录</h3>
                    <Timeline>
                      <Timeline.Item color="green">
                        <p>2024-01-15 会员续费</p>
                        <p className="text-gray-600">成功续费一年会员</p>
                      </Timeline.Item>
                      <Timeline.Item color="green">
                        <p>2023-12-20 权益升级</p>
                        <p className="text-gray-600">享受新的会员权益</p>
                      </Timeline.Item>
                      <Timeline.Item color="blue">
                        <p>2023-01-10 首次开通</p>
                        <p className="text-gray-600">成为平台会员</p>
                      </Timeline.Item>
                    </Timeline>
                  </div>
                </div>
              </Card>
            )}

            {/* 我的积分 */}
            {activeTab === 'points' && (
              <Card title="积分中心" className="shadow-sm border-0">
                <div className="space-y-6">
                  {/* 积分概览 */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">1,258 积分</div>
                        <p className="text-gray-600 mt-2">可用积分，可兑换精美礼品</p>
                      </div>
                      <Button type="primary" size="large">
                        积分兑换
                      </Button>
                    </div>
                  </div>

                  {/* 积分进度 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">等级进度</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>当前等级: Lv.{user.level}</span>
                        <span>下一等级: Lv.{user.level + 1}</span>
                      </div>
                      <Progress
                        percent={65}
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                      />
                      <div className="text-sm text-gray-600">
                        还需 350 积分升级到 Lv.{user.level + 1}
                      </div>
                    </div>
                  </div>

                  {/* 积分记录 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">积分记录</h3>
                    <List
                      dataSource={[
                        { action: '每日签到', points: '+10', time: '2024-01-20', type: 'earn' },
                        { action: '发布资源', points: '+50', time: '2024-01-19', type: 'earn' },
                        { action: '课程学习', points: '+30', time: '2024-01-18', type: 'earn' },
                        { action: '兑换礼品', points: '-100', time: '2024-01-15', type: 'spend' }
                      ]}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {item.type === 'earn' ? '+' : '-'}
                              </div>
                            }
                            title={
                              <div className="flex justify-between">
                                <span>{item.action}</span>
                                <span className={item.type === 'earn' ? 'text-green-600' : 'text-red-600'}>
                                  {item.points}
                                </span>
                              </div>
                            }
                            description={item.time}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </Card>
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
          <Form.Item label="用户名" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="职业头衔" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="个人简介" name="bio">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="头像">
            <Upload listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存修改
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
            <Input placeholder="资源/课程" />
          </Form.Item>
          <Form.Item name="isPublic" valuePropName="checked">
            <Switch checkedChildren="公开" unCheckedChildren="私密" defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              创建收藏夹
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserCenter;