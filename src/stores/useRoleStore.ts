import { getRoleService } from '@/apis/Role'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useRoleStore = defineStore('Role', () => {
  const roleList = ref()
  const total = ref(0)
  const loading = ref(false)

  // 获取角色列表
  const getRoleList = async (params: any) => {
    loading.value = true
    const { data } = await getRoleService(params)
    roleList.value = data.data.rows
    total.value = data.data.total
    loading.value = false
  }
  return { loading, total, roleList, getRoleList }
})
