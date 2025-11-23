import { apiConfigs } from "../../api/config"
import { registerByCount, registerByMobile } from "../../api/modules/register"
import { useApi } from "../common/useApi"


//账户注册
export const useRegisterByCount = (options = {}) => {
  return useApi(registerByCount, {
    // config: apiConfigs.auth.register,
    isMutation: true,
    ...options
  })
}

//手机号注册
export const useRegisterByMobile = (options = {}) => {
  return useApi(registerByMobile, {
    // config: apiConfigs.auth.register,
    isMutation: true,
    ...options
  })
}