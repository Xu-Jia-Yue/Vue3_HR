import { request } from '@/util/request'

// 获取角色列表
export const getRoleService = (data: any) => {
  return request.get('/sys/role', { params: data })
}

// 新增角色
export const addRoleService = (data: any) => {
  return request.post('/sys/role', data)
}

// 删除角色
export const delRoleService = (id: string) => {
  return request.delete(`/sys/role/${id}`)
}

// 获取角色详情
export const getRoleDetailService = (id: string) => {
  return request.get(`/sys/role/${id}`)
}

// 修改角色信息
export const editRoleService = (id: string, data: any) => {
  return request.put(`/sys/role/${id}`, data)
}

// 分配权限
export const assignPermSerice = (data: any) => {
  return request.put('/sys/role/assignPrem', data)
}
