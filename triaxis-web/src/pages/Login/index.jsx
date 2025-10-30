import React, { useEffect } from 'react'
import {
  FacebookFilled,
  AppleFilled,
  WechatFilled,
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Divider, Space, Tabs, theme, } from 'antd';
import { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { logger } from '../../utils/logger';
import { useLoginByCount, useLoginByMobile } from '../../hooks/api/login';
import { getUserData } from '../../utils/localStorage';
import { useDispatch } from 'react-redux';
import { setAutoLogin } from '../../store/slices/authSlice';
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';
import LoginBase from '../../components/LoginBase';
import { useCaptcha } from '../../hooks/api/common';

const Login = () => {
  const [form] = useForm()
  const { mutate: doCaptcha, isError: isCaptcha, data } = useCaptcha()
  const { mutate: doCountLogin, isSuccess: isCount } = useLoginByCount()
  const { mutate: doPhoneLogin, isSuccess: isPhone } = useLoginByMobile()
  //倒计时
  const [count, setCount] = useState(60);
  const [isTiming, setIsTiming] = useState(false)
  const dispatch = useDispatch()
  //登录方式0：账号密码，1：手机号，
  const [loginType, setLoginType] = useState(0);

  //自动登录失败后只填入用户名
  useEffect(() => {
    const { rememberMe, autoLoginExpire, username } = getUserData()
    if (rememberMe === true && autoLoginExpire) {
      //检查是否过有效期
      if (Date.now() < autoLoginExpire) {
        form.setFieldsValue({
          username: username,
          autoLogin: true
        });
      }
    }
  }, [form]);
  // 倒计时定时器
  useEffect(() => {
    let timer;
    if (isTiming) {
      timer = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            // 倒计时结束，重置状态
            clearInterval(timer);
            setIsTiming(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    // 组件卸载或isTiming变化时清除定时器
    return () => clearInterval(timer);
  }, [isTiming]);
  // 监听登录状态变化
  useEffect(() => {
    if (isPhone || isCount) {
      const autoLogin = form.getFieldValue('autoLogin')
      setAutologinState(autoLogin)
      logger.debug("登录成功", {
        isPhone,
        isCount,
        autoLogin
      })
    } else {
      setIsTiming(false);
      setCount(60);
    }
  }, [isPhone, isCount])

  //tab栏切换清空
  const changeTab = (activeKey) => {
    setLoginType(activeKey)
    form.resetFields()
  }
  // 验证码按钮文本渲染
  const captchaTextRender = () => {
    if (isTiming) {
      return `${count}秒后重新获取`;
    }
    return '获取验证码';
  };

  //获取验证码
  const onCaptcha = async () => {
    const { phone } = await form.validateFields(['phone'])
    setCount(60);
    setIsTiming(true);
    doCaptcha({ phone }, {
      onError: () => {
        setIsTiming(false)
        setCount(60);
      }
    })
  }
  //保存自动登录
  const setAutologinState = (autoLogin) => {
    // 存储自动登录相关数据
    if (autoLogin) {
      dispatch(setAutoLogin({ rememberMe: autoLogin }))
    } else {
      // 清除自动登录数据
      dispatch(setAutoLogin({ rememberMe: null, autoLoginExpire: -1 }))
    }
  }



  //提交表单
  const onFinish = (values) => {

    //账号登录
    if (loginType === 0) {
      const { username, password } = values
      logger.debug("开始登录", { username, password })
      doCountLogin({ username, password })
      //手机号登录
    } else {
      const { phone, captcha } = values
      logger.debug("开始登录", { phone, captcha })
      doPhoneLogin({ phone, captcha })
    }
  }

  //忘记密码
  //其他登录功能
  return (
    <LoginBase>
      <LoginForm
        size="middle"
        form={form}
        onFinish={onFinish}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={changeTab}
          items={[
            {
              key: 0,
              label: '账号登录',
            },
            {
              key: 1,
              label: '手机号登录',
            }
          ]}
        />
        {loginType === 0 && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
                autoComplete: "username"
              }}
              placeholder={'用户名'}
              validateFirst={true}
              onChange={() => {
                setIsTiming(false)
                setCount(60)
              }}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                }, {
                  min: 6,
                  message: "不能少于6位"
                }, {
                  max: 16,
                  message: "不能超过16位"
                },
                {
                  pattern: /^\w{6,16}$/,
                  message: '必须是6-16位小写字母、大写字母、数字或下划线'
                }
              ]}
            />

            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
                autoComplete: "current-password"
              }}
              placeholder={'密码'}
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                }, {
                  min: 6,
                  message: "不能少于6位"
                }, {
                  max: 16,
                  message: "不能超过20位"
                },
                {
                  pattern: /^\w{6,16}$/,
                  message: '必须是6-16位小写字母、大写字母、数字或下划线'
                }
              ]}
            />
          </>
        )}
        {loginType === 1 && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={'prefixIcon'} />,
                autoComplete: "tel"
              }}
              name="phone"
              placeholder={'手机号'}
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              captchaProps={{
                size: 'large',
                style: { width: '8rem', height: '39.7px' },
                disabled: isTiming
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={captchaTextRender}
              name="captcha"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                }, {
                  pattern: /^\d{6}$/,
                  message: "不超过6位！"
                }
              ]}
              onGetCaptcha={onCaptcha}
            />
          </>
        )}
        <div className='mb-2' >
          <ProFormCheckbox noStyle name="autoLogin" >
            <p className='text-sm text-main'>自动登录</p>
          </ProFormCheckbox>
          <Link to='' className='float-right text-sm text-green'>忘记密码</Link>
        </div>
      </LoginForm>
    </LoginBase>
  );
};
export default Login;