import router from '@/router'
import { useUserStore } from '@/stores/useUserStore'
import axios from 'axios'
export const baseURL = '/api'
export const request = axios.create({
  timeout: 20000,
  baseURL
})

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    const userInfoStore = useUserStore()
    if (userInfoStore.token) {
      // 登录后设置header参数
      config.headers.Authorization = `Bearer ${userInfoStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  (config: any) => {
    if (config.data instanceof Blob) {
      return config.data
    }
    return config
  },
  (error) => {
    // 处理401错误
    if (error.response?.status === 401) {
      ElMessage({ type: 'warning', message: '登录失效,请重新登录' })
      router.push('/login')
      return Promise.reject(error)
    }
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)
