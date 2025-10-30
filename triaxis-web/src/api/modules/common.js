import service from "../../utils/api/service"

//获取验证码
export const getCaptcha = (data) => {
  return service.post('/common/captcha', data)
}

//上传
export const uploadFile = (data) => {
  return service.post('/common/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}