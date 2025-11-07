import service from "../../utils/api/service"

//获取3个大类和一级分类
export const getPostTypes = () => {
  return service.get('/community/types')
}
//搜索
export const getPosts = (params) => {
  return service.get('/community/search', { params })
}
//查看某个帖子
export const getPost = (id) => {
  return service.get(`/community/posts/${id}`)
}
//查看悬赏帖子
export const getBountyPosts = (params) => {
  return service.get('/community/posts/bounty', { params })
}
//查看普通帖子
export const getNormalPosts = (params) => {
  return service.get('/community/posts/normal', { params })
}
//查看帖子广场
export const getSquarePosts = (params) => {
  return service.get('/community/posts', { params })
}
//查看热门榜单
export const getHot = () => {
  return service.get('/community/hot')
}

//上传某个帖子
export const uploadPost = (data) => {
  return service.post('/community/posts', data);
}
//修改某个帖子
export const updatePost = (data) => {
  return service.put('/community/posts', data)
}
//删除某个帖子
export const removePost = (id) => {
  return service.delete(`/community/posts/${id}`,)
}
//批量删除帖子
export const removePosts = (data) => {
  return service.delete('/community/posts/batch', data)
}
