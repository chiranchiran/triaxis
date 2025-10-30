
import { getCategorySecondary, getResource, getResources, getResourceTypes, removeResource, removeResources, updateResource, uploadResource } from "../../api/modules/resources"
import { useDelete, useGet, useUpdate, useUpload } from "../common/useData"

export const useGetResourceTypes = (options) => useGet(getResourceTypes, ['resources', 'types'], null, options)
export const useGetSecondaryCategory = (params, options) => useGet(getCategorySecondary, ['resources', 'categories', params.subjectId, params.parentId], params, { enabled: !!params.subjectId && !!params.parentId, ...options })
export const useGetResources = (params, options) => useGet(getResources, ['resources', 'list', params], params, options)
export const useGetResource = (id, options) => useGet(getResource, ['resources', 'detail', id], id, options)
export const useUploadResource = (params, options) => useUpload(uploadResource, params, options)
export const useUpdateResource = (params, options) => useUpdate(updateResource, ['resources', params.id], params, options)
export const useRemoveResource = (params, options) => useDelete(removeResource, params, options)
export const useRemoveResources = (params, options) => useDelete(removeResources, params, options)

