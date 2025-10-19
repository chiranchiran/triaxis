
import { getCategorySecondary, getResource, getResources, getResourceTypes, removeResource, removeResources, updateResource, uploadResource } from "../../api/modules/resources"
import { useDelete, useGet, useUpdate, useUpload } from "../common/useData"

export const useGetResourceTypes = (params, options) => useGet(getResourceTypes, ['Resources', 'types'], params, options)
export const useGetCategorySecondary = (params, options) => useGet(getCategorySecondary, ['Resources', 'types', params.subjectId, params.parentId], params, options)
export const useSearchResource = (params, options) => useGet(getResources, ['Resources', 'list', params], params, options)
export const useGetResource = (params, options) => useGet(getResource, ['Resources', params.id], params, options)
export const useuploadResource = (params, options) => useUpload(uploadResource, params, options)
export const useupdateResource = (params, options) => useUpdate(updateResource, ['Resources', params.id], params, options)
export const useremoveResource = (params, options) => useDelete(removeResource, params, options)
export const useremoveResources = (params, options) => useDelete(removeResources, params, options)

