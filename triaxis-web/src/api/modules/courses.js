import service from "../../utils/api/service"

//获取3个大类
export const getCourseTypes = () => {
  return service.get('/courses/types',)
}

//搜索
export const getCourses = (data) => {
  return service.get('/courses/search', { params: data })
}
//查看某个课程
export const getCourse = (id) => {
  return service.get(`/courses/${id}`)
}
//上传某个课程
export const uploadCourse = (data) => {
  return service.post('/courses', data)
}
//修改某个课程
export const updateCourse = (data) => {
  return service.put('/courses', data)
}
//删除某个课程
export const removeCourse = (id) => {
  return service.delete(`/courses/${id}`,)
}
//批量删除课程
export const removeCourses = (data) => {
  return service.delete('/courses/batch', data)
}
// 点赞/取消点赞课程
export const likeCourse = (id, userId) => {
  return service.post(`/courses/${id}/like`, null, {
    params: { userId }
  })
}
// 获取课程评价列表
export const getCourseReviews = (courseId, params = {}) => {
  return service.get(`/courses/${courseId}/reviews`, { params })
}

// 添加课程评价
export const addCourseReview = (courseId, data, userId) => {
  return service.post(`/courses/${courseId}/reviews`, data, {
    params: { userId }
  })
}

// 删除课程评价
export const removeCourseReview = (courseId, reviewId, userId) => {
  return service.delete(`/courses/${courseId}/reviews/${reviewId}`, {
    params: { userId }
  })
}

// 点赞/取消点赞课程评价
export const likeCourseReview = (courseId, reviewId, userId) => {
  return service.post(`/courses/${courseId}/reviews/${reviewId}/like`, null, {
    params: { userId }
  })
}