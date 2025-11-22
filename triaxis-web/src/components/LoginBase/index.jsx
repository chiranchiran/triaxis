import React, { useEffect, useState } from 'react'
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
import { OrderButton } from '../MyButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { p } from '@douyinfe/semi-ui/lib/es/markdownRender/components';
import { generateSafeState } from '../../utils/commonUtil';
import { useGoLogin } from '../../hooks/api/login';
import WechatLogin from './WechatLogin';


const LoginBase = ({ children, isRegister = false }) => {
  const { token } = theme.useToken()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const path = useLocation().pathname
  const { mutateAsync: doGoLogin } = useGoLogin()
  const [isWeChat, setIsWeChat] = useState(false)
  const [state, setState] = useState(null)
  //其他登录方式css
  const iconStyles = {
    marginInlineStart: '5px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };


  const handleLogin = async () => {
    const state = generateSafeState();
    await doGoLogin({ state })
    // setState(state)
    // dispatch(setLoginState(state))
    const redirectUri = '/sso/callback';
    window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=APPID&redirect_uri=${path}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`
    setIsWeChat(true)
  }

  //其他登录功能
  return (


    <div className={`background w-full ${isRegister ? 'py-25' : 'py-40'} `}>
      <OrderButton
        className="!text-lg absolute right-40 top-15"
        handleSortChange={(value) => navigate(`${value}`)} value={path} list={[{ id: '/login', name: "登录" }, { id: '/register', name: "注册" }]} />
      <ProConfigProvider hashed={false}>
        <div className={`container  overflow-hidden rounded-2xl shadow-2xl bg-card ${isWeChat ? 'max-w-200' : 'max-w-100'}`}>
          <div className="w-full flex flex-col justify-between items-center gap-1 mt-6">
            <Logo size="large" />
            <p className='text-secondary text-sm'>城乡规划专业交流平台</p>
          </div>
          {/* <div className='flex px-10'>
            {children}
            {isWeChat && <WechatLogin state={state} />}

          </div> */}
          {children}
          <div className="otherLogin px-15 mb-6 -mt-3">
            <Divider className="border-divider text-sm !text-secondary">其他登录方式</Divider>
            <Space className='w-full  flex justify-center space-x-4'>
              <WechatFilled style={iconStyles} onClick={handleLogin} />
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