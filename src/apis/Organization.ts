import { request } from '@/util/request'

// 获取部门列表
export const getDepartmentService = () => {
  return request.get('/company/department')
}

// 获取负责人列表
export const getPrincipalService = () => {
  return request.get('/sys/user/simple')
}

// 新增部门
export const addDepartmentService = (data: any) => {
  return request.post('/company/department', data)
}

// 获取部门详情
export const getDetailService = (id: string) => {
  return request.get(`/company/department/${id}`)
}

// 修改部门
export const editDepartmentService = (id: string, data: any) => {
  return request.put(`/company/department/${id}`, data)
}

// 删除部门
export const delDepartmentService = (id: string) => {
  return request.delete(`/company/department/${id}`)
}
