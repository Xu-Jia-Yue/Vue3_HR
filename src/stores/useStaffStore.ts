import { getStaffListService } from '@/apis/Staff'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useStaffStore = defineStore('staff', () => {
  const staffList = ref([])
  const total = ref(0)
  const loading = ref(false)

  // 获取员工列表
  const getStaffList = async (params: any) => {
    loading.value = true
    const { data } = await getStaffListService(params)
    staffList.value = data.data.rows
    total.value = data.data.total
    loading.value = false
  }

  return { loading, total, staffList, getStaffList }
})
