<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
const form: any = ref(null)
const router = useRouter()
const loginFormModel = ref({
  mobile: '13800000002',
  password: 'hm#qd@23!',
  isAgree: true
})

// 制定表单检验规则
const rules = {
  mobile: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 16,
      message: '密码长度应该为6-16位之间',
      trigger: 'blur'
    }
  ],
  isAgree: [
    {
      required: true,
      message: '请勾选用户平台协议',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: any, callback: Function) => {
        value ? callback() : callback(new Error('请勾选用户平台协议'))
      }
    }
  ]
}

// 登录
const send = async () => {
  await form.value?.validate()
  await userStore.setToken(loginFormModel.value)
  ElMessage.success('登录成功')
  router.push('/')
}
</script>

<template>
  <div class="login-container">
    <div class="logo"></div>
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <el-form ref="form" :model="loginFormModel" :rules="rules" size="large" autocomplete="off">
          <el-form-item prop="mobile">
            <el-input v-model="loginFormModel.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              name="password"
              v-model="loginFormModel.password"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginFormModel.isAgree"> 用户平台使用协议 </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 350px" type="primary" @click="send">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url('/src/assets/images/login_back.png') no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color: #606266;
    }
  }
}
</style>
