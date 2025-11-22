import service from "../../utils/api/service"
import { getLoginData } from "../../utils/localStorage"

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
// export const validate = () => {
//   return service.post('/login/validate')
// }
//登出
export const logout = (id) => {
  return service.post(`/user/logout/${id}`)
}
//refreshToken获得accessToken
export const refresh = (params) => {
  // const { refreshToken } = getLoginData()
  return service.get('/login/refresh', { params },
    // {
    //   headers: {
    //     'Refresh-Token': refreshToken
    //   }
    // }
  )
}
// state换accessToken
export const getToken = (params) => {
  return service.get(`/login/token`, { params })
}
//提交state
export const goLogin = (data) => {
  return service.post(`/login/state`, data)
}
