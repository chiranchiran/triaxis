import { useCallback, useState } from "react"
import { apiConfigs } from "../../api/config"
import { getCaptcha, uploadFile, uploadSimple } from "../../api/modules/common"
import { uploadResource } from "../../api/modules/resources"
import { useApi } from "../common/useApi"
import { useUpload } from "../common/useData"

export const useLike = (params, options) => {
  return useUpload(uploadResource, ['Resources', 'types'], params, options)
}
export const useCollect = (params, options) => {
  return useUpload(uploadResource, ['Resources', 'types'], params, options)
}
export const useDownload = (params, options) => {
  return useUpload(uploadResource, ['Resources', 'types'], params, options)
}
//获取验证码
export const useCaptcha = (options = {}) => {
  return useApi(getCaptcha, {
    // config: apiConfigs.auth.captcha,
    isMutation: true,
    ...options
  })
}
//上传
export const useUploadFile = (options = {}) => {
  return useUpload(uploadSimple, null, null, options)
}

