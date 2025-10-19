import { apiConfigs } from "../../api/config"
import { useApi } from "./useApi"

export const useGet = (fn, queryKey, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.get,
    params,
    ...options
  })
}
export const useUpdate = (fn, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.delete,
    params,
    isMutation: true,
    ...options
  })
}
export const useDelete = (fn, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.delete,
    params,
    isMutation: true,
    ...options
  })
}
export const useAdd = (fn, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.add,
    params,
    isMutation: true,
    ...options
  })
}
export const useUpload = (fn, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.upload,
    params,
    isMutation: true,
    ...options
  })
}
export const useView = (fn, params, options = {}) => {
  return useApi(fn, {
    queryKey,
    config: apiConfigs.common.view,
    params,
    isMutation: true,
    ...options
  })
}