
import { getPost, getPosts, getPostTypes, removePost, removePosts, updatePost, uploadPost } from "../../api/modules/community"
import { useDelete, useGet, useUpdate, useUpload } from "../common/useData"

export const useGetPostTypes = (options) => useGet(getPostTypes, ['posts', 'types'], null, options)
export const useGetPosts = (params, options) => useGet(getPosts, ['posts', 'list', params], params, options)
export const useGetPost = (id, options) => useGet(getPost, ['posts', 'detail', id], id, options)
export const useUploadPost = (params, options) => useUpload(uploadPost, params, options)
export const useUpdatePost = (params, options) => useUpdate(updatePost, ['posts', params.id], params, options)
export const useRemovePost = (params, options) => useDelete(removePost, params, options)
export const useRemovePosts = (params, options) => useDelete(removePosts, params, options)

