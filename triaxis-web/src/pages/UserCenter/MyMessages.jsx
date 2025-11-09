import { Avatar, Badge, Empty, Tabs } from "antd";
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
import { useEffect, useState } from "react";
import { ChatMessage, MessageList } from "../../components/Chat";

export const MyMessages = ({ }) => {


  const CustomTabBar = (props) => {
    const { activeKey, onTabClick } = props;

    return (
      <div className="flex gap-6 pb-6 border-b border-secondary text-sm">
        {tabItems.map(item => {
          const active = item.key === activeKey;
          const Icon = item.icon;

          return (
            <Badge key={item.key} count={item.count} offset={[-3, 7]} className="cursor-pointer" size="middle" overflowCount={999}>
              <div
                className={`flex flex-col items-center py-2 px-10 rounded-lg text-sm ${active
                  ? 'bg-selected shadow-md contrast-100'
                  : 'setting bg-btn  hover:shadow-md shadow-sm '
                  }`}
                onClick={() => onTabClick(item.key)}
              >
                <Icon className={`text-lg ${active ? 'text-light contrast-200' : ''}`} />
                <span className={`mt-1 ${active ? ' text-light contrast-150' : ''}`}>
                  {item.label}
                </span>
              </div>
            </Badge>
          );
        })}
      </div>
    );
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
  const [activeMessageType, setActiveMessageType] = useState('chat');


  const [createCollectionVisible, setCreateCollectionVisible] = useState(false);
  const [activeResourceTab, setActiveResourceTab] = useState('collections');
  const [activeCourseTab, setActiveCourseTab] = useState('collections');

  // 模拟数据
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [collections, setCollections] = useState([]);
  const [chatList, setChatList] = useState([]);
  // 过滤消息
  const filteredMessages = activeMessageType === 'chat'
    ? chatList
    : messages.filter(msg => msg.type === activeMessageType);
  // 加载模拟数据
  useEffect(() => {
    // 模拟消息数据
    const mockMessages = [
      {
        id: 1,
        type: 'like',
        content: '李华点赞了您的帖子《城市规划设计要点》',
        createTime: '2小时前',
        read: false,
        user: {
          userId: 1,
          username: '李华',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
        }
      },
      {
        id: 2,
        type: 'comment',
        content: '王伟评论了您的资源：这个资料很有用，谢谢分享！',
        createTime: '5小时前',
        read: true,
        user: {
          userId: 1,
          username: '王伟',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
        }
      },
      {
        id: 3,
        type: 'follow',
        content: '新用户张丽关注了您',
        createTime: '1天前',
        read: false,
        user: {
          userId: 1,
          username: '张丽',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
        }
      },
      {
        id: 4,
        type: 'system',
        content: '系统通知：您的会员即将到期，请及时续费',
        createTime: '2天前',
        read: true
      }
    ];


    // 模拟私聊数据
    const mockChatList = [
      {
        id: 1,
        user: {
          username: '李华',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
          online: true
        },
        lastMessage: {
          createTime: '10:30',
          content: '关于那个设计方案，我有一些建议...'
        },
        unread: 2
      },
      {
        id: 2,
        user: {
          username: '王伟',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
          online: false
        },
        lastMessage: {
          createTime: '10:30',
          content: '关于那个设计方案，我有一些建议...'
        },
        unread: 0
      }
    ];

    setMessages(mockMessages);
    setChatList(mockChatList);
  }, []);
  const tabItems = [
    {
      key: 'chat',
      icon: MessageOutlined,
      label: '聊天',
      count: 335,
      children: <ChatMessage chatList={chatList} />
    },
    {
      key: 'like',
      icon: HeartOutlined,
      label: '点赞',
      count: 3,
      children: <MessageList
        filteredMessages={messages}
        activeType={activeMessageType}
        messageTypes={MESSAGE_TYPES}
      />
    },
    {
      key: 'collect',
      icon: StarOutlined,
      label: '收藏',
      count: 3,
      children: <MessageList
        filteredMessages={filteredMessages}
        activeType={activeMessageType}
        messageTypes={MESSAGE_TYPES}
      />
    },
    {
      key: 'follow',
      icon: UserOutlined,
      label: '关注',
      count: 3,
      children: <MessageList
        filteredMessages={filteredMessages}
        activeType={activeMessageType}
        messageTypes={MESSAGE_TYPES}
      />
    },
    {
      key: 'comment',
      icon: BellOutlined,
      label: '评论',
      count: 3,
      children: <MessageList
        filteredMessages={filteredMessages}
        activeType={activeMessageType}
        messageTypes={MESSAGE_TYPES}
      />
    },
    {
      key: 'system',
      icon: SafetyCertificateOutlined,
      label: '系统',
      children: <MessageList
        filteredMessages={filteredMessages}
        activeType={activeMessageType}
        messageTypes={MESSAGE_TYPES}
      />
    }
  ];
  return (
    <div className="bg-card rounded-lg border border-secondary p-6 shadow-sm">
      <Tabs
        tabPosition="top"
        items={tabItems}
        tabBarGutter={4}
        renderTabBar={(props, DefaultTabBar) => <CustomTabBar {...props} />}
      />
    </div>
  );
};