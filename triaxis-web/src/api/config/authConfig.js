import { Descriptions } from "antd"
import { loginFailure, loginSuccess, logout } from "../../store/slices/authSlice"

const onSuccess = (data, dispatch, navigate) => {
  dispatch(loginSuccess(data))
  navigate('/')
}
const onError = (error, dispatch) => {
  dispatch(loginFailure())
}
const onAutoSuccess = (data, dispatch, navigate) => {
  dispatch(loginSuccess(data))
}
const onAutoError = (error, dispatch, navigate) => {
  dispatch(logout())
  navigate('/login')
}
const onCaptcha = (data, dispatch, navigate) => {
  config.captcha.success.description = data
}
const onRegister = (data, dispatch, navigate) => {
  navigate('/login')
}
const config = {
  login: {
    success: {
      showMessage: true,
      message: "登录成功",
      description: "欢迎使用Triaxis~",
      handler: onSuccess,

    },
    error: {
      showMessage: false,
      message: "登录失败！",
      handler: onError
    }
  },
  auto: {
    success: {
      showMessage: false,
      message: "自动登录成功",
      description: "欢迎使用Triaxis~",
      handler: onAutoSuccess
    },
    error: {
      showMessage: false,
      message: "自动登录失败！",
      handler: onAutoError
    }
  },
  captcha: {
    success: {
      showMessage: true,
      message: '验证码已发送至您的手机，请注意查收（5分钟内有效）',
      handler: onCaptcha
    },
    error: {
      showMessage: false,
    }
  }, register: {
    success: {
      showMessage: true,
      message: "注册成功",
      description: "请使用注册的账户登录",
      handler: onRegister,

    },
    error: {
      showMessage: false,
      message: "注册失败！",
    }
  },
}
export default config