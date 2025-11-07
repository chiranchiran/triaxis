
import { getBountyPosts, getHot, getNormalPosts, getPost, getPosts, getPostTypes, getSquarePosts, removePost, removePosts, updatePost, uploadPost } from "../../api/modules/community"
import { useDelete, useGet, useUpdate, useUpload } from "../common/useData"

export const useGetPostTypes = (options) => useGet(getPostTypes, ['community', 'types'], null, options)
export const useGetPosts = (params, options) => useGet(getPosts, ['community', 'posts', 'list', params], params, options)
export const useGetBountyPosts = (params, options) => useGet(getBountyPosts, ['community', 'bounty', 'list', params], params, options)
export const useGetNormalPosts = (params, options) => useGet(getNormalPosts, ['community', 'nomal', 'list', params], params, options)
//每5秒获取一次数据
export const useGetHot = (options) => useGet(getHot, ['community', 'hot'], null, {
  refetchInterval: 5000,
  refetchIntervalInBackground: true, ...options
})
export const useGetSquare = (params, options) => useGet(getSquarePosts, ['community', 'square', params.page, params.pageSize], params, {
  refetchInterval: 1000 * 60,
  refetchIntervalInBackground: true,
  ...options
})

export const useGetPost = (id, options) => useGet(getPost, ['community', 'posts', 'detail', id], id, options)
export const useUploadPost = (params, options) => useUpload(uploadPost, params, options)
export const useUpdatePost = (params, options) => useUpdate(updatePost, ['posts', params.id], params, options)
export const useRemovePost = (params, options) => useDelete(removePost, params, options)
export const useRemovePosts = (params, options) => useDelete(removePosts, params, options)

