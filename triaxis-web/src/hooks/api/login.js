import { apiConfigs } from "../../api/config"
import { getCaptcha } from "../../api/modules/common"
import { getToken, goLogin, loginCount, loginMobile, logout, refresh, } from "../../api/modules/login"
import { getLoginData } from "../../utils/localStorage"
import { useApi } from "../common/useApi"

//登出
export const useLogout = (options = {}) => {
  return useApi(logout, {
    // config: apiConfigs.auth.logout,
    isMutation: true,
    ...options
  })
}


//账户登录
export const useLoginByCount = (options = {}) => {
  return useApi(loginCount, {
    // config: apiConfigs.auth.login,
    isMutation: true,
    ...options
  })
}

//手机号登录
export const useLoginByMobile = (options = {}) => {
  return useApi(loginMobile, {
    // config: apiConfigs.auth.login,
    isMutation: true,
    ...options
  })
}

//自动登录
// export const useAutoLogin = (options = {}) => {
//   return useApi(validate, {
//     config: apiConfigs.auth.auto,
//     isMutation: true,
//     ...options
//   })
// }
//自动登录
export const useGetToken = (params, options = {}) => {
  return useApi(getToken, {
    params,
    // config: apiConfigs.auth.login,
    isMutation: false,
    ...options
  })
}

export const useGoLogin = (params, options = {}) => {
  return useApi(goLogin, {
    params,
    // config: apiConfigs.auth.login,
    isMutation: true,
    ...options
  })
}
//刷新token
export const useRefresh = (params, options = {}) => {
  console.log('🔧 useRefresh 被调用', {
    params,
    options
  });
  return useApi(refresh, {
    queryKey: ['refresh', params.state],
    params,
    // config: apiConfigs.auth.auto,
    isMutation: false,
    ...options
  })
}


