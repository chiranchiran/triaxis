import React, { useEffect } from 'react'
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { logger } from '../../utils/logger';
import { useRegisterByCount, useRegisterByMobile } from '../../hooks/api/register';
import LoginBase from '../../components/LoginBase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCaptcha } from '../../hooks/api/common';
import { generateSafeState } from '../../utils/commonUtil';
import { useGoLogin } from '../../hooks/api/login';

function Register() {
  const pathname = useLocation().pathname
  const [form] = useForm()
  const navigate = useNavigate()
  const { mutateAsync: doGoLogin } = useGoLogin()
  const { mutate: getCaptcha, isError: isCaptcha, data } = useCaptcha()
  const { mutate: countRegister, isSuccess: isCount } = useRegisterByCount()
  const { mutate: phoneRegister, isSuccess: isPhone } = useRegisterByMobile()
  //倒计时
  const [count, setCount] = useState(60);
  const [isTiming, setIsTiming] = useState(false)

  //注册方式0：账号密码，1：手机号，
  const [registerType, setRegisterType] = useState(0);

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
  }, [isTiming])

  // 监听登录状态变化
  useEffect(() => {
    if (isPhone || isCount) {
      logger.debug("注册成功", {
        isPhone,
        isCount
      })
      // sso登录
      const fn = async () => {
        const state = generateSafeState();
        await doGoLogin({ state })

        // dispatch(setLoginState(state))
        const redirectUri = '/sso/callback';
        navigate(`/login?state=${state}&redirectUri=${redirectUri}&originalPath=${pathname}`)
      }
      fn()

    } else {
      setIsTiming(false);
      setCount(60);
    }
  }, [isPhone, isCount])

  //tab栏切换清空
  const changeTab = (activeKey) => {
    setRegisterType(activeKey)
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
    getCaptcha({ phone }, {
      onError: () => {
        setIsTiming(false)
        setCount(60);
      }
    })
  }

  //提交表单
  const onFinish = (values) => {
    //账号注册
    if (registerType === 0) {
      const { username, password } = values
      logger.debug("开始注册", { username, password })
      countRegister({ username, password })
      //手机号注册
    } else {
      const { phone, captcha, password } = values
      logger.debug("开始注册", { phone, captcha, password })
      phoneRegister({ phone, captcha, password })
    }
  }

  return (
    <LoginBase isRegister>
      <LoginForm
        form={form}
        onFinish={onFinish}
        defaultValue={{
          agreement: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '注册',
          },
        }}
      >
        <Tabs
          centered
          activeKey={registerType}
          onChange={changeTab}
          items={[
            {
              key: 0,
              label: '账号注册',
            },
            {
              key: 1,
              label: '手机号注册',
            }
          ]}
        />
        {registerType === 0 && (
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
                autoComplete: "new-password"
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
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{ size: 'large', prefix: <LockOutlined className={'prefixIcon'} />, autoComplete: "new-password" }}
              placeholder={'确认密码'}
              validateFirst={true}
              dependencies={["password"]}
              rules={[
                { required: true, message: '请确认密码！' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            />
          </>
        )}
        {registerType === 1 && (
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
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
                autoComplete: "new-password"
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
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
                autoComplete: "new-password"
              }}
              placeholder={'确认密码'}
              validateFirst={true}
              dependencies={["password"]}
              rules={[
                { required: true, message: '请确认密码！' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
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
          <ProFormCheckbox name="agreement"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请同意《用户协议》和《隐私政策》！')),
              },
            ]}
            initialValue={true}
            valuePropName="checked"
            validateFirst={true}
          >
            <span className='text-sm text-main'>我已阅读并同意</span>
            <Link to='' className=' text-sm text-green'>《用户协议》</Link>
            <span className='text-sm text-main'>和</span>
            <Link to='' className='text-sm text-green'>《隐私政策》</Link>
          </ProFormCheckbox>
        </div>
      </LoginForm>
    </LoginBase>

  );
};
export default Register