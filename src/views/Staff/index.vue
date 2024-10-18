<script setup lang="ts">
import { useDepartmentStore } from '@/stores/useDeparmentStore'
import { useStaffStore } from '@/stores/useStaffStore'
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { delStaffService, exportStaffService } from '@/apis/Staff'
import FileSaver from 'file-saver'
import AssignRoles from './components/AssignRoles.vue'

const router = useRouter()
const departmentStore = useDepartmentStore()
const staffStore = useStaffStore()
const DialogRef = ref()

// 页码参数
const pageParams = ref({
  pagesize: 10,
  page: 1,
  keyword: '', // 模糊搜索
  departmentId: null
})

// 修改页码
const changePage = async (pageData: any) => {
  pageParams.value.page = pageData
  await staffStore.getStaffList(pageParams.value)
}

// 树形数据选择
const selectNode = (node: any) => {
  pageParams.value.departmentId = node.id
  staffStore.getStaffList(pageParams.value)
}

// 表格数据类型
const defaultProps = ref({
  label: 'name',
  children: 'children'
})

// 删除员工
const delSatff = async (id: string) => {
  const { data } = await delStaffService(id)
  data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
  staffStore.getStaffList(pageParams.value)
}

// 搜索
let timer: any = ref()
const search = (e: any) => {
  pageParams.value.keyword = e
  clearTimeout(timer.value) // 清除上一次定时器
  // 增加防抖减少搜索频率
  timer.value = setTimeout(() => {
    pageParams.value.page = 1
    staffStore.getStaffList(pageParams.value)
  }, 300)
}

//excel导出
const exportStaff = async () => {
  const result: any = await exportStaffService() // 导出所有的员工接口
  // 使用一个npm包 直接将blob文件下载到本地 file-saver
  // FileSaver.saveAs(blob对象,文件名称)
  FileSaver.saveAs(result, '员工信息表.xlsx') // 下载文件
}

onMounted(() => {
  departmentStore.getDepartmentData()
  staffStore.getStaffList(pageParams.value)
})
</script>
<template>
  <div class="staffContainer">
    <div class="app-container">
      <!-- 左侧树形结构 -->
      <div class="left">
        <el-input
          style="width: 100%; margin-bottom: 10px"
          placeholder="搜索员工"
          :prefix-icon="Search"
          v-model="pageParams.keyword"
          @input="search"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
          :data="departmentStore.departmentData"
        />
      </div>
      <!-- 右侧员工数据展示 -->
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button type="primary" @click="router.push('staff/detail')">添加员工</el-button>
          <el-button @click="exportStaff">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table
          :data="staffStore.staffList"
          v-loading="staffStore.loading"
          :row-style="{ height: '70px' }"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" align="center" width="100" />
          <el-table-column prop="mobile" label="手机号" sortable align="center" width="110" />
          <el-table-column prop="workNumber" label="工号" sortable align="center" width="110" />
          <el-table-column prop="formOfEmployment" label="聘用形式" align="center">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" align="center" width="100" />
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
            sortable
            align="center"
            width="110"
          />
          <el-table-column label="操作" width="230" align="center">
            <template v-slot="{ row }">
              <el-button size="small" type="success" @click="router.push(`staff/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button size="small" type="success" @click="DialogRef.open(row.id)"
                >角色</el-button
              >
              <el-popconfirm title="确认删除该员工吗？" @confirm="delSatff(row.id)">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            :page-size="pageParams.pagesize"
            :current-page="pageParams.page"
            :total="staffStore.total"
            layout="prev, pager, next"
            @current-change="changePage"
            background
            class="page"
          />
        </el-row>
      </div>
    </div>
  </div>
  <AssignRoles ref="DialogRef" />
</template>

<style lang="scss">
.staffContainer {
  // 设置树形结构数据的高度
  .el-tree-node__content {
    height: 40px;
  }
  .app-container {
    background: #fff;
    display: flex;
    .left {
      width: 280px;
      padding: 20px;
      border-right: 1px solid #eaeef4;
    }
    .right {
      flex: 1;
      padding: 20px;
      .opeate-tools {
        margin: 10px;
      }
      .username {
        height: 30px;
        width: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
        color: #fff;
        background: #04c9be;
        font-size: 12px;
        display: inline-block;
      }
    }
  }
}
</style>
