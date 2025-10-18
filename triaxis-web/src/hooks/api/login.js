import { getCaptcha, loginCount, loginMobile, validate } from "../../api/modules/login"
import { logout } from "../../api/modules/user"
import { getLoginData } from "../../utils/localStorage"
import { useApi } from "../common/useApi"

//登出
//账户登录
export const useLogout = (params, options = {}) => {
  return useApi(logout, {
    module: 'auth',
    apiName: 'logout',
    params,
    isMutation: true,
    ...options
  })
}


//账户登录
export const useLoginByCount = (params, options = {}) => {
  return useApi(loginCount, {
    module: 'auth',
    apiName: 'login',
    params,
    isMutation: true,
    ...options
  })
}

//手机号登录
export const useLoginByMobile = (params, options = {}) => {
  return useApi(loginMobile, {
    module: 'auth',
    apiName: 'login',
    params,
    isMutation: true,
    ...options
  })
}

//自动登录
export const useAutoLogin = (params, options = {}) => {
  const { accessToken } = getLoginData()
  return useApi(validate, {
    module: 'auth',
    apiName: 'auto',
    params: { accessToken, ...params },
    isMutation: true,
    ...options
  })
}

//获取手机号
export const useCaptcha = (params, options = {}) => {
  return useApi(getCaptcha, {
    module: 'auth',
    apiName: 'captcha',
    params,
    isMutation: true,
    ...options
  })
}