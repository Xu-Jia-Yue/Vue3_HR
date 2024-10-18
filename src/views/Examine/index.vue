<script setup lang="ts">
import { getApprovalList } from '@/apis/approval'
import PageTools from '@/components/PageTools.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const examineList = ref()
const loading = ref(false)
const pageData = ref({
  page: 1,
  total: 0,
  pageSize: 10
})

onMounted(async () => {
  loading.value = true
  const { data } = await getApprovalList({ year: 2024, ...pageData.value })
  examineList.value = data.data.rows
  pageData.value.total = data.data.total
  loading.value = false
})

const toDetail = (obj: any) => {
  var name = obj.processName
  switch (name) {
    case '工资':
      router.push({ path: '/approvals/salaryApproval/' + obj.processId })
      break
    case '入职':
      router.push({ path: '/approvals/enterApproval/' + obj.processId })
      break
    case '请假':
      router.push({ path: '/approvals/leaveApproval/' + obj.processId })
      break
    case '离职':
      router.push({ path: '/approvals/quitApproval/' + obj.processId })
      break
    case '加班':
      router.push({ path: '/approvals/overtimeApproval/' + obj.processId })
  }
}
</script>

<template>
  <div class="container">
    <!-- 工具栏 -->
    <PageTools beforeShow="true" afterShow="false">
      <template v-slot:before>
        <div class="detail">
          <div class="item">
            <h4>当前审批中</h4>
            <p>3</p>
          </div>
          <div class="item">
            <h4>本月审批通过</h4>
            <p>3</p>
          </div>
          <div class="item">
            <h4>本月审驳回</h4>
            <p>1</p>
          </div>
        </div>
      </template>
    </PageTools>
    <!-- 审批数据 -->
    <el-card class="hr-block">
      <el-table
        v-loading="loading"
        :data="examineList"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :header-cell-style="{ background: '#f5f6f8', height: '50px' }"
        :row-style="{ height: '50px' }"
      >
        <el-table-column type="index" width="80" label="序号" />
        <el-table-column prop="processName" label="审批类型" sortable />
        <el-table-column prop="username" label="申请人" sortable />
        <el-table-column prop="procCurrNodeUserName" label="当前审批人" sortable />
        <el-table-column label="审批发起时间" sortable>
          <template #default>
            <span>{{ new Date().toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="process_state" label="审批状态" sortable>
          <template v-slot="{ row }">
            <span v-if="row.processState == '0'" class="rovalsState"> 已提交 </span>
            <span v-if="row.processState == '1'" class="rovalsState"> 审批中 </span>
            <span v-if="row.processState == '2'" class="rovalsState"> 审批通过 </span>
            <span v-if="row.processState == '3'" class="rovalsState"> 审批不通过 </span>
            <span v-if="row.processState == '4'" class="rovalsState"> 撤销 </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="toDetail(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" align="middle" justify="center" style="height: 60px">
        <el-pagination
          :total="pageData.total"
          :page-size="pageData.pageSize"
          layout="prev, pager, next"
        />
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.container {
  .detail {
    display: flex;
    margin-top: 0px;
    .item {
      margin-left: 30px;
      text-align: center;
      height: 75px;
      h4 {
        margin-top: 0px;
      }
      p {
        font-size: 20px;
        margin-top: -20px;
      }
    }
  }
}
</style>
