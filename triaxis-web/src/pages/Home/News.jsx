// components/Banner/News.jsx
import React from 'react';
import { Button, List, Tag } from 'antd';
import { FireOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const News = () => {
  const navigate = useNavigate()
  const newsData = [
    {
      title: '新版城市规划编制办法解读',
      description: '最新政策解读与实施要点分析',
      tag: '政策',
      hot: true
    },
    {
      title: '智慧城市发展趋势论坛',
      description: '行业专家深度探讨未来发展方向',
      tag: '论坛',
      hot: true
    },
    {
      title: '乡村振兴规划案例分享',
      description: '成功实践经验与创新模式交流',
      tag: '案例'
    },
    {
      title: '国土空间规划技术指南',
      description: '专业技术要点与操作规范解析',
      tag: '技术'
    },
  ];

  return (
    <section className="section-spacing bg-gray-50">
      <div className="news max-w-7xl mx-auto px-4 pb-8">
        <div className="flex justify-between center items-center mb-8">
          <div className='mx-auto'>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <FireOutlined className="text-orange mr-3" />
              热点资讯
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">了解行业内最新动态</p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/community')}
          className="news-more !text-black !bg-orange-100" type="primary" icon={<ArrowRightOutlined />} size="large">
          查看更多
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <List
              dataSource={newsData}
              renderItem={(item) => (
                <List.Item className="border-0 py-4 px-0 hover:bg-card rounded-lg transition-colors">
                  <List.Item.Meta
                    title={
                      <div className="flex items-center space-x-3">
                        <span className="text-main font-medium hover:text-primary cursor-pointer">
                          {item.title}
                        </span>
                        {item.hot && <Tag color="orange">热门</Tag>}
                        <Tag className="bg-primary-light border-blue text-muted">{item.tag}</Tag>
                      </div>
                    }
                    description={<span className="text-muted">{item.description}</span>}
                  />
                </List.Item>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-main mb-4">热门讨论</h3>
              {['规划师日常经验分享', '项目实践问题交流', '新技术应用探讨', '行业发展趋势分析'].map((topic, index) => (
                <div key={index} className="py-3 border-b border-main last:border-0 hover:text-primary cursor-pointer transition-colors">
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;