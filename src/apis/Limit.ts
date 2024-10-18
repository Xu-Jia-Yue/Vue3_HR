import { request } from '@/util/request'

// 获取权限数据
export const getLimitDataService = () => {
  return request.get('/sys/permission')
}

// 增加权限
export const addLimitService = (data: any) => {
  return request.post('/sys/permission', data)
}

// 删除权限
export const delLimitService = (id: string) => {
  return request.delete(`/sys/permission/${id}`)
}

// 修改权限
export const editLimitService = (id: string, data: any) => {
  return request.put(`/sys/permission/${id}`, data)
}

// 获取权限详情
export const getLimitDetailService = (id: string) => {
  return request.get(`/sys/permission/${id}`)
}
