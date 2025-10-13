import React, { useEffect } from 'react'
import {
  FacebookFilled,
  AppleFilled,
  WechatFilled,
  AlipayCircleOutlined,
} from '@ant-design/icons';
import {
  ProConfigProvider,
  setAlpha,
} from '@ant-design/pro-components';
import { Divider, Space, Tabs, theme, } from 'antd';
import './index.less'
import { useDispatch } from 'react-redux';
import Logo from '../../components/Logo';


const LoginBase = ({ children }) => {
  const { token } = theme.useToken()
  const dispatch = useDispatch()

  //其他登录方式css
  const iconStyles = {
    marginInlineStart: '5px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };


  //其他登录功能
  return (
    <div className="background w-full py-20">
      <ProConfigProvider hashed={false}>
        <div className="container max-w-105 overflow-hidden rounded-2xl shadow-2xl" style={{ backgroundColor: token.colorBgContainer }}>
          <div className="w-full flex flex-col justify-between items-center gap-3 mt-8 mb-2">
            <Logo size="large" />
            <p className='text-secondary text-sm'>城乡规划专业交流平台</p>
          </div>
          {children}
          <div className="px-15 mb-8 mt-6">
            <Divider className="border-divider">其他登录方式</Divider>
            <Space className='w-full otherLogin flex justify-center space-x-4 mt-1'>
              <WechatFilled style={iconStyles} />
              <AppleFilled style={iconStyles} />
              <AlipayCircleOutlined style={iconStyles} />
              <FacebookFilled style={iconStyles} />
            </Space>
          </div>
        </div>
      </ProConfigProvider>
    </div>
  );
};
export default LoginBase;