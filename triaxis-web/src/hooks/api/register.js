import { registerByCount, registerByMobile } from "../../api/modules/register"
import { useApi } from "../common/useApi"


//账户注册
export const useRegisterByCount = (params, options = {}) => {
  return useApi(registerByCount, {
    module: 'auth',
    apiName: 'register',
    params,
    isMutation: true,
    ...options
  })
}

//手机号注册
export const useRegisterByMobile = (params, options = {}) => {
  return useApi(registerByMobile, {
    module: 'auth',
    apiName: 'register',
    params,
    isMutation: true,
    ...options
  })
}