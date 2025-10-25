import { apiConfigs } from "../../api/config"
import { getReviewReplies, getReviews } from "../../api/modules/reviews"
import { useApi } from "../common/useApi"
import { useUpload } from "../common/useData"

export const useGetReviews = (params = {}, options = {}) => {
  return useApi(getReviews, {
    queryKey: ['reviews', params.targetType, params.targetId, params.orderBy],
    config: apiConfigs.common.getView,
    params,
    isMutation: false,
    ...options
  })
}
export const useGetReviewReplies = (params = {}, options = {}) => {
  return useApi(getReviewReplies, {
    queryKey: ['reviews', 'replies', params.targetType, params.targetId, params.parentId],
    config: apiConfigs.common.getView,
    params,
    isMutation: false,
    ...options
  })
}
export const useAddReview = (params = {}, options = {}) => {
  return useUpload(getReviews, ['reviews', params.targetType, params.targetId], params, options)
}