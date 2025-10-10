import { Avatar, Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import './index.less'
// 详情页面组件
const CommunityDetail = ({ type }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    // 模拟数据加载
    setTimeout(() => {
      const mockData = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        title: `详细页面帖子 ${index + 1}`,
        content: '这是详细页面的帖子内容...',
        author: {
          name: `用户${index + 1}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`
        },
        viewCount: Math.floor(Math.random() * 1000),
        replyCount: Math.floor(Math.random() * 100),
        likeCount: Math.floor(Math.random() * 200),
        createTime: new Date().toLocaleString('zh-CN')
      }));
      setPosts(mockData);
      setLoading(false);
    }, 500);
  }, [type]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900">
            {type === 'bounty' ? '悬赏求助' : '帖子广场'} - 全部内容
          </h1>
          <p className="text-gray-600 mt-2">
            {type === 'bounty'
              ? '查看所有悬赏求助帖子，帮助他人解决问题'
              : '浏览社区所有帖子，参与讨论交流'
            }
          </p>
        </div>
        {/* 返回按钮 */}
        <div className="back mb-6">
          <Button
            type="primary"
            icon={< ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="flex items-center bg-blalck text-md text-gray-600 hover:text-gray-800"
          >
            返回社区
          </Button>
        </div>
        {/* 帖子列表 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            {posts.map(post => (
              <div
                key={post.id}
                className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Avatar size={24} src={post.author.avatar} className="mr-2" />
                          <span className="font-medium">{post.author.name}</span>
                        </div>
                        <span>{post.createTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-4 text-right">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">浏览</div>
                        <div className="text-sm font-medium text-gray-900">{post.viewCount}</div>
                      </div>
                      <div className="flex items-center justify-end space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MessageOutlined className="mr-1" />
                          {post.replyCount}
                        </span>
                        <span className="flex items-center">
                          <HeartOutlined className="mr-1" />
                          {post.likeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CommunityDetail;