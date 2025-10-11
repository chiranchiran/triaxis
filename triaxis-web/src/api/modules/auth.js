import service from "../../utils/api/service"
import { getLoginData } from "../../utils/localStorage"

//账户注册
export const registerByCount = (data) => {
  return service.post('/register/count', data)
}
//手机号登录
export const registerByMobile = (data) => {
  return service.post('/register/phone', data)
}
//不同登录方式的接口
//账号登录
export const loginCount = (data) => {
  return service.post('/login/count', data)
}
//手机号登录
export const loginMobile = (data) => {
  return service.post('/login/phone', data)
}
//自动登录
export const validate = () => {
  return refreshLogin('/login/validate')
}

//refreshToken获得accessToken
export const refresh = () => {
  return refreshLogin('/login/refresh')
}

const refreshLogin = (path) => {
  const { refreshToken } = getLoginData()
  return service.get(path,
    {
      headers: {
        'Refresh-Token': refreshToken
      }
    })
}
//获取验证码
export const getCaptcha = (data) => {
  return service.post('/login/captcha', data)
}

