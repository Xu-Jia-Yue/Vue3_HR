import { request } from '@/util/request'

export function getSalarysList(data: any) {
  return request({
    url: '/salarys/list',
    data,
    method: 'post'
  })
}

export function getEmployeeList(params: any) {
  return request({
    url: '/sys/user',
    params: {
      page: 1,
      pageSize: 10,
      total: 0,
      departmentChecks: [3, 4]
    }
  })
}

// 保存更新
export function saveSettings(data: any) {
  return request({
    url: '/salarys/settings',
    method: 'post',
    data
  })
}

// 获取工资报表
export function getArchivingCont(params: any) {
  return request({
    url: `/salarys/reports/${params.yearMonth}`,
    params
  })
}
