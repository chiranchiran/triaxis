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
import { message, Space, Tabs, theme, } from 'antd';
import { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { logger } from '../../utils/logger';
import { useCaptcha, useRegisterByCount, useRegisterByMobile } from '../../hooks/api/auth';
import { useMessage } from "../../hooks/common/useMessage"
export default function Register() {
  const { token } = theme.useToken()
  const [form] = useForm()
  const { mutate: getCaptcha, isSuccess: isCaptcha } = useCaptcha()
  const { mutate: countRegister, isSuccess: isCount } = useRegisterByCount()
  const { mutate: phoneRegister, isSuccess: isPhone } = useRegisterByMobile()
  const messageApi = useMessage()

  //注册方式0：账号密码，1：手机号，
  const [registerType, setRegisterType] = useState(0);

  //其他注册方式css
  const iconStyles = {
    marginInlineStart: '5px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  //tab栏切换清空
  const changeTab = (activeKey) => {
    setRegisterType(activeKey)
    form.resetFields()
  }

  //获取验证码
  const onCaptcha = async () => {
    logger.debug("获取验证码")
    try {
      const { phone } = await form.validateFields(['phone'])
      getCaptcha({ phone })
      if (isCaptcha) logger.debug("手机号校验通过，phone=", phone);
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

  //保存用户协议同意状态
  const setAgreementState = (agreement) => {
    // 可以存储用户协议同意状态
    if (agreement) {
      // dispatch(setUserAgreement({ agreed: true }))
      logger.debug("用户已同意协议")
    } else {
      // dispatch(setUserAgreement({ agreed: false }))
      logger.debug("用户未同意协议")
    }
  }

  //提交表单
  const onFinish = (values) => {
    if (!values.agreement) {
      messageApi.error("请先同意用户协议！")
      return
    }
    //账号注册
    if (registerType === 0) {
      const { username, password, confirmPassword, agreement } = values

      // 确认密码校验
      if (password !== confirmPassword) {
        logger.debug("密码不一致")
        form.setFields([
          {
            name: 'confirmPassword',
            errors: ['两次输入的密码不一致'],
          },
        ]);
        return;
      }

      logger.debug("开始注册", { username, password })
      countRegister({ username, password })
      //手机号注册
    } else {
      const { phone, captcha, password, confirmPassword, agreement } = values

      // 确认密码校验
      if (password !== confirmPassword) {
        logger.debug("密码不一致")
        form.setFields([
          {
            name: 'confirmPassword',
            errors: ['两次输入的密码不一致'],
          },
        ]);
        return;
      }

      logger.debug("开始注册", { phone, captcha, password })
      phoneRegister({ phone, captcha, password })
    }
  }

  //监听注册状态变化
  useEffect(() => {
    if (isCount) {
      logger.debug("账号注册完成")
    }
  }, [isCount])

  useEffect(() => {
    if (isPhone) {
      logger.debug("手机号注册完成")
    }
  }, [isPhone])

  return (
    <div className="background">
      <ProConfigProvider hashed={false}>
        <div className="container max-w-105" style={{ backgroundColor: token.colorBgContainer }}>
          <LoginForm
            logo="../../../logo.png"
            form={form}
            title="Triaxis"
            subTitle="城乡规划专业交流平台"
            onFinish={onFinish}
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
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                    autoComplete: "new-password"
                  }}
                  placeholder={'确认密码'}
                  validateFirst={true}
                  rules={[
                    {
                      required: true,
                      message: '请确认密码！',
                    }
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
                  rules={[
                    {
                      required: true,
                      message: '请确认密码！',
                    }
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
              <ProFormCheckbox noStyle name="agreement" value="true" rules={[{
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议'))
              }]}>
                我已阅读并同意 <a style={{
                  color: "rgb(119, 212, 154)"
                }}
                >用户协议</a> 和 <a style={{
                  color: "rgb(119, 212, 154)"
                }}
                >隐私政策</a>
              </ProFormCheckbox>
            </div>
          </LoginForm>
          <div className="otherLogin">
            <div className="otherLogin">————— 其他注册方式 —————</div>
            <Space >
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