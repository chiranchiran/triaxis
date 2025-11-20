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


const LoginBase = ({ children, isRegister = false }) => {
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
    <div className={`background w-full ${isRegister ? 'py-20' : 'py-40'} `}>
      <ProConfigProvider hashed={false}>
        <div className="container max-w-100 overflow-hidden rounded-2xl shadow-2xl bg-card">
          <div className="w-full flex flex-col justify-between items-center gap-1 mt-6">
            <Logo size="large" />
            <p className='text-secondary text-sm'>城乡规划专业交流平台</p>
          </div>
          {children}
          <div className="otherLogin px-15 mb-6 -mt-3">
            <Divider className="border-divider text-sm !text-secondary">其他登录方式</Divider>
            <Space className='w-full  flex justify-center space-x-4'>
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