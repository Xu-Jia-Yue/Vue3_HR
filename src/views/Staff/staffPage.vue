<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SelectTree from './components/selectTree.vue'
import { addStaffService, editStaffInfoService, getStaffInfoService } from '@/apis/Staff'

const router = useRouter()
const route = useRoute()
const userForm = ref()
const userInfo = ref({
  username: '',
  mobile: '',
  workNumber: '',
  formOfEmployment: null,
  departmentId: null,
  timeOfEntry: '',
  correctionTime: '',
  staffPhoto: ''
})

// 表单规则
const rules = ref({
  username: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      min: 1,
      max: 4,
      message: '用户名为1-4位'
    },
    {
      pattern: '^[\u4e00-\u9fa5]{2,5}$',
      message: '用户名应该为2-4位中文',
      trigger: 'blur'
    }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
  timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
  correctionTime: [
    { required: true, message: '请选择转正时间', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (userInfo.value.timeOfEntry) {
          if (new Date(userInfo.value.timeOfEntry) > new Date(value)) {
            callback(new Error('转正时间不能小于入职时间'))
            return
          }
        }
        callback()
      }
    }
  ]
})

// 保存更新
const save = async () => {
  await userForm.value?.validate()
  if (!route.params.id) {
    const { data } = await addStaffService(userInfo.value)
    data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  } else {
    const { data } = await editStaffInfoService(route.params.id, userInfo.value)
    data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  }
  router.push('/staff')
}

onMounted(async () => {
  // 判断是编辑还是新增
  if (route.params.id) {
    const { data } = await getStaffInfoService(route.params.id)
    userInfo.value = { ...data.data }
  }
})
</script>

<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input v-model="userInfo.workNumber" disabled class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="userInfo.mobile" :disabled="!!$route.params.id" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <SelectTree v-model="userInfo.departmentId" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" class="inputW">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userInfo.timeOfEntry"
                  type="date"
                  class="inputW"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  v-model="userInfo.correctionTime"
                  type="date"
                  class="inputW"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left: 220px">
              <el-button type="primary" @click="save">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px;
  }
}
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>
