<script setup lang="ts">
import PageTools from '@/components/PageTools.vue'
import Checkbox from './components/Checkbox.vue'
import { onMounted, ref } from 'vue'
import { getEmployeeList } from '@/apis/Salary'

const list = ref()
const loading = ref(false)
const selectParams = ref({
  departmentChecks: '',
  socialSecurityChecks: '',
  providentFundChecks: ''
})
const page = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const getCity = () => {
  return ['北京', '上海', '深圳', '天津', '重庆', '珠海', '广州', '西安'][
    Math.floor(Math.random() * 8)
  ]
}

// 获取数据
const getSocialData = async () => {
  loading.value = true
  const { data } = await getEmployeeList({ ...page.value, ...selectParams.value })
  list.value = data.data.rows
  page.value.total = data.data.total
  loading.value = false
}

// 条件筛选
const changeSelect = async (data: any) => {
  selectParams.value = data
  getSocialData()
}

// 切页
const pageChange = (pageData: any) => {
  page.value.page = pageData // 当前
  getSocialData() // 获取列表数据
}

const getBase = () => {
  return [3000, 5000, 6000, 8000, 10000, 12000, 15000, 16000][Math.floor(Math.random() * 8)]
}

// 格式化表单数据序号
const Nindex = (index: any) => {
  return index + 1 + (page.value.page - 1) * page.value.pageSize
}

onMounted(() => {
  getSocialData()
})
</script>

<template>
  <div class="container">
    <!-- 工具栏 -->
    <PageTools beforeShow="false" afterShow="true">
      <template v-slot:after>
        <el-button size="small" type="primary" @click="$router.push('/security/securityList')"
          >2024报表</el-button
        >
      </template>
    </PageTools>
    <!-- 条件筛选 -->
    <Checkbox @changeSelect="changeSelect" />
    <!-- 数据表格 -->
    <el-card class="hr-block">
      <el-table
        :data="list"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        v-loading="loading"
      >
        <el-table-column type="index" :index="Nindex" width="70" label="序号" align="center" />
        <el-table-column prop="username" label="姓名" sortable width="100" align="center" />
        <el-table-column prop="mobile" label="手机" sortable width="140" align="center" />
        <el-table-column prop="workNumber" label="工号" sortable width="140" align="center" />
        <el-table-column prop="departmentName" label="部门" sortable width="180" align="center" />
        <el-table-column prop="timeOfEntry" label="入职时间" sortable width="120" align="center" />
        <el-table-column prop="leaveTime" label="离职时间" sortable width="120" align="center">
          --
        </el-table-column>
        <el-table-column
          :formatter="getCity"
          prop="participatingInTheCity"
          label="社保城市"
          width="80"
          align="center"
        />
        <el-table-column
          :formatter="getCity"
          prop="providentFundCity"
          label="公积金城市"
          width="100"
          align="center"
        />
        <el-table-column
          :formatter="getBase"
          prop="socialSecurityBase"
          label="社保基数"
          width="120"
          align="center"
        />
        <el-table-column
          :formatter="getBase"
          prop="providentFundBase"
          label="公积金基数"
          width="120"
          align="center"
        />
        <!-- <el-table-column label="操作">
            <template v-slot:default="obj">
              <el-button type="text" size="mini" @click="$router.push(`/social_securitys/detail/${obj.row.id}`)">查看详情</el-button>
            </template>
          </el-table-column> -->
      </el-table>
      <el-row type="flex" align="middle" justify="center" style="height: 60px">
        <el-pagination
          :total="page.total"
          :current-page="page.page"
          :page-size="page.pageSize"
          layout="prev, pager, next"
          @current-change="pageChange"
        />
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
