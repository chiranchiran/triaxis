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
import { useCaptcha, useLoginByCount, useLoginByMobile } from '../../hooks/api/auth';
import { getUserData } from '../../utils/localStorage';
import { useDispatch } from 'react-redux';
import { setAutoLogin } from '../../store/slices/authSlice';
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';
import LoginBase from '../../components/LoginBase';

const Login = () => {
  const [form] = useForm()
  const { mutate: getCaptcha, isSuccess: isCaptcha, data } = useCaptcha()
  const { mutate: countLogin, isSuccess: isCount } = useLoginByCount()
  const { mutate: phoneLogin, isSuccess: isPhone } = useLoginByMobile()
  const dispatch = useDispatch()
  //登录方式0：账号密码，1：手机号，
  const [loginType, setLoginType] = useState(0);
  //tab栏切换清空
  const changeTab = (activeKey) => {
    setLoginType(activeKey)
    form.resetFields()
  }

  //获取验证码
  const onCaptcha = async () => {
    logger.debug("获取验证码")
    try {
      const { phone } = await form.validateFields(['phone'])
      getCaptcha({ phone })
      if (isCaptcha) logger.debug("手机号校验通过，phone=", data);
      return true
    } catch (e) {
      const errorMessage =
        e?.errorFields?.[0]?.errors?.[0] ||
        e?.message ||
        '获取验证码失败'
      logger.debug("错误详情:", errorMessage);
      throw new Error(errorMessage);
    }
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
    }
  }, [isPhone, isCount])
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

  //提交表单
  const onFinish = (values) => {

    //账号登录
    if (loginType === 0) {
      const { username, password } = values
      logger.debug("开始登录", { username, password })
      countLogin({ username, password })
      //手机号登录
    } else {
      const { phone, captcha } = values
      logger.debug("开始登录", { phone, captcha })
      phoneLogin({ phone, captcha })
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
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count}秒后重新获取`;
                }
                return '获取验证码';
              }}
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
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
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