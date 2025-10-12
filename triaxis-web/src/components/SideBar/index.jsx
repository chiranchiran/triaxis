// components/Sidebar.jsx
import React from 'react';
import { FloatButton, Tooltip, message } from 'antd';
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, CustomerServiceOutlined, QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate()
  const baseName = "w-10 h-10 text-main rounded-full flex items-center justify-center shadow-card hover:shadow-lg  transition-all duration-300 hover:scale-110 backdrop-blur-sm"

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
            className={`${baseName} bg-primary-50 hover:bg-primary`}
          >
            <VerticalAlignTopOutlined />
          </button>
        </Tooltip>

        <Tooltip title="回到底部" placement="left">
          <button
            onClick={scrollToBottom}
            className={`${baseName} bg-green-50 hover:bg-green`}
          >
            <VerticalAlignBottomOutlined />
          </button>
        </Tooltip>

        <Tooltip title="问题反馈" placement="left">
          <button
            onClick={handleFeedback}
            className={`${baseName} bg-orange-50 hover:bg-orange`}
          >
            <CustomerServiceOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;