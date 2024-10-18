<script setup lang="ts">
import { Delete, Edit } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRoleStore } from '@/stores/useRoleStore'
import Dialog from './components/Dialog.vue'
import RoleDialog from './components/RoleDialog.vue'
import { delRoleService, editRoleService, getRoleDetailService } from '@/apis/Role'
import { start, close } from '@/util/nprogress'

const DialogRef = ref()
const RoleDialogRef = ref()
const roleStore = useRoleStore()
const isEdit = ref()
// 页码参数
const pageParams = ref({
  pagesize: 7,
  page: 1
})

// 修改的参数
const editParams = ref({
  id: '',
  name: '',
  description: '',
  permIds: [],
  state: ''
})

// 更改页码
const changePage = async (pageData: any) => {
  pageParams.value.page = pageData
  await roleStore.getRoleList(pageParams.value)
}

// 添加角色
const addRole = async () => {
  DialogRef.value.open(pageParams.value.page)
}

// 删除角色
const confirmDel = async (id: string) => {
  const { data } = await delRoleService(id)
  data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  roleStore.getRoleList(pageParams.value)
}

// 编辑角色
const editRole = async (row: any) => {
  isEdit.value = row.id
  clearForm()
  const { data } = await getRoleDetailService(row.id)
  editParams.value = { ...data.data }
  console.log(data.data)
}

// 确定编辑
const yesEdit = async () => {
  const { data } = await editRoleService(editParams.value.id, editParams.value)
  data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  await roleStore.getRoleList(pageParams.value)
  isEdit.value = 0
}

// 取消编辑
const cancelEdit = () => {
  isEdit.value = 0
}

// 清除修改的参数
const clearForm = () => {
  editParams.value.name = ''
  editParams.value.state = ''
  editParams.value.description = ''
}

// 格式化表单数据序号
const Nindex = (index: any) => {
  return index + 1 + (pageParams.value.page - 1) * pageParams.value.pagesize
}

onMounted(async () => {
  start()
  await roleStore.getRoleList(pageParams.value)
  close()
})
</script>

<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button type="primary" @click="addRole">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table
        :data="roleStore.roleList"
        border
        :header-cell-style="{ background: '#f5f6f8' }"
        width="80%"
        v-loading="roleStore.loading"
      >
        <el-table-column type="index" :index="Nindex" align="center" width="100" label="序号" />
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template v-slot="{ row }">
            <el-input v-if="row.id === isEdit" size="small" v-model="editParams.name" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <template v-slot="{ row }">
            <el-switch
              v-if="row.id === isEdit"
              v-model="editParams.state"
              :active-value="1"
              :inactive-value="0"
            />
            <span v-else>
              {{ row.state === 1 ? '已启用' : row.state === 0 ? '未启用' : '无' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input
              v-if="row.id === isEdit"
              type="textarea"
              size="small"
              v-model="editParams.description"
            />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="center" align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 编辑状态 -->
            <template v-if="row.id === isEdit">
              <el-button type="primary" @click="yesEdit">确定</el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </template>
            <!-- 正常状态 -->
            <template v-else>
              <el-button size="small" type="success" @click="RoleDialogRef.open(row.id)">
                分配权限
              </el-button>
              <el-button type="primary" :icon="Edit" circle @click="editRole(row)" />
              <el-popconfirm title="确定删除吗？" @confirm="confirmDel(row.id)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle />
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="roleStore.total"
          layout="prev, pager, next"
          @current-change="changePage"
          background
          class="page"
        />
      </el-row>
    </div>
  </div>
  <Dialog ref="DialogRef" />
  <RoleDialog ref="RoleDialogRef" />
</template>

<style lang="scss" scoped>
.app-container {
  background-color: white;
  .role-operate {
    padding: 15px;
  }
  .page {
    margin: 10px auto;
  }
}
</style>
