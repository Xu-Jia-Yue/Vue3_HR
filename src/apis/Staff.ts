import { request } from '@/util/request'

// 获取员工数据
export const getStaffListService = (data: any) => {
  return request.get('/sys/user', { params: data })
}

// 新增员工
export const addStaffService = (data: any) => {
  return request.post('/sys/user', data)
}

// 删除员工
export const delStaffService = (id: string) => {
  return request.delete(`/sys/user/${id}`)
}

// 获取员工基本信息
export const getStaffInfoService = (id: any) => {
  return request.get(`/sys/user/${id}`)
}

// 更新员工信息
export const editStaffInfoService = (id: any, data: any) => {
  return request.put(`/sys/user/${id}`, data)
}

// 导出员工excel
export const exportStaffService = () => {
  return request({
    url: '/sys/user/export',
    // 改变接收数据的类型
    responseType: 'blob' // 使用blob接收二进制文件流
  })
}

// 获取分配的角色列表
export const getRolesAssignService = () => {
  return request.get('/sys/role/list/enabled')
}

// 修改分配的角色
export const editAssignRoleService = (data: any) => {
  return request.put('/sys/user/assignRoles', data)
}
