// components/Sidebar.jsx
import React from 'react';
import { Tooltip, message } from 'antd';
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate()
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleFeedback = () => {
    navigate('/user/feedback')
  };

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <div className="flex flex-col space-y-3">
        <Tooltip title="回到顶部" placement="left">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-blue-200/50 text-main rounded-full flex items-center justify-center shadow-card hover:shadow-lg hover:bg-primary transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <VerticalAlignTopOutlined />
          </button>
        </Tooltip>

        <Tooltip title="回到底部" placement="left">
          <button
            onClick={scrollToBottom}
            className="w-12 h-12 bg-green-100/50 text-main rounded-full flex items-center justify-center shadow-card hover:shadow-lg hover:bg-green transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <VerticalAlignBottomOutlined />
          </button>
        </Tooltip>

        <Tooltip title="问题反馈" placement="left">
          <button
            onClick={handleFeedback}
            className="w-12 h-12 bg-orange-100/80 text-main rounded-full flex items-center justify-center shadow-card hover:shadow-lg hover:bg-orange transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <CustomerServiceOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;