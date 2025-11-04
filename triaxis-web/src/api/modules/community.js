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
  return service.get(`/community/${id}`)
}
//上传某个帖子
export const uploadPost = (data) => {
  return service.post('/community', data);
}
//修改某个帖子
export const updatePost = (data) => {
  return service.put('/community', data)
}
//删除某个帖子
export const removePost = (id) => {
  return service.delete(`/community/${id}`,)
}
//批量删除帖子
export const removePosts = (data) => {
  return service.delete('/community/batch', data)
}
