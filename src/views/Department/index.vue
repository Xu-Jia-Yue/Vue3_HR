<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useDepartmentStore } from '@/stores/useDeparmentStore'
import Dialog from './components/Dialog.vue'
import { delDepartmentService } from '@/apis/Organization'
import { start, close } from '@/util/nprogress'

const deparmentStore = useDepartmentStore()
const selectType = ref() // 操作类型
const dialogRef = ref() // 对话框对象

// 操作
const operating = async (type: any, id: any) => {
  selectType.value = type
  if (type === 'add' || type === 'edit') {
    dialogRef.value.open(type, id)
  } else {
    // 删除操作
    const { data } = await delDepartmentService(id)
    console.log(data)
    data.code === 10000 ? ElMessage.success(data.message) : ElMessage.error(data.message)
    deparmentStore.getDepartmentData()
  }
}

onMounted(async () => {
  start()
  deparmentStore.getDepartmentData()
  close()
})
</script>
<template>
  <div class="custom-tree-container">
    <el-tree
      :data="deparmentStore?.departmentData"
      default-expand-all
      class="content"
      v-loading="deparmentStore.loading"
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <span class="name">{{ data.name }}</span>
          <span class="manage">{{ data.managerName }}</span>
          <el-dropdown @command="operating($event, data.id)">
            <span class="el-dropdown-link">
              <span>操作</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="add"> 添加子部门</el-dropdown-item>
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>
      </template>
    </el-tree>
    <Dialog :title="selectType" ref="dialogRef"></Dialog>
  </div>
</template>

<style lang="scss">
.custom-tree-container {
  // 设置树形结构数据的高度
  .el-tree-node__content {
    height: 50px;
    padding-left: 50px !important;
  }
  .custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    .el-dropdown-link {
      display: inline-block;
      margin-right: 50px;
      padding: 10px;
      span {
        margin-right: 5px;
      }
    }
    .el-dropdown-link:focus {
      outline: none;
    }
    .manage {
      width: 100px;
      display: inline-block;
    }
    .name {
      flex: 6;
    }
  }
}
</style>
