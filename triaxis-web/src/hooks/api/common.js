import { useCallback, useState } from "react"
import { apiConfigs } from "../../api/config"
import { getCaptcha, uploadFile } from "../../api/modules/common"
import { uploadResource } from "../../api/modules/resources"
import { useApi } from "../common/useApi"

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
export const useCaptcha = (params, options = {}) => {
  return useApi(getCaptcha, {
    config: apiConfigs.auth.captcha,
    params,
    isMutation: true,
    ...options
  })
}
//上传
export const useUpload = (params, options = {}) => {
  return useApi(uploadFile, {
    config: apiConfigs.common.upload,
    params,
    isMutation: true,
    retry: 0,
    ...options
  })
}
