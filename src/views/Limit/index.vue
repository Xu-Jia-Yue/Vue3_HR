<script setup lang="ts">
import { useLimitStore } from '@/stores/useLimitStore'
import { onMounted, ref } from 'vue'
import Dialog from './components/Dialog.vue'
import { delLimitService } from '@/apis/Limit'

const limitStore = useLimitStore()
const dialogRef = ref()

// 添加及编辑权限  title--对话框标题  row--选中的数据  type -- 区别行内/页面添加
const addEDit = async (title: string, row: any, type: any) => {
  await dialogRef.value.open(title, row, type)
}

// 删除权限
const delRow = async (rowId: string) => {
  const { data } = await delLimitService(rowId)
  limitStore.getLimitData()
  data.success ? ElMessage.success(data.message) : ElMessage.error(data.message)
}

onMounted(() => {
  limitStore.getLimitData()
})
</script>

<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="small" type="primary" @click="addEDit('新增', null, 1)"
        >添加权限</el-button
      >
      <el-table
        default-expand-all
        :data="limitStore.limitData"
        row-key="id"
        border
        v-loading="limitStore.loading"
        :header-cell-style="{ background: '#f5f6f8' }"
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="success"
              size="small"
              @click="addEDit('新增', row.id, 2)"
              >添加</el-button
            >
            <el-button size="small" type="success" @click="addEDit('编辑', row.id, 2)"
              >编辑</el-button
            >
            <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <Dialog ref="dialogRef" />
</template>

<style lang="scss" scoped>
.container {
  background: #fff;
  .btn-add {
    margin: 10px;
  }
}
</style>
