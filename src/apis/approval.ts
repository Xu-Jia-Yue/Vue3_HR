import { request } from '@/util/request'

export function getApprovalList(params: any) {
  return request({
    url: `/user/process/instance/${params.page}/${params.pageSize}`,
    params
  })
}

// 获取审批信息
export function getInformation(id: any) {
  return request({
    url: `/user/process/instance/getById/${id}`
  })
}

// 获取审批详情
export function getApprovalsDetail(id: any) {
  return request({
    url: `/user/process/instance/${id}`
  })
}

// 获取流程详情
export function getApprovalsTaskDetail(id: any) {
  return request({
    url: `/user/process/instance/tasks/detail/${id}`
  })
}
