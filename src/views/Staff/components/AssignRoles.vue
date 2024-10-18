<script setup lang="ts">
import { editAssignRoleService, getRolesAssignService, getStaffInfoService } from '@/apis/Staff'
import { onMounted, ref } from 'vue'

const showDialog = ref(false)
const roleList: any = ref([])
const checkBoxList = ref([])
const rowId = ref()
const loading = ref(false)

// 对话框的显隐且暴露
const open = async (id: any) => {
  showDialog.value = true
  rowId.value = id
  loading.value = true
  const { data } = await getStaffInfoService(rowId.value)
  checkBoxList.value = data.data.roleIds
  loading.value = false
}

// 确定修改角色
const comfig = async () => {
  const { data } = await editAssignRoleService({ id: rowId.value, roleIds: checkBoxList.value })
  data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  showDialog.value = false
}

defineExpose({
  open
})

onMounted(async () => {
  const { data } = await getRolesAssignService()
  roleList.value = data.data
})
</script>

<template>
  <el-dialog v-model="showDialog" title="分配角色" width="800">
    <el-checkbox-group v-model="checkBoxList" v-loading="loading">
      <el-checkbox v-for="i in roleList" :key="i.id" :label="i.name" :value="i.id" />
    </el-checkbox-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="comfig"> 确定 </el-button>
        <el-button @click="showDialog = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
