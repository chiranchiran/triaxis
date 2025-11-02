import service from "../../utils/api/service"

//获取验证码
export const getCaptcha = (data) => {
  return service.post('/common/captcha', data)
}

//上传
export const uploadFile = ({ formData, onProgress }) => {
  return service.post('/common/upload', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
      timeout: 3600000,
    }
  )
}