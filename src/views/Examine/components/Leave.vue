<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getApprovalsDetail, getApprovalsTaskDetail } from '@/apis/approval'
import { Check } from '@element-plus/icons-vue'

const approvalId: any = ref('1')
const information: any = ref()
const route = useRoute()
const proData = ref()
const loading = ref(false)
const taskInstanceOutList = ref()

// 获取请假信息
const getAppDetail = async () => {
  const { data } = await getApprovalsDetail(approvalId.value)
  information.value = data.data
  proData.value = JSON.parse(data.data?.procData)
}

// 获取审批流程
const getTaskInstanceOutList = async () => {
  loading.value = true
  const { data } = await getApprovalsTaskDetail(approvalId.value)
  taskInstanceOutList.value = data.data
  loading.value = false
}

onMounted(async () => {
  approvalId.value = route.params.id
  getAppDetail()
  getTaskInstanceOutList()
})
</script>

<template>
  <div class="leaveApproval">
    <div class="contLeft">
      <!-- 申请请假 -->
      <p>申请人信息</p>
      <div class="topTit">
        <img src="@/assets/common/img.jpeg" />
        <div class="info">
          <p>
            <span> <span class="label">姓名：</span> {{ information?.username }}</span>
          </p>
          <p>
            <span> <span class="label">部门：</span> {{ information?.departmentName }}</span>
          </p>
          <p>
            <span> <span class="label">入职时间：</span> {{ information?.timeOfEntry }}</span>
          </p>
        </div>
      </div>
      <div class="content">
        <p style="margin-top: 40px">请假申请</p>
        <div class="data">
          <p><span class="label">申请类型：</span>请假</p>
          <p>
            <span class="label">请假类型：</span>
            {{ proData?.holidayType == 1 ? '事假' : '调休' }}
          </p>
          <p>
            <span class="label">申请单位：</span>
            天
          </p>
          <p>
            <span class="label">开始时间：</span>
            {{ proData?.startTime }}
          </p>
          <p>
            <span class="label">结束时间：</span>
            {{ proData?.endTime }}
          </p>
          <p>
            <span class="label">请假时长：</span>
            {{ proData?.duration }}
          </p>
          <p>
            <span class="label">申请事由：</span>
            {{ proData?.reason }}
          </p>
          <p>
            <span class="label">审批状态：</span>
            {{ proData?.reason }}
          </p>
        </div>
      </div>
    </div>
    <div class="contRit">
      <div class="topTit">
        <strong>审批记录</strong>
      </div>
      <el-timeline style="max-width: 800px" class="line" v-loading="loading">
        <el-timeline-item
          v-for="(activity, index) in taskInstanceOutList"
          :key="index"
          type="success"
          color="#0bbd87"
          size="large"
          :icon="Check"
          :timestamp="activity.handleTime"
        >
          <strong>{{ activity.handleUserName }}</strong>
          <span v-if="index == 0">发起申请</span>
          <span v-else-if="activity.handleType == '3'">审批驳回</span>
          <span v-else-if="activity.handleType == '4'">已撤销</span>
          <span v-else-if="activity.handleType == '1'">未开始</span>
          <span v-else-if="activity.handleType == '2'">审批通过</span>
          <span v-else>审批中</span>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.leaveApproval {
  display: flex;
  padding: 15px;
  margin-top: 15px;
  .label {
    color: #999;
  }
  .contLeft {
    flex: 4;
    background: #fff;
    margin-right: 10px;
    padding: 20px;
    .topTit {
      display: flex;
      border-bottom: solid 1px #ccc;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .more {
        display: inline-block;
        position: relative;
        text-align: center;
        width: 16px;
        line-height: 14px;
        font-size: 12px;
        top: -1px;
        left: 5px;
        border: solid 1px #666;
        color: #666;
        border-radius: 50px;
      }
      .info {
        margin-left: 10px;
        line-height: 25px;
        .name {
          span {
            // background: $green;
            color: #fff;
            padding: 4px 10px;
            border-radius: 3px;
            margin-left: 10px;
            font-size: 12px;
          }
        }
        .time {
          ul {
            position: relative;
            display: inline-block;
            li {
              position: absolute;
              border-radius: 3px;
              box-shadow: 1px 2px 2px #ccc;
              top: 34px;
              left: -43px;
              width: 500px;
              padding: 5px 10px;
              line-height: 20px;
              display: none;
              background: #fff;
              border: solid 1px #ccc;
            }
            li::before {
              position: absolute;
              content: '∧';
              left: 50px;
              top: -15px;
              background: #fff;
              color: #ccc;
            }
          }
          ul:hover li {
            display: block;
          }
        }
      }
    }
    .content {
      .data {
        display: flex;
        flex-wrap: wrap;
        p {
          width: 50%;
        }
      }
    }
  }
  .contRit {
    flex: 1;
    background: #fff;
    padding: 0 20px;
    .topTit {
      margin-bottom: 10px;
      border-bottom: solid 1px #ccc;
      line-height: 40px;
    }
    .line {
      padding: 20px;
    }
  }
}
</style>
