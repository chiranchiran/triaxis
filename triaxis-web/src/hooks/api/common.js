import { uploadResource } from "../../api/modules/resources"
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