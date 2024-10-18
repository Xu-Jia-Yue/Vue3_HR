import { getDepartmentService, getPrincipalService } from './../apis/Organization'
import { transListToTreeData } from '@/util/transListToTreeData'

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDepartmentStore = defineStore('department', () => {
  const departmentData = ref()
  const principalData = ref()
  const initData = ref()
  const loading = ref(false)

  // 获取部门数据
  const getDepartmentData = async () => {
    loading.value = true
    const { data } = await getDepartmentService()
    const arr = data.data.map((item: any) => {
      return {
        ...item,
        managerName: item.managerName.replace('黑马', '')
      }
    })
    departmentData.value = transListToTreeData(arr, 0)
    initData.value = arr
    loading.value = false
  }

  // 获取负责人数据
  const getPrincipalData = async () => {
    const { data } = await getPrincipalService()
    principalData.value = data.data.map((item: any) => {
      return { id: item.id, username: item.username.replace('黑马', '') }
    })
  }

  return { loading, initData, departmentData, principalData, getPrincipalData, getDepartmentData }
})
