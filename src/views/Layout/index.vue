<script setup lang="ts">
import {
  HomeFilled,
  User,
  SwitchButton,
  SetUp,
  Menu,
  Reading,
  Avatar,
  Lock,
  FolderChecked,
  Coin,
  Stamp,
  Switch
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import avatar from '@/assets/images/default.png'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isCollapse = ref(false) //侧边栏收缩

const toggleCollaps = () => {
  isCollapse.value = !isCollapse.value
}

// 退出登录
const onCommand = async (path: string) => {
  if (path === '/login') {
    await userStore.quitLogin()
    router.replace(path)
    ElMessage.success('登出成功')
  } else {
    router.replace(path)
  }
}

// 路由路径格式化
const pathFormat = (path: string) => {
  const pathName: any = {
    role: '角色',
    staff: '员工',
    limit: '权限',
    attendance: '考勤',
    security: '社保',
    examine: '审批',
    salary: '工资',
    organization: '组织',
    detail: '添加 / 查看员工',
    leaveApproval: '请假申请',
    quitApproval: '离职申请',
    overtimeApproval: '加班申请',
    setting: '工资调整',
    report: '工资报表',
    securityList: '社保报表'
  }
  return pathName[path]
}

// 检测是否登录
onMounted(() => {
  if (!userStore.token) {
    router.replace('/login')
    ElMessage.error('请先登录')
  }
  userStore.setUserInfo()
})
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside class="asideMenu">
      <!-- 侧边栏菜单 -->
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        class="el-menu-vertical-demo"
        text-color="rgb(167, 172, 186)"
        active-text-color="white"
        collapse-transition
        background-color="rgb(0, 22, 42)"
        router
        style="border: none"
        :unique-opened="false"
        mode="vertical"
      >
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="" />
        </div>
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/organization">
          <el-icon><Menu /></el-icon>
          <template #title>组织</template>
        </el-menu-item>
        <el-menu-item index="/role">
          <el-icon><SetUp /></el-icon>
          <template #title>角色</template>
        </el-menu-item>
        <el-menu-item index="/staff">
          <el-icon><Avatar /></el-icon>
          <template #title>员工</template>
        </el-menu-item>
        <el-menu-item index="/limit">
          <el-icon><Lock /></el-icon>
          <template #title>权限</template>
        </el-menu-item>
        <el-menu-item index="/attendance">
          <el-icon><Reading /></el-icon>
          <template #title>考勤</template>
        </el-menu-item>
        <el-menu-item index="/examine">
          <el-icon><FolderChecked /></el-icon>
          <template #title>审批</template>
        </el-menu-item>
        <el-menu-item index="/salary">
          <el-icon><Coin /></el-icon>
          <template #title>工资</template>
        </el-menu-item>
        <el-menu-item index="/security">
          <el-icon><Stamp /></el-icon>
          <template #title>社保</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 二级路由 -->
    <el-container class="container">
      <el-header style="height: 47px">
        <!-- 面包屑导航 -->
        <div class="Breadcrumb">
          <div class="toggleMenu" @click="toggleCollaps">
            <el-icon><Switch /></el-icon>
          </div>
          <el-breadcrumb separator="/" class="breadNav">
            <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.path.split('/')[1] !== 'home'">
              <span v-if="route.path.split('/').length < 3">
                {{ pathFormat(route.path.split('/')[route.path.split('/').length - 1]) }}
              </span>
              <span v-if="route.path.split('/').length == 3">
                {{ pathFormat(route.path.split('/')[route.path.split('/').length - 1]) }}
              </span>
              <span v-if="route.path.split('/').length == 4">
                {{ pathFormat(route.path.split('/')[route.path.split('/').length - 2]) }}
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 头像及下拉菜单 -->
        <el-dropdown placement="bottom-end" @command="onCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.userInfo?.staffPhoto || avatar" />
            <div class="userName">{{ userStore.userInfo?.username || '铁子' }}</div>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/home" :icon="User">首页</el-dropdown-item>
              <el-dropdown-item command="/login" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main style="background-color: rgb(245, 245, 245); padding: 10px">
        <RouterView />
      </el-main>
      <el-footer style="height: 35px">HR后台管理系统 ©2024 Created by XuJiaYue</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  padding: 2px;
  height: 100vh;
  .asideMenu {
    width: auto;
    border-radius: 10px 0px 0px 10px;
    background-color: rgb(0, 22, 42);
    color: white;
    .el-menu-item.is-active,
    .el-menu-item:hover {
      background: linear-gradient(
        to right,
        rgba(31, 80, 218, 0.9) 0%,
        rgba(26, 51, 142, 0.7) 50%,
        rgba(19, 33, 75, 0.1) 100%
      );
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
    }
    .logo {
      img {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .Breadcrumb {
      display: flex;
      align-items: center;
      font-size: 27px;
      .toggleMenu {
        cursor: pointer;
        padding: 10px;
        margin-right: 15px;
        font-size: 20px;
      }
      .toggleMenu:hover {
        background-color: rgb(249, 249, 249);
      }
    }
    .el-dropdown__box {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:active,
      &:focus {
        outline: none;
      }
      .userName {
        margin-left: 10px;
        font-size: 18px;
        color: black;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
