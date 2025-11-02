import service from "../../utils/api/service"

//获取3个大类和一级分类
export const getResourceTypes = () => {
  return service.get('/resources/types')
}
//获取二级分类
export const getCategorySecondary = (params) => {
  return service.get('/resources/categories', { params })
}
//搜索
export const getResources = (params) => {
  return service.get('/resources/search', { params })
}
//查看某个资源
export const getResource = (id) => {
  return service.get(`/resources/${id}`)
}
//上传某个资源
export const uploadResource = (data) => {
  return service.post('/resources', data);
}
//修改某个资源
export const updateResource = (data) => {
  return service.put('/resources', data)
}
//删除某个资源
export const removeResource = (id) => {
  return service.delete(`/resources/${id}`,)
}
//批量删除资源
export const removeResources = (data) => {
  return service.delete('/resources/batch', data)
}
