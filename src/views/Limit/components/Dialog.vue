<script setup lang="ts">
import { addLimitService, editLimitService, getLimitDetailService } from '@/apis/Limit'
import { useLimitStore } from '@/stores/useLimitStore'
import { ref } from 'vue'

const title = ref() // 弹框标题
const rowID = ref()
const showDialog = ref(false)
const limitStore = useLimitStore()

// 权限数据
const formData = ref({
  name: '',
  code: '',
  description: '',
  enVisible: '',
  pid: '0',
  type: '1'
})

// 规则
const rules = ref({
  name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
})

// 取消
const cancel = () => {
  showDialog.value = false
  clearData()
}

// 添加/修改
const comfig = async () => {
  if (formData.value.type === '1') {
    // 页面添加
    const { data } = await addLimitService(formData.value)
    limitStore.getLimitData()
    clearData()
    data.success ? ElMessage.success(data.message) : ElMessage.error(data.message)
  } else {
    if (title.value === '新增') {
      const { data } = await addLimitService(formData.value)
      limitStore.getLimitData()
      data.success ? ElMessage.success(data.message) : ElMessage.error(data.message)
    } else {
      // 编辑
      const { data } = await editLimitService(rowID.value, formData.value)
      limitStore.getLimitData()
      data.success ? ElMessage.success(data.message) : ElMessage.error(data.message)
    }
  }
  showDialog.value = false
}

// 清除数据
const clearData = () => {
  formData.value.name = ''
  formData.value.code = ''
  formData.value.description = ''
  formData.value.enVisible = ''
}

// 暴露显隐 并获取权限详情
const open = async (DialogTitlle: string, rowId: any, type: any) => {
  if (rowId) {
    rowID.value = rowId
    if (DialogTitlle === '新增') {
      formData.value.pid = rowId
      formData.value.type = type
    } else {
      const { data } = await getLimitDetailService(rowId)
      formData.value = { ...data.data, type }
    }
  }
  title.value = DialogTitlle
  showDialog.value = true
}

defineExpose({
  open
})
</script>

<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="`${title}权限点`" v-model="showDialog" :show-close="false" @close="cancel">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width: 90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width: 90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width: 90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="comfig">确定</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
