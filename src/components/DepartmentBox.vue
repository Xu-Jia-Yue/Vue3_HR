<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDepartmentStore } from '@/stores/useDeparmentStore'
const deparmentStore = useDepartmentStore()
const checkList = ref()

onMounted(() => {
  deparmentStore.getDepartmentData()
})

const open = () => {
  return checkList.value
}
defineExpose({ open })
</script>

<template>
  <el-card class="checkBox">
    <el-row style="display: flex">
      <el-col :span="2" class="title">部门:</el-col>
      <el-col :span="22" class="group">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            class="check"
            v-for="i in deparmentStore.initData"
            :key="i.id"
            :label="i.name"
            :value="i.id"
          />
        </el-checkbox-group>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.checkBox {
  display: flex;
  margin: 10px auto;
  .title {
    margin: 5px auto;
    text-align: right;
    padding-right: 10px;
    font-weight: bold;
  }
}
</style>
