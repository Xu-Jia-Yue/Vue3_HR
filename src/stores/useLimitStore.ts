import { getLimitDataService } from '@/apis/Limit'
import { transListToTreeData } from '@/util/transListToTreeData'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLimitStore = defineStore('limit', () => {
  const limitData = ref()
  const loading = ref()

  const getLimitData = async () => {
    loading.value = true
    const { data } = await getLimitDataService()
    limitData.value = transListToTreeData(data.data, 0)
    loading.value = false
  }

  return { loading, limitData, getLimitData }
})
