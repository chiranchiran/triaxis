import { apiConfigs } from "../../api/config"
import { getCaptcha, loginCount, loginMobile, logout, validate } from "../../api/modules/login"
import { getLoginData } from "../../utils/localStorage"
import { useApi } from "../common/useApi"

//登出
export const useLogout = (params, options = {}) => {
  return useApi(logout, {
    config: apiConfigs.auth.logout,
    params,
    isMutation: true,
    ...options
  })
}


//账户登录
export const useLoginByCount = (params, options = {}) => {
  return useApi(loginCount, {
    config: apiConfigs.auth.login,
    params,
    isMutation: true,
    ...options
  })
}

//手机号登录
export const useLoginByMobile = (params, options = {}) => {
  return useApi(loginMobile, {
    config: apiConfigs.auth.login,
    params,
    isMutation: true,
    ...options
  })
}

//自动登录
export const useAutoLogin = (params, options = {}) => {
  const { accessToken } = getLoginData()
  return useApi(validate, {
    config: apiConfigs.auth.auto,
    params: { accessToken, ...params },
    isMutation: true,
    ...options
  })
}

//获取手机号
export const useCaptcha = (params, options = {}) => {
  return useApi(getCaptcha, {
    config: apiConfigs.auth.captcha,
    params,
    isMutation: true,
    ...options
  })
}