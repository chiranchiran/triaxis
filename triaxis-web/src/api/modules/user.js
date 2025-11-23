import service from "../../utils/api/service"

//登出
export const logout = (id) => {

  console.log(id)
  return service.post(`/user/logout/${id}`)
}
//获取个人信息
export const getUserProfile = () => {
  return service.get('/user/profile')
}
//获取资料卡片
export const getUserDetail = () => {
  return service.get('/user/detail')
}
//获取我的设置
export const getUserSettings = () => {
  return service.get('/user/settings')
}
//获取我的积分
export const getUserPoints = () => {
  return service.get('/user/points')
}
//获取我的会员
export const getUserVip = () => {
  return service.get('/user/vip')
}
//获取我的消息列表
export const getUserMessagesCount = (params) => {
  return service.get('/user/messages/count')
}
export const getUserMessagesLike = (params) => {
  return service.get('/user/messages/like', { params })
}
export const getUserMessagesCollect = (params) => {
  return service.get('/user/messages/collect', { params })
}
export const getUserMessagesReview = (params) => {
  return service.get('/user/messages/review', { params })
}
export const getUserMessagesSystem = (params) => {
  return service.get('/user/messages/system', { params })
}
//获取我的聊天列表
export const getUserChats = () => {
  return service.get('/user/chats')
}
//获取单个聊天记录
export const getUserChat = (id) => {
  return service.get(`/user/chat/${id}`)
}
//发送消息
export const sendChat = (data) => {
  return service.post(`/user/chat`, data)
}

export const updateProfile = (data) => {
  return service.put('/user/info', data)
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