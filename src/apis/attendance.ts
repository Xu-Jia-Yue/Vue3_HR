import { request } from '@/util/request'

// 获取考勤列表
export const getAttendancesList = (params: any) => {
  return request.get('/attendances', { params })
}

// 获取考勤详情
export const getAtteArchiveDetail = (data: any) => {
  return request.get(`/attendances/archive/${data.userId}/${data.yearMonth}`)
}

// 修改考勤数据
export const updateAttendance = (data: any) => {
  return request.put(`/attendances/${data.userId}`, data)
}

// 获取归档列表
export const getArchivingList = (params: any) => {
  return request.get('/attendances/reports/year', params)
}

// 获取具体归档
export const getArchivingCont = (params: any) => {
  return request.get(`/attendances/reports/${params.atteArchiveMonthlyId}`, params)
}

// 导入归档数据
export const importArchive = (data: any) => {
  return request.post('/archive/atte/export', data)
}

// 提醒接口
export const notify = () => {
  return request.post('/notify/mail')
}

// 存档
export const archives = (params: any) => {
  return request.get('/attendances/archives', params)
}

// 获取新报道
export const newReports = (params: any) => {
  return request.get('/attendances/newReports', params)
}

export const information = () => {
  return request({})
}

export const pay = () => {
  return request({})
}

export const reportFormList = (params: any) => {
  return request({
    url: '/attendances/reports',
    params
  })
}

// 请假保存
export const leaveSave = (data: any) => {
  return request({
    url: '/cfg/leave',
    method: 'post',
    data
  })
}
// 请假获取
export const getLeave = (data: any) => {
  return request({
    url: '/cfg/leave/list',
    method: 'get',
    params: data
  })
}

// 扣款设置保存
export const deductionsSave = (data: any) => {
  return request({
    url: '/cfg/deduction',
    method: 'post',
    data
  })
}

// 获取扣款设置
export const getDeductions = (data: any) => {
  return request({
    url: '/cfg/ded/list',
    params: data
  })
}

// 加班配置保存
export const overtimeSave = (data: any) => {
  return request({
    url: '/cfg/extDuty',
    method: 'put',
    data
  })
}

// 获取加班配置
export const getOvertime = (data: any) => {
  return request({
    url: '/cfg/extDuty/item',
    method: 'get',
    params: data
  })
}

// 考勤数据保存
export const attendanceSave = (data: any) => {
  return request({
    url: '/cfg/atte',
    method: 'put',
    data
  })
}

// 考勤数据保存
export const getAttendance = (data: any) => {
  return request({
    url: '/cfg/atte/item',
    method: 'get',
    params: data
  })
}

// 编辑文件
export const fileUpdate = (data: any) => {
  return request({
    url: `/employee/archives/${data.month}`,
    method: 'put',
    data
  })
}
