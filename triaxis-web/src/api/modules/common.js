import service from "../../utils/api/service"

//获取验证码
export const getCaptcha = (data) => {
  return service.post('/common/captcha', data)
}
export const uploadSimple = ({ formData, onUploadProgress }) => {
  return service.post('/common/upload', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      timeout: 3600000,
    }
  )
}
//上传
export const uploadFile = ({ formData, onUploadProgress }) => {
  return service.post('/upload/small', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      timeout: 3600000,
    }
  )
}
export const uploadChunk = ({ formData, onUploadProgress }) => {
  return service.post('/upload/chunk', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      timeout: 3600000,
    }
  )
}
export const merge = (data) => {
  return service.post('/upload/merge', data,
    {
      timeout: 3600000,
    }
  )
}
export const checkFile = (data) => {
  return service.post('/upload/check', data,
  )
}