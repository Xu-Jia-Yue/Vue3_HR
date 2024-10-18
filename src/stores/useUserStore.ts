import { ref } from 'vue'
import { defineStore } from 'pinia'
import { loginService, getUserInfoService } from '@/apis/User'

export const useUserStore = defineStore(
  'User',
  () => {
    const token = ref(localStorage.getItem('token'))
    const userInfo = ref()

    // 获取token
    const setToken = async (dataParams: any) => {
      const { data } = await loginService(dataParams)
      token.value = data.data
    }

    // 获取用户数据
    const setUserInfo = async () => {
      const { data } = await getUserInfoService()
      userInfo.value = data.data
    }

    // 退出登录
    const quitLogin = () => {
      token.value = ''
      userInfo.value = ''
    }

    return { token, userInfo, setToken, setUserInfo, quitLogin }
  },
  {
    persist: true
  }
)
