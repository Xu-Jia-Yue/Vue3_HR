import { request } from '@/util/request'

// 获取主页人员数据
export const getHomeDataService = () => {
  return request.get('/home/data')
}

// 获取主页消息
export const getMessageService = () => {
  return request.get('/home/notice')
}
