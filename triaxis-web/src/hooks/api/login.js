import { apiConfigs } from "../../api/config"
import { getCaptcha } from "../../api/modules/common"
import { loginCount, loginMobile, logout, validate } from "../../api/modules/login"
import { getLoginData } from "../../utils/localStorage"
import { useApi } from "../common/useApi"

//登出
export const useLogout = (options = {}) => {
  return useApi(logout, {
    config: apiConfigs.auth.logout,
    isMutation: true,
    ...options
  })
}


//账户登录
export const useLoginByCount = (options = {}) => {
  return useApi(loginCount, {
    config: apiConfigs.auth.login,
    isMutation: true,
    ...options
  })
}

//手机号登录
export const useLoginByMobile = (options = {}) => {
  return useApi(loginMobile, {
    config: apiConfigs.auth.login,
    isMutation: true,
    ...options
  })
}

//自动登录
export const useAutoLogin = (options = {}) => {
  return useApi(validate, {
    config: apiConfigs.auth.auto,
    isMutation: true,
    ...options
  })
}

