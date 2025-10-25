
import { getCategorySecondary, getResource, getResources, getResourceTypes, removeResource, removeResources, updateResource, uploadResource } from "../../api/modules/resources"
import { useDelete, useGet, useUpdate, useUpload } from "../common/useData"

export const RESOURCE_TYPES_QUERY_KEY = ['Resources', 'types']

export const useGetResourceTypes = (options) => useGet(getResourceTypes, ['Resources', 'types'], null, options)
export const useGetSecondaryCategory = (params, options) => useGet(getCategorySecondary, ['Resources', 'categories', params.subjectId, params.parentId], params, options)
export const useGetResources = (params, options) => useGet(getResources, ['Resources', 'list', params], params, options)
export const useGetResource = (id, options) => useGet(getResource, ['Resources', 'detail', id], id, options)
export const useuploadResource = (params, options) => useUpload(uploadResource, params, options)
export const useupdateResource = (params, options) => useUpdate(updateResource, ['Resources', params.id], params, options)
export const useremoveResource = (params, options) => useDelete(removeResource, params, options)
export const useremoveResources = (params, options) => useDelete(removeResources, params, options)

