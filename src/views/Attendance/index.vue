<script setup lang="ts">
import PageTools from '@/components/PageTools.vue'
import { onMounted, reactive, ref } from 'vue'
import { start, close } from '@/util/nprogress'
import { getAttendancesList } from '@/apis/attendance'
import { useDepartmentStore } from '@/stores/useDeparmentStore'
import AttendanceSet from './components/attendance-set.vue'

const attendList = ref() // 考勤数据
const monthOfReport = ref() // 当前月份的天数
const loading = ref(false)
const deparmentStore = useDepartmentStore()
const checkList = ref()
const setRef = ref()

const attendInfo: any = reactive({
  month: '',
  getDate: '',
  getInfo: '',
  name: '',
  counts: '',
  tobeTaskCount: ''
})

// 获取考勤记录的参数
const pageData = reactive({
  page: 1,
  pagesize: 10,
  total: 0,
  deptID: '',
  state: ''
})

// 修改了多选框
const boxSelect = () => {
  pageData.deptID = checkList.value.join()
  console.log(pageData)

  getAttendances()
}

// 切换页码
const pageChange = (page: any) => {
  pageData.page = page
  getAttendances()
}

// 格式化考勤情况id
const formatID = (id: any) => {
  const dataList = [
    '矿工',
    '√',
    '迟到',
    '早退',
    '外出',
    '出差',
    '年假',
    '事假',
    '病假',
    '婚假',
    '丧假',
    '产假',
    '奖励产假',
    '陪产假',
    '探亲假',
    '工伤假',
    '调休',
    '产检假',
    '流产假',
    '长期病假',
    '测试假',
    '休息'
  ]
  if (dataList[id - 1] === '') {
    return '--'
  } else {
    return dataList[id - 1]
  }
}

// 获取考勤数据
const getAttendances = async () => {
  loading.value = true
  const { data } = await getAttendancesList({ ...pageData })
  attendInfo.counts = data.data.data.total
  pageData.total = data.data.data.total
  attendList.value = data.data.data.rows
  attendInfo.month = data.data.monthOfReport
  attendInfo.tobeTaskCount = data.data.tobeTaskCount
  let date = new Date()
  let year = date.getFullYear()
  const month = data.data.monthOfReport
  let d = new Date(year, month, 0)
  monthOfReport.value = d.getDate()
  loading.value = false
}

// 格式化表单数据序号
const Nindex = (index: any) => {
  return index + 1 + (pageData.page - 1) * pageData.pagesize
}

const handleCloseModal = () => {
  setRef.value.dialogFormH()
}

const handleSet = () => {
  setRef.value.dialogFormV()
}

onMounted(async () => {
  start()
  deparmentStore.getDepartmentData()
  getAttendances()
  close()
})
</script>

<template>
  <div class="container">
    <!-- 工具栏 -->
    <PageTools beforeShow="true" afterShow="true">
      <!-- 前面内容 -->
      <template v-slot:before>有 {{ attendInfo.tobeTaskCount }} 条考勤审批尚未处理</template>
      <template v-slot:after>
        <el-button size="small">打卡范围</el-button>
        <el-button size="small" type="primary" @click="handleSet">设置</el-button>
      </template>
    </PageTools>
    <!-- 部门多选框列表 -->
    <el-card class="checkBox">
      <el-row style="display: flex">
        <el-col :span="2" class="title">部门:</el-col>
        <el-col :span="22" class="group">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              class="check"
              v-for="i in deparmentStore.initData"
              :key="i.id"
              :label="i.name"
              :value="i.id"
              @change="boxSelect"
            />
          </el-checkbox-group>
        </el-col>
      </el-row>
    </el-card>
    <!-- 考勤数据 -->
    <el-card class="hr-block">
      <!-- 考勤列表 -->
      <div
        style="
          width: 100%;
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          font-weight: bold;
        "
      >
        <el-table
          :data="attendList"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f5f6f8' }"
          v-loading="loading"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            :index="Nindex"
            width="80"
          ></el-table-column>
          <el-table-column
            label="姓名"
            prop="username"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            label="工号"
            prop="workNumber"
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            label="部门"
            prop="departmentName"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column label="手机" prop="mobile" width="130" align="center"></el-table-column>
          <el-table-column
            v-for="(item, index) in monthOfReport"
            :key="item.id"
            :label="attendInfo.month + '/ ' + (index + 1)"
            align="center"
          >
            <template #default>
              <span
                :class="{
                  finshed: attendList[index]?.attendanceRecord[index]?.adtStatu == '2',
                  rest: attendList[index]?.attendanceRecord[index]?.adtStatu == '22'
                }"
              >
                {{ formatID(attendList[index]?.attendanceRecord[index]?.adtStatu) || '-' }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页组件 -->
      <el-row type="flex" align="middle" justify="center" style="height: 60px">
        <el-pagination
          :page-size="pageData.pagesize"
          :current-page="pageData.page"
          layout="prev, pager, next"
          :total="pageData.total"
          @current-change="pageChange"
        />
      </el-row>
    </el-card>
    <AttendanceSet ref="setRef" @handleCloseModal="handleCloseModal" />
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
.finshed {
  display: inline-block;
  color: green !important;
  font-weight: 20000 !important;
}
.rest {
  color: rgb(144, 147, 166);
}
</style>
