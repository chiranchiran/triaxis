import service from "../../utils/api/service"

//登出
export const logout = (data) => {
  return service.post('/user/logout', data)
}
export const getCurrentUser = () => {
  return service.get('/user/info')
}

export const updateProfile = (data) => {
  return service.put('/user/info', data)
}

export const getUserStats = () => {
  return service.get('/user/stats')
}

// 我的资源
export const getMyUploadedResources = (params) => {
  return service.get('/user/resources/uploaded', { params })
}

export const getMyFavoriteResources = (params) => {
  return service.get('/user/resources/favorites', { params })
}

// 我的课程
export const getMyUploadedCourses = (params) => {
  return service.get('/user/courses/uploaded', { params })
}

export const getMyFavoriteCourses = (params) => {
  return service.get('/user/courses/favorites', { params })
}

// 收藏功能
export const getFavoriteFolders = () => {
  return service.get('/user/favorites/folders')
}

export const createFavoriteFolder = (data) => {
  return service.post('/user/favorites/folders', data)
}

export const addFavorite = (data) => {
  return service.post('/user/favorites/items', data)
}

export const removeFavorite = (itemType, itemId) => {
  return service.delete('/user/favorites/items', {
    params: { itemType, itemId }
  })
}

// 会员和积分
export const getMembershipInfo = () => {
  return service.get('/user/membership')
}

export const getPointsInfo = () => {
  return service.get('/user/points')
}
//@chiran忘记密码