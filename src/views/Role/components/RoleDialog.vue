<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getLimitDataService } from '@/apis/Limit'
import { assignPermSerice, getRoleDetailService } from '@/apis/Role'

const showDialog = ref(false)
const rowId = ref()
const limitData: any = ref([])
const permIdList = ref([])
const loading = ref()

const comfig = async () => {
  const { data } = await assignPermSerice({ id: rowId.value, permIds: permIdList.value })
  data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  showDialog.value = false
}

// 对话框的显隐且暴露
const open = async (id: string) => {
  showDialog.value = true
  rowId.value = id
  loading.value = true
  const { data } = await getRoleDetailService(id)
  permIdList.value = data.data.permIds
  loading.value = false
}
defineExpose({
  open
})

onMounted(async () => {
  const { data } = await getLimitDataService()
  limitData.value = data.data
})
</script>

<template>
  <el-dialog v-model="showDialog" title="分配权限" width="800">
    <el-checkbox-group v-model="permIdList" v-loading="loading">
      <el-row>
        <el-col :span="24">
          <el-checkbox
            class="check"
            v-for="i in limitData"
            :key="i.id"
            :label="i.name"
            :value="i.id"
        /></el-col>
      </el-row>
    </el-checkbox-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="comfig"> 确定 </el-button>
        <el-button @click="showDialog = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.check{
  display: flex;
  padding: 20px 10px;
}
</style>
