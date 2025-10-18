import service from "../../utils/api/service"


//账户注册
export const registerByCount = (data) => {
  return service.post('/register/count', data)
}
//手机号登录
export const registerByMobile = (data) => {
  return service.post('/register/phone', data)
}

