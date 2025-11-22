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
import { useCallback, useEffect, useState } from "react";
import { ChatMessage, MessageList } from "../../components/Chat";
import { useGetUserChat, useGetUserChats, useGetUserMessagesCollect, useGetUserMessagesCount, useGetUserMessagesLike, useGetUserMessagesReview, useGetUserMessagesSystem } from "../../hooks/api/user";
import { useDispatch, useSelector } from "react-redux";
import { setMessageCount } from "../../store/slices/userCenterSlice";
import { useChat } from "../../hooks/api/useChat";

const MyMessages = ({ }) => {
  const { total, chat, like, collect, review, system } = useSelector((state) => state.userCenter.messageCount)
  const dispatch = useDispatch()
  // const { getMessagesCount, SubscriptionTypes, subscribeMessageCount } = useChat()
  // useEffect(() => {
  //   if (!userId) return;
  //   console.log('初始化聊天列表，用户ID:', userId);
  //   const id = subscribeMessageCount('chats', {
  //     [SubscriptionTypes.MESSAGE_COUNT]: handleChats,
  //   })
  //   getMessagesCount(userId)
  // }, [userId]);

  // const handleChats = useCallback((message) => {
  //   dispatch(setMessageCount(message));
  // }, [])
  /**
   * @description state管理
   */

  const [activeKey, setActiveKey] = useState("chat");

  /**
   * @description 数据获取
    */
  // const { data: counts } = useGetUserMessagesCount({
  //   onSuccess: (data) => dispatch(setMessageCount(data)),
  // });;

  const likeQuery = useGetUserMessagesLike({
    enabled: activeKey === 'like',
    onSuccess: (data) => dispatch(setMessageCount({ like: data?.total })),
  });
  const collectQuery = useGetUserMessagesCollect({
    enabled: activeKey === 'collect',
    onSuccess: (data) => dispatch(setMessageCount({ collect: data?.total })),
  });
  const reviewQuery = useGetUserMessagesReview({
    enabled: activeKey === 'review',
    onSuccess: (data) => dispatch(setMessageCount({ review: data?.total })),
  });
  const systemQuery = useGetUserMessagesSystem({
    enabled: activeKey === 'system',
    onSuccess: (data) => dispatch(setMessageCount({ system: data?.total })),
  });

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

  const onChange = (activeKey) => {
    console.log('切换到tabKey:', activeKey);
    setActiveKey(activeKey)
  }
  const tabItems = [
    {
      key: 'chat',
      icon: MessageOutlined,
      label: '聊天',
      count: chat,
      children: <ChatMessage />
    },
    {
      key: 'like',
      icon: HeartOutlined,
      label: '点赞',
      count: like,
      children: <MessageList
        data={likeQuery?.data?.records || []}
        activeKey={activeKey}
      />
    },
    {
      key: 'collect',
      icon: StarOutlined,
      label: '收藏',
      count: collect,
      children: <MessageList
        data={collectQuery?.data?.records || []}
        activeKey={activeKey}
      />
    },
    // {
    //   key: 'follow',
    //   icon: UserOutlined,
    //   label: '关注',
    //   count: 3,
    //   children: <MessageList
    //     type={3}
    //     filteredMessages={filteredMessages}
    //     activeType={activeMessageType}
    //     messageTypes={MESSAGE_TYPES}
    //   />
    // },
    {
      key: 'review',
      icon: BellOutlined,
      label: '评论',
      count: review,
      children: <MessageList
        data={reviewQuery?.data?.records || []}
        activeKey={activeKey}
      />
    },
    {
      key: 'system',
      icon: SafetyCertificateOutlined,
      label: '系统',
      count: system,
      children: < MessageList data={systemQuery?.data?.records || []} activeKey={activeKey} />
    }
  ];
  return (
    <div className="bg-card rounded-lg border border-secondary p-6 shadow-sm">
      <Tabs
        tabPosition="top"
        items={tabItems}
        tabBarGutter={4}
        activeKey={activeKey}
        onChange={onChange}
        renderTabBar={(props, DefaultTabBar) => <CustomTabBar {...props} />}
      />
    </div>
  );
};
export default MyMessages;