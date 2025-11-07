import { apiConfigs } from "../../api/config"
import { logger } from "../../utils/logger"
import { useApi } from "./useApi"

export const useGet = (fn = null, queryKey = [], params = {}, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.get,
    params,
    isMutation: false,
    ...options
  })
}
export const useUpdate = (fn = null, queryKey = [], params = {}, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.delete,
    params,
    isMutation: true,
    ...options
  })
}
export const useDelete = (fn = null, queryKey = [], params = {}, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.delete,
    params,
    isMutation: true,
    ...options
  })
}
export const useAdd = (fn = null, queryKey = [], params = {}, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.add,
    params,
    isMutation: true,
    ...options
  })
}
export const useUpload = (fn = null, queryKey = [], params = {}, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.upload,
    isMutation: true,
    ...options
  })
}
export const useView = (fn = null, queryKey = [], params = {}, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.view,
    params,
    isMutation: true,
    ...options
  })
}