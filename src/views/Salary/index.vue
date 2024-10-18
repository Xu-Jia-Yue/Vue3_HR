<script setup lang="ts">
import { getEmployeeList } from '@/apis/Salary'
import PageTools from '@/components/PageTools.vue'
import { useDepartmentStore } from '@/stores/useDeparmentStore'
import { onMounted, reactive, ref } from 'vue'

const deparmentStore = useDepartmentStore()
const loading = ref(false)
const salaryList = ref([])

const formData = reactive({
  approvalsTypeChecks: [],
  approvalsStateChecks: [],
  departmentChecks: []
})

// 聘请类型
const approvalsType = ref([
  {
    id: 1,
    value: '正式'
  },
  {
    id: 2,
    value: '非正式'
  }
])

// 状况
const approvalsState = ref([
  {
    id: 1,
    value: '在职'
  },
  {
    id: 2,
    value: '离职'
  }
])

const page = ref({
  total: 0,
  page: 1,
  pageSize: 10
})

// 格式化聘请格式
const formatEmployment = (row: any) => {
  const data = approvalsType.value.find((item) => item.id == row.formOfEmployment.toString())
  return data ? data.value : '未知'
}

// 随机返回金额
const getMoney = () => {
  return [3000, 5000, 6000, 8000, 10000, 12000, 15000, 16000][Math.floor(Math.random() * 8)]
}

const changeParams = () => {
  page.value.page = 1
  getEmployeeData()
}

const changePage = (pageData: any) => {
  page.value.page = pageData
  getEmployeeData()
}

const getEmployeeData = async () => {
  loading.value = true
  const { data } = await getEmployeeList({
    ...page.value,
    ...formData
  })
  salaryList.value = data.data.rows
  page.value.total = data.data.total
  loading.value = false
}

// 格式化表单数据序号
const Nindex = (index: any) => {
  return index + 1 + (page.value.page - 1) * page.value.pageSize
}

onMounted(() => {
  deparmentStore.getDepartmentData()
  getEmployeeData()
})
</script>

<template>
  <div class="container">
    <!-- 工具栏 -->
    <PageTools beforeShow="false" afterShow="true">
      <template v-slot:after>
        <el-button size="small" @click="$router.push('/salarys/setting')">设置</el-button>
        <el-button size="small" type="primary" @click="$router.push('/salarys/report')">2024报表</el-button>
      </template>
    </PageTools>
    <!-- 条件筛选 -->
    <el-card class="hr-block">
      <el-form label-width="120px">
        <el-form-item label="聘用形式:">
          <el-checkbox-group v-model="formData.approvalsTypeChecks">
            <el-checkbox
              v-for="item in approvalsType"
              :key="item.id"
              :value="item.id"
              :label="item.value"
              @change="changeParams"
              >{{ item.value }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="员工状态:">
          <el-checkbox-group v-model="formData.approvalsStateChecks">
            <el-checkbox
              v-for="item in approvalsState"
              :key="item.id"
              :value="item.id"
              :label="item.value"
              @change="changeParams"
              >{{ item.value }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="部门:">
          <el-checkbox-group v-model="formData.departmentChecks">
            <el-checkbox
              v-for="item in deparmentStore.initData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @change="changeParams"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据展示 -->
    <el-card class="hr-block" style="margin-top: 5px">
      <el-table :data="salaryList" style="width: 100%" v-loading="loading">
        <el-table-column type="index" :index="Nindex" label="序号" width="80" align="center" />
        <el-table-column prop="username" label="姓名" align="center" />
        <el-table-column prop="mobile" label="手机" align="center" />
        <el-table-column prop="workNumber" label="工号" align="center" />
        <el-table-column
          prop="formOfEmployment"
          :formatter="formatEmployment"
          width="100"
          label="聘用形式"
          align="center"
        />
        <el-table-column prop="departmentName" label="部门" align="center" />
        <el-table-column prop="timeOfEntry" width="130" label="入职时间" align="center">
          <span>{{ new Date('2024-10-22').toLocaleDateString() }}</span>
        </el-table-column>
        <el-table-column :formatter="getMoney" label="工资基数" align="center" />
        <el-table-column label="津贴方案" width="100">通用方案</el-table-column>

      </el-table>
      <el-row type="flex" justify="center" style="height: 50px" align="middle">
        <el-pagination
          background
          layout="prev,pager,next"
          :total="page.total"
          :current-page="page.page"
          :page-size="page.pageSize"
          @current-change="changePage"
        />
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.checkBox {
  display: flex;
  margin: 10px auto;
  .title {
    margin: 5px auto;
    text-align: right;
    padding-right: 10px;
    font-weight: bold;
  }
}
</style>
