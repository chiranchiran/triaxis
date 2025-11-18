import React from 'react';
import { MyButton } from '../MyButton';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
/**
 * 连接状态组件
 */
export const ConnectionStatus = ({
  websocketStatus,
  onReconnect,
  onBack
}) => {
  const getConnectionStatus = () => {
    switch (websocketStatus) {
      case 1: return { text: '已连接服务器', color: 'bg-green' };
      case 0: return { text: '连接服务器中...', color: 'bg-orange' };
      default: return { text: '未连接服务器', color: 'bg-red' };
    }
  };

  const status = getConnectionStatus();

  return (
    <div className="flex items-center justify-between mb-4">
      <MyButton
        type="black"
        icon={<ArrowLeftOutlined />}
        className="w-30"
        onClick={onBack}
      >
        返回
      </MyButton>
      <div className='flex gap-4'>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
          <span className="text-sm text-gray-600">
            {status.text}
          </span>
        </div>
        {websocketStatus !== 1 && (
          <MyButton
            type="black"
            size="small"
            onClick={onReconnect}
          >
            重新连接
          </MyButton>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;