<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  addDepartmentService,
  editDepartmentService,
  getDepartmentService,
  getDetailService
} from '@/apis/Organization'
import { useDepartmentStore } from '@/stores/useDeparmentStore'

const deparmentStore = useDepartmentStore()
const myProps = defineProps(['title'])
const dialogVisible = ref(false) // 对话框显隐
const formRef = ref() // 表单对象
const pid = ref() // 当前部门id

// 表单数据
let formData = reactive({
  code: '',
  introduce: '',
  managerId: '',
  name: '',
  pid: ''
})
//
// 修改的数据 -- 由于接口返回数据跟表单数据不同由此建立
const DataEdit = ref()

// 表单规则
const rules = ref({
  code: [
    { required: true, message: '部门编码不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '部门编码的长度为2-10个字符',
      trigger: 'blur'
    },
    {
      trigger: 'blur',
      validator: async (rule: any, value: any, callback: any) => {
        if (myProps.title === 'add') {
          const { data } = await getDepartmentService()
          if (data.data.some((item: any) => item.code === value)) {
            callback(new Error('部门中已经有该编码了'))
          } else {
            callback()
          }
        }
      }
    }
  ],
  introduce: [
    { required: true, message: '部门介绍不能为空', trigger: 'blur' },
    {
      min: 1,
      max: 100,
      message: '部门介绍的长度为1-100个字符',
      trigger: 'blur'
    }
  ],
  managerId: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '部门名称的长度为2-10个字符',
      trigger: 'blur'
    },
    {
      trigger: 'blur',
      validator: async (rule: any, value: any, callback: any) => {
        if (myProps.title === 'add') {
          const { data } = await getDepartmentService()
          if (data.data.some((item: any) => item.name === value)) {
            callback(new Error('部门中已经有该名称了'))
          } else {
            callback()
          }
        }
      }
    }
  ]
})

// 提交数据
const comfig = async () => {
  await formRef.value?.validate()
  //增加部门
  if (myProps.title === 'add') {
    console.log(formData)

    const { data } = await addDepartmentService({ ...formData, pid: pid.value })
    data.code === 10000 ? ElMessage.success(data.message) : ElMessage.error(data.message)
    clearFormData()
  } else if (myProps.title === 'edit') {
    // 编辑部门
    const { data } = await editDepartmentService(pid.value, {
      ...DataEdit.value,
      code: formData.code,
      introduce: formData.introduce,
      managerId: formData.managerId,
      name: formData.name
    })
    data.code === 10000 ? ElMessage.success(data.message) : ElMessage.error(data.message)
    clearFormData()
  }
  deparmentStore.getDepartmentData()
  dialogVisible.value = false
}

const cancel = () => {
  dialogVisible.value = false
  clearFormData()
}

const clearFormData = () => {
  formData.code = ''
  formData.introduce = ''
  formData.managerId = ''
  formData.name = ''
  formData.pid = ''
}

// 控制显隐并暴露
const open = async (type: string, id: string) => {
  clearFormData()
  dialogVisible.value = true
  pid.value = id
  if (type === 'edit') {
    const {
      data: { data }
    } = await getDetailService(pid.value)
    DataEdit.value = data
    formData.code = data.code
    formData.name = data.name
    formData.introduce = data.introduce
    formData.managerId = data.managerId
  }
}
defineExpose({
  open
})

onMounted(async () => {
  deparmentStore.getPrincipalData()
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="myProps.title === 'add' ? '新增部门' : '编辑部门'"
    width="600"
    draggable
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input
          v-model="formData.name"
          placeholder="2-10个字符"
          style="width: 80%"
          size="small"
        />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input
          v-model="formData.code"
          placeholder="2-10个字符"
          style="width: 80%"
          size="small"
        />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%">
          <el-option
            v-for="item in deparmentStore.principalData"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          v-model="formData.introduce"
          placeholder="1-100个字符"
          type="textarea"
          size="small"
          :rows="4"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row>
          <el-col :span="12" class="btns">
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="comfig">确定</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped>
.btns {
  display: flex;
  align-items: center;
}
</style>
