import service from "../../utils/api/service"

//查看评论
export const getReviews = (params) => {
  return service.get("/reviews", { params })
}

export const getReviewReplies = (params) => {
  return service.get("/reviews/replies", { params })
}