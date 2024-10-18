<script setup lang="ts">
import { useDepartmentStore } from '@/stores/useDeparmentStore'
import { onMounted, ref } from 'vue'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const departmentStore = useDepartmentStore()
const props = ref({
  label: 'name', // 要展示的字段
  value: 'id' // 要存储的字段
})

// 输出正确的部门ID
const changeValue = (list: any) => {
  if (list.length > 0) {
    emit('update:modelValue', list[list.length - 1])
  } else {
    emit('update:modelValue', null)
  }
}

onMounted(() => {
  departmentStore.getDepartmentData()
})
</script>

<template>
  <el-cascader
    :value="modelValue"
    size="small"
    :options="departmentStore.departmentData"
    :props="props"
    separator="-"
    @change="changeValue"
  />
</template>

<style lang="scss" scoped></style>
