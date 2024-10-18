<script setup lang="ts">
import { saveSettings } from '@/apis/Salary'
import { reactive, ref } from 'vue'
import { Bell } from '@element-plus/icons-vue'

const sendRef = ref()
const labelPosition = ref('left')
const activeName = ref('first')
const text = ref(
  '每出勤日：金额*实际出勤天数； 每计薪日：金额*计薪天数； 每月固定：固定金额； 每月（按出勤日）：金额*实际出勤天数/应出勤工作日； 每月（按计薪日）：金额*计薪天数/计薪标准（如21.75）'
)
const sendForm = reactive({
  socialSecurityType: 1,
  transportationSubsidyScheme: 1,
  communicationSubsidyScheme: 1,
  lunchAllowanceScheme: 1,
  housingSubsidyScheme: 1,
  taxCalculationType: '1',
  transportationSubsidyAmount: 2.1,
  communicationSubsidyAmount: 1.2,
  lunchAllowanceAmount: 1.3,
  housingSubsidyAmount: 1.5,
  subsidyName: '',
  subsidyRemark: ''
})

// 提交保存
const submitForm = async () => {
  const { data } = await saveSettings(sendForm)
  data.success === true ? ElMessage.success(data.message) : ElMessage.error(data.message)
}

const subsidySchemes = ref([
  { id: 1, name: '每出勤日' },
  { id: 3, name: '每月固定' }
])

// 重置
const resetForm = () => {
  sendRef.value.resetFields()
}
</script>

<template>
  <el-card class="settingContent">
    <el-tabs v-model="activeName">
      <!-- 计薪设置 -->
      <el-tab-pane label="计薪设置" name="first">
        <el-form :label-position="labelPosition" label-width="140px" :model="sendForm">
          <el-form-item label="对应社保自然月">
            <el-select v-model="sendForm.socialSecurityType" style="width: 280px">
              <el-option label="当月" :value="1" />
              <el-option label="次月" :value="2" />
            </el-select>
            <el-tooltip
              content="如果201606月工资中扣除2016年6月自然月的社保公积金，请选择当月；如果扣除2016年7月自然月的社保公积金，请选择次月。"
              placement="top"
            >
              <i class="el-icon-bell" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="社保数据来源" style="width: 450px">
            <el-input placeholder="社保模块" style="width: 280px" :disabled="true" />
            <el-tooltip content="计算工资时的五险一金金额将取自社保报表" placement="top">
              <i class="el-icon-bell" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="考勤数据来源" style="width: 450px">
            <el-input placeholder="考勤模块" style="width: 280px" :disabled="true" />
            <el-tooltip content="计算工资时的考勤数据将取自考勤统计表" placement="top">
              <i class="el-icon-bell" />
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 津贴设置 -->
      <el-tab-pane label="津贴设置" name="second">
        <el-form
          ref="sendRef"
          :model="sendForm"
          status-icon
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="通用方案" prop="pass">
            <el-input v-model="sendForm.subsidyName" style="width: 400px" autocomplete="off" />
          </el-form-item>
          <el-form-item label="备注" prop="checkPass">
            <el-input
              v-model="sendForm.subsidyRemark"
              style="width: 400px"
              value="适用于全体"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="津贴名称" prop="age" class="nameList">
            <p>
              <el-input placeholder="交通补贴" style="width: 200px" :disabled="true" />
              <el-select
                v-model="sendForm.transportationSubsidyScheme"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-for="item in subsidySchemes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-tooltip :content="text" placement="top">
                <el-icon><Bell /></el-icon>
              </el-tooltip>
              <el-input
                v-model="sendForm.transportationSubsidyAmount"
                placeholder="请输入内容"
                style="width: 200px"
              />
            </p>
            <p>
              <el-input placeholder="通讯补贴" style="width: 200px" :disabled="true" />
              <el-select
                v-model="sendForm.communicationSubsidyScheme"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-for="item in subsidySchemes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-tooltip :content="text" placement="top">
                <el-icon><Bell /></el-icon>
              </el-tooltip>
              <el-input
                v-model="sendForm.communicationSubsidyAmount"
                placeholder="请输入内容"
                style="width: 200px"
              />
            </p>
            <p>
              <el-input placeholder="午餐补贴" style="width: 200px" :disabled="true" />
              <el-select
                v-model="sendForm.lunchAllowanceScheme"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-for="item in subsidySchemes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-tooltip :content="text" placement="top">
                <el-icon><Bell /></el-icon>
              </el-tooltip>
              <el-input
                v-model="sendForm.lunchAllowanceAmount"
                placeholder="请输入内容"
                style="width: 200px"
              />
            </p>
            <p>
              <el-input placeholder="住房补助" style="width: 200px" :disabled="true" />
              <el-select
                v-model="sendForm.housingSubsidyScheme"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-for="item in subsidySchemes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-tooltip :content="text" placement="top">
                <el-icon><Bell /></el-icon>
              </el-tooltip>
              <el-input
                v-model="sendForm.housingSubsidyAmount"
                placeholder="请输入内容"
                style="width: 200px"
              />
            </p>
          </el-form-item>
          <el-form-item label="适用计税方式" prop="age">
            <template #default>
              <el-radio v-model="sendForm.taxCalculationType" label="1">税前</el-radio>
              <el-radio v-model="sendForm.taxCalculationType" label="2">税后</el-radio>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
.settingContent {
  padding: 20px;
}
</style>
