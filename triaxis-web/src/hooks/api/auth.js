import { getCaptcha, loginCount, loginMobile, registerByCount, registerByMobile, validate } from "../../api/modules/auth"
import { getLoginData, getUserData } from "../../utils/localStorage"
import { useApi } from "../common/useApi"

export const useLoginByCount = (params, options = {}) => {
  return useApi(loginCount, {
    module: 'auth',
    apiName: 'login',
    params,
    isMutation: true,
    ...options
  })
}
export const useLoginByMobile = (params, options = {}) => {
  return useApi(loginMobile, {
    module: 'auth',
    apiName: 'login',
    params,
    isMutation: true,
    ...options
  })
}
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
export const useCaptcha = (params, options = {}) => {
  return useApi(getCaptcha, {
    module: 'auth',
    apiName: 'captcha',
    params,
    isMutation: true,
    ...options
  })
}
export const useRegisterByCount = (params, options = {}) => {
  return useApi(registerByCount, {
    module: 'auth',
    apiName: 'register',
    params,
    isMutation: true,
    ...options
  })
}
export const useRegisterByMobile = (params, options = {}) => {
  return useApi(registerByMobile, {
    module: 'auth',
    apiName: 'register',
    params,
    isMutation: true,
    ...options
  })
}