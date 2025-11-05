// components/Banner/News.jsx
import React from 'react';
import { Button, List, Tag } from 'antd';
import { FireOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

function News({ newsData, topicData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <List
          dataSource={newsData}
          renderItem={(item) => (
            <List.Item className="border-0 py-4 px-0 rounded-lg transition-colors">
              <List.Item.Meta
                title={
                  <div className="flex items-center space-x-3">
                    <Link to={`/community/posts/${item.id}`} className="text-main text-base font-medium"># {item.title}</Link>
                    {item.hot && <Tag className="tag-orange">热门</Tag>}
                    <Tag className="tag-blue">{item.tag}</Tag>
                  </div>
                }
                description={<span className="text-muted text-sm">{item.description}</span>}
              />
            </List.Item>
          )}
        />
      </div>


      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-main mb-4">热门讨论</h3>
        {topicData.map((topic, index) => (
          <div key={index} className="py-3 border-b border-main last:border-0 transition-colors">
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;