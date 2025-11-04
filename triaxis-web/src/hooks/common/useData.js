import { apiConfigs } from "../../api/config"
import { logger } from "../../utils/logger"
import { useApi } from "./useApi"

export const useGet = (fn, queryKey, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.get,
    params,
    isMutation: false,
    ...options
  })
}
export const useUpdate = (fn, queryKey, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.delete,
    params,
    isMutation: true,
    ...options
  })
}
export const useDelete = (fn, queryKey, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.delete,
    params,
    isMutation: true,
    ...options
  })
}
export const useAdd = (fn, queryKey, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.add,
    params,
    isMutation: true,
    ...options
  })
}
export const useUpload = (fn, queryKey = null, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.upload,
    isMutation: true,
    ...options
  })
}
export const useView = (fn, queryKey, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.view,
    params,
    isMutation: true,
    ...options
  })
}