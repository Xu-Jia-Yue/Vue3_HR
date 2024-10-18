<script setup lang="ts">
import { ref } from 'vue'
import { addRoleService } from '@/apis/Role'
import { useRoleStore } from '@/stores/useRoleStore'

const roleStore = useRoleStore()
const showDialog = ref(false)
const formRef = ref()
const pageParams = ref(1)

// 表单数据
const roleForm = ref({
  name: '',
  description: '',
  state: 0
})

// 表单规则
const rules = ref({
  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
})

// 添加角色
const comfig = async () => {
  await formRef.value?.validate()
  const { data } = await addRoleService(roleForm.value)
  data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  roleStore.getRoleList({ pagesize: 5, page: pageParams.value })
  showDialog.value = false
  clearForm()
}

// 取消
const cancel = () => {
  showDialog.value = false
  clearForm()
}

const clearForm = () => {
  roleForm.value.name = ''
  roleForm.value.description = ''
}

// 对话框的显隐且暴露
const open = async (page: any) => {
  showDialog.value = true
  pageParams.value = page
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog width="500px" title="新增角色" v-model="showDialog">
    <!-- 表单内容 -->
    <el-form label-width="120px" :model="roleForm" :rules="rules" ref="formRef">
      <el-form-item label="角色名称" prop="name">
        <el-input style="width: 300px" v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input type="textarea" :rows="3" style="width: 300px" v-model="roleForm.description" />
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="12" class="btns">
            <el-button type="primary" @click="comfig">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped>
.btns {
  display: flex;
}
</style>
