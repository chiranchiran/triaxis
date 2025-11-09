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
import SimpleResource from '../../components/SimpleResource';

export const MyResources = () => {
  // 资源子标签
  const CustomTabBar = (props) => {
    const { activeKey, onTabClick } = props;

    return (
      <div className="flex gap-6 pb-6 border-b border-secondary text-sm">
        {tabItems.map(item => {
          const active = item.key === activeKey;
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => onTabClick(item.key)}
              className={`py-2 px-8 rounded-lg text-sm flex items-center ${active
                ? 'bg-selected  shadow-md contrast-100'
                : 'setting bg-btn hover:shadow-md shadow-sm'
                }`}
            >
              <Icon className={`text-lg ${active ? 'text-light contrast-200' : ''}`} />
              <span className={`ml-2 ${active ? ' text-light contrast-150' : ''}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  // 按 tabItems 格式重构的资源子标签数组
  const tabItems = [
    // {
    //   key: 'collections',
    //   icon: FolderOutlined, // 改为组件引用（移除 <>/</>）
    //   label: '收藏夹',
    //   count: 0, // 补充 count 字段（根据实际数据填写，这里用 0 占位）
    //   children: <ResourceList resourceType="collections" /> // 假设资源列表组件为 ResourceList，传入对应类型
    // },
    {
      key: 'favorites',
      icon: StarOutlined,
      label: '收藏',
      count: 0,
      children: <SimpleResource type="favorites" />
    },
    {
      key: 'likes',
      icon: HeartOutlined,
      label: '点赞',
      count: 0,
      children: <SimpleResource type="likes" />
    },
    {
      key: 'uploads',
      icon: DownloadOutlined,
      label: '上传',
      count: 0,
      children: <SimpleResource type="uploads" />
    },
    {
      key: 'purchased',
      icon: CheckCircleOutlined,
      label: '已购买',
      count: 0,
      children: <SimpleResource type="purchased" />
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
{/* 我的收藏夹 */ }
//   activeResourceTab === 'collections' && (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">我的收藏夹</h3>
//         <Button
//           icon={<PlusOutlined />}
//           onClick={() => setCreateCollectionVisible(true)}
//           className="bg-blue-400 hover:bg-blue-500 border-blue-400"
//         >
//           新建收藏夹
//         </Button>
//       </div>
//       {resources.collections && resources.collections.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {resources.collections.map(collection => (
//             <div
//               key={collection.id}
//               className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
//             >
//               <div className="flex items-center mb-3">
//                 <FolderOutlined className="text-2xl text-blue-400 mr-3" />
//                 <div>
//                   <h4 className="font-medium text-gray-800">{collection.name}</h4>
//                   <p className="text-sm text-gray-500">包含 {collection.count} 个项目</p>
//                 </div>
//               </div>
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>{collection.isPublic ? '公开' : '私密'}</span>
//                 <span>{collection.createTime}</span>
//               </div>
//               <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
//                 <button className="text-blue-400 hover:text-blue-500 text-sm">查看</button>
//                 <button className="text-gray-500 hover:text-gray-700 text-sm">编辑</button>
//                 <button className="text-orange-400 hover:text-orange-500 text-sm flex items-center">
//                   <StarOutlined className="mr-1" />
//                   {collection.count}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <Empty description="暂无收藏夹" />
//       )}
//     </div>
//   )
// }
