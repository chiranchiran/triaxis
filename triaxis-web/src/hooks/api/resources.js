
import { getCategoryFirst, getResource, getResources, getResourceTypes, removeResource, removeResources, updateResource, uploadResource } from "../../api/modules/resources"
import { useDelete, useGet, useUpdate, useUpload } from "../common/useData"

export const useGetResourceTypes = useGet(getResourceTypes, params, options)
export const useGetCategoryFirst = useGet(getCategoryFirst, params, options)
export const useSearchResource = useGet(getResources, params, options)
export const useGetResource = useGet(getResource, params, options)
export const useuploadResource = useUpload(uploadResource, params, options)
export const useupdateResource = useUpdate(updateResource, params, options)
export const useremoveResource = useDelete(removeResource, params, options)
export const useremoveResources = useDelete(removeResources, params, options)


