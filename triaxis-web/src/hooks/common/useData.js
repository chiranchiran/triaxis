import { useApi } from "./useApi"

export const useGet = (fn, params, options = {}) => {
  return useApi(fn, {
    module: 'common',
    apiName: 'get',
    params,
    isMutation: true,
    ...options
  })
}
export const useUpdate = (fn, params, options = {}) => {
  return useApi(fn, {
    module: 'common',
    apiName: 'update',
    params,
    isMutation: true,
    ...options
  })
}
export const useDelete = (fn, params, options = {}) => {
  return useApi(fn, {
    module: 'common',
    apiName: 'delete',
    params,
    isMutation: true,
    ...options
  })
}
export const useAdd = (fn, params, options = {}) => {
  return useApi(fn, {
    module: 'common',
    apiName: 'add',
    params,
    isMutation: true,
    ...options
  })
}
export const useUpload = (fn, params, options = {}) => {
  return useApi(fn, {
    module: 'common',
    apiName: 'upload',
    params,
    isMutation: true,
    ...options
  })
}
export const useView = (fn, params, options = {}) => {
  return useApi(fn, {
    module: 'common',
    apiName: 'view',
    params,
    isMutation: true,
    ...options
  })
}