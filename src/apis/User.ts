import { request } from '@/util/request'

// 获取token
export const loginService = (data: any) => {
  return request.post('/sys/login', data)
}

// 获取用户数据
export const getUserInfoService = () => {
  return request.get('/sys/profile')
}

