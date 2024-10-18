<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  getAttendance,
  getLeave,
  getDeductions,
  getOvertime,
  attendanceSave,
  leaveSave,
  deductionsSave,
  overtimeSave
} from '@/apis/attendance'
import { reactive } from 'vue'
import { useDepartmentStore } from '@/stores/useDeparmentStore'

const deparmentStore = useDepartmentStore()
const dialogFormVisible = ref(false) // 对话框显隐
const activeName = ref('first') // 选中标签值
const dataForm = ref()
const leaveForm = ref()
const tylelist: any = ref([])
const deductionsForm = ref()
const overtimeForm = ref()
// 出勤/请假表单验证规则
const rules = ref({
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  morningStartTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
})

// 加班表单验证
const overtimeRule = ref({
  unit: [{ required: true, message: '调休单位不能为空(', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  isClock: [{ required: true, message: '请选择打卡验证', trigger: 'change' }],
  isCompensationint: [{ required: true, message: '请选择补偿', trigger: 'change' }],
  latestEffectDate: [{ required: true, message: '请选择时间', trigger: 'change' }]
})

// 请假设置类型
const leaveType: any = reactive([
  {
    leaveType: '60000',
    name: '年假',
    isEnable: false
  },
  {
    leaveType: '60100',
    name: '事假',
    isEnable: false
  },
  {
    leaveType: '60200',
    name: '病假',
    isEnable: false
  },
  {
    leaveType: '60300',
    name: '婚假',
    isEnable: false
  },
  {
    leaveType: '60400',
    name: '丧假',
    isEnable: false
  },
  {
    leaveType: '60500',
    name: '产假',
    isEnable: false
  },
  {
    leaveType: '60600',
    name: '奖励产假',
    isEnable: false
  },
  {
    leaveType: '60700',
    name: '陪产假',
    isEnable: false
  },
  {
    leaveType: '60800',
    name: '探亲假',
    isEnable: false
  },
  {
    leaveType: '60900',
    name: '工伤假',
    isEnable: false
  },
  {
    leaveType: '61000',
    name: '调休假',
    isEnable: false
  },
  {
    leaveType: '61100',
    name: '产检假',
    isEnable: false
  },
  {
    leaveType: '61200',
    name: '流产假',
    isEnable: false
  },
  {
    leaveType: '61300',
    name: '长期病假',
    isEnable: false
  },
  {
    leaveType: '61400',
    name: '测试假',
    isEnable: false
  }
])

// 部门设置类型（扣费设置）
const departmentType: any = reactive([
  {
    dedTypeCode: '51000',
    name: '迟到扣款',
    isEnable: false,
    departmentId: '',
    periodLowerLimit: '30', // 时间段下限
    periodUpperLimit: '30', // 时间段上限
    timesLowerLimit: '2', // 次数下限
    timesUpperLimit: '2', // 次数上限
    dedAmonutLowerLimit: '30', // 扣款金额下限
    dedAmonutUpperLimit: '0', // 扣款金额上限
    absenceDays: '0.5', // 旷工天数
    fineSalaryMultiples: '2', // 罚款工资倍数
    absenceTimesUpperLimt: '0' // 旷工次数上限
  },
  {
    dedTypeCode: '52000',
    name: '早退扣款',
    isEnable: false,
    departmentId: '',
    periodLowerLimit: '30', // 时间段下限
    periodUpperLimit: '30', // 时间段上限
    timesLowerLimit: '2', // 次数下限
    timesUpperLimit: '2', // 次数上限
    dedAmonutLowerLimit: '30', // 扣款金额下限
    dedAmonutUpperLimit: '0', // 扣款金额上限
    absenceDays: '0.5', // 旷工天数
    fineSalaryMultiples: '2', // 罚款工资倍数
    absenceTimesUpperLimt: '0' // 旷工次数上限
  },
  {
    dedTypeCode: '53000',
    name: '旷工扣款',
    isEnable: false,
    departmentId: '',
    periodLowerLimit: '30', // 时间段下限
    periodUpperLimit: '30', // 时间段上限
    timesLowerLimit: '2', // 次数下限
    timesUpperLimit: '2', // 次数上限
    dedAmonutLowerLimit: '30', // 扣款金额下限
    dedAmonutUpperLimit: '0', // 扣款金额上限
    absenceDays: '0.5', // 旷工天数
    fineSalaryMultiples: '2', // 罚款工资倍数
    absenceTimesUpperLimt: '0' // 旷工次数上限
  }
])

// 加班设置类型
const overtimeType = reactive([
  {
    id: '1',
    departmentId: '', // 部门ID
    rule: '工作日可申请加班', // 规则内容
    ruleStartTime: '', // 规则生效每日开始时间
    ruleEndTime: '', // 规则生效每日结束时间
    isTimeOff: false, // 是否调休
    isEnable: false // 是否可用
  },
  {
    id: '2',
    departmentId: '', // 部门ID
    rule: '休息日可申请加班', // 规则内容
    ruleStartTime: '', // 规则生效每日开始时间
    ruleEndTime: '', // 规则生效每日结束时间
    isTimeOff: false, // 是否调休
    isEnable: false // 是否可用
  },
  {
    id: '3',
    departmentId: '', // 部门ID
    rule: '法定节假日可申请加班', // 规则内容
    ruleStartTime: '', // 规则生效每日开始时间
    ruleEndTime: '', // 规则生效每日结束时间
    isTimeOff: false, // 是否调休
    isEnable: false // 是否可用
  }
])

// 出勤设置基础数据
let formBase: any = reactive({
  morningStartTime: '',
  morningEndTime: '',
  afternoonStartTime: '',
  afternoonEndTime: '',
  departmentId: '智传教育'
})

// 请假设置基础数据
const leaveBase = ref({
  departmentId: '智传教育'
})

// 扣款设置基础数据
const deductionsBase = ref({
  departmentId: '智传教育'
})

// 加班设置基本数据
const overtimeBase: any = reactive({
  departmentId: '智传教育',
  isClock: false,
  isCompensationint: false,
  latestEffectDate: '',
  unit: '',
  rules: overtimeType
})

// 出勤选择部门
const handleChange = async (val: any) => {
  const { data } = await getAttendance({ departmentId: val })
  formBase.morningStartTime = data.data.morningStartTime
  formBase.morningEndTime = data.data.morningEndTime
  formBase.afternoonStartTime = data.data.afternoonStartTime
  formBase.afternoonEndTime = data.data.afternoonEndTime
}

// 请假选择部门
const handleChangeLeave = async (val: any) => {
  leaveBase.value.departmentId = val
  leaveType.forEach((item: any) => {
    item.isEnable = false
    item.departmentId = val
  })
  const { data } = await getLeave({ departmentId: val })
  data.data.forEach((item: any) => {
    if (item.isEnable === 1) {
      item.isEnable = true
    } else {
      item.isEnable = false
    }
    leaveType.forEach((val: any) => {
      if (val.leaveType === item.leaveType) {
        val.isEnable = item.isEnable
      }
    })
  })
}

// 扣款选择部门
const handleChangeDeductions = async (val: any) => {
  deductionsBase.value.departmentId = val
  departmentType.forEach((item: any) => {
    item.departmentId = val
    item.isEnable = false
  })
  const { data } = await getDeductions({ departmentId: val })
  data.data.forEach((item: any) => {
    if (item.isEnable === 1) {
      item.isEnable = true
    } else {
      item.isEnable = false
    }
    departmentType.forEach((val: any) => {
      if (val.dedTypeCode === item.dedTypeCode) {
        val.isEnable = item.isEnable
      }
    })
  })
}

// 加班选择部门
const handleChangeovertime = async (val: any) => {
  overtimeBase.departmentId = val
  overtimeBase.rules.forEach((item: any) => {
    item.departmentId = val
    item.isEnable = item.isTimeOff = false
    item.ruleEndTime = item.ruleStartTime = ''
  })
  overtimeBase.latestEffectDate = ''
  overtimeBase.unit = ''
  overtimeBase.isClock = overtimeBase.isCompensationint = false
  const { data } = await getOvertime({ departmentId: val })
  if (data.data.dayOffConfigs !== null || data.data.extraDutyConfig !== null) {
    overtimeBase.departmentId = data.data.dayOffConfigs.departmentId
    overtimeBase.latestEffectDate = data.data.dayOffConfigs.latestEffectDate
    overtimeBase.unit = data.data.dayOffConfigs.unit
    overtimeBase.isClock = data.data.extraDutyConfig.isClock
    overtimeBase.isCompensationint = data.data.extraDutyConfig.isCompensationint
  }
  if (overtimeBase.isClock === 0) {
    overtimeBase.isClock = false
  } else {
    overtimeBase.isClock = true
  }
  if (overtimeBase.isCompensationint === 0) {
    overtimeBase.isClock = false
  } else {
    overtimeBase.isCompensationint = true
  }
  if (data.data.extraDutyRuleList.length > 0) {
    data.data.extraDutyRuleList.forEach((item: any) => {
      if (item.isEnable === 1) {
        item.isEnable = true
      } else {
        item.isEnable = false
      }
      if (item.isTimeOff === 1) {
        item.isTimeOff = true
      } else {
        item.isTimeOff = false
      }
    })
    overtimeBase.rules = data.data.extraDutyRuleList
  }
}

// 出勤配置保存更新
const handleAttendance = async () => {
  await dataForm.value.validate()
  const { data } = await attendanceSave(formBase)
  data.success === true ? ElMessage.success('考勤时间更新成功') : ElMessage.error(data.message)
  dialogFormH()
}

// 请假配置保存更新
const handleLeave = async () => {
  await leaveForm.value.validate()
  tylelist.value = leaveType
  tylelist.value.forEach((item: any) => {
    if (item.isEnable) {
      item.isEnable = '1'
    } else {
      item.isEnable = '0'
    }
  })
  const { data } = await leaveSave(tylelist.value)
  dialogFormH()
  data.success === true ? ElMessage.success('请假设置保存成功') : ElMessage.error(data.message)
}

// 扣款配置保存更新
const handleDeductions = async () => {
  await deductionsForm.value.validate()
  var deductionList = departmentType
  deductionList.forEach((item: any) => {
    if (item.isEnable) {
      item.isEnable = '1'
    } else {
      item.isEnable = '0'
    }
  })
  const { data } = await deductionsSave(deductionList)
  dialogFormH()
  data.success === true ? ElMessage.success('扣款设置保存成功') : ElMessage.error(data.message)
}

// 加班配置保存更新
const handleOvertime = async () => {
  await overtimeForm.value.validate()
  var deductionList = overtimeBase
  const { data } = await overtimeSave(deductionList)
  dialogFormH()
  data.success === true ? ElMessage.success('加班设置保存成功') : ElMessage.error(data.message)
}

// 点击设置标签
const handleClick = (tab: any) => {
  if (tab.index === '0') {
    if (formBase.departmentId !== '') {
      handleChange(formBase.departmentId)
    }
  }
  if (tab.index === '1') {
    if (leaveBase.value.departmentId !== '') {
      handleChangeLeave(leaveBase.value.departmentId)
    }
  } else if (tab.index === '2') {
    if (deductionsBase.value.departmentId !== '') {
      handleChangeDeductions(deductionsBase.value.departmentId)
    }
  } else {
    if (overtimeBase.departmentId !== '') {
      handleChangeovertime(overtimeBase.departmentId)
    }
  }
}

// 弹层隐藏
const dialogFormH = () => {
  dialogFormVisible.value = false
}

const handleStatus = (e: any, obj: any) => {
  obj.departmentId = deductionsBase.value.departmentId
  if (deductionsBase.value.departmentId === '') {
    ElMessage.error('请选择部门')
    return false
  }
}

const handleClose = () => {
  dialogFormH()
}

// 弹层显示
const dialogFormV = () => {
  dialogFormVisible.value = true
}
defineExpose({ dialogFormV })

onMounted(async () => {
  handleChange(1)
  handleChangeLeave(1)
  handleChangeDeductions(1)
  handleChangeovertime(1)
})
</script>

<template>
  <div class="add-form">
    <el-dialog title="设置" v-model="dialogFormVisible">
      <el-tabs v-model="activeName" style="margin-left: 20px" @tab-click="handleClick">
        <!-- 出勤设置 -->
        <el-tab-pane label="出勤设置" name="first">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="formBase"
            label-position="right"
            label-width="100px"
            style="width: 700px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="formBase.departmentId"
                placeholder="请选择"
                @change="handleChange"
                style="width: 200px"
                placement="bottom"
              >
                <el-option
                  v-for="item in deparmentStore.initData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出勤时间：" prop="morningStartTime" style="font-weight: bold">
              <el-time-select
                v-model="formBase.morningStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '23:59'
                }"
                :placeholder="formBase.morningStartTime"
                class="timePicker"
                style="width: 200px"
              />
              <span class="line">-</span>
              <el-time-select
                v-model="formBase.morningEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.morningEndTime"
                class="timePicker"
                style="width: 200px"
              />
              <el-time-select
                v-model="formBase.afternoonStartTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonStartTime"
                class="timePicker"
                style="width: 200px; margin-top: 20px"
              />
              <span class="line2">-</span>
              <el-time-select
                v-model="formBase.afternoonEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonEndTime"
                class="timePicker"
                style="width: 200px; margin-top: 20px"
              />
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleAttendance">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
        <!-- 请假设置 -->
        <el-tab-pane label="请假设置" name="second">
          <el-form
            ref="leaveForm"
            :rules="rules"
            :model="leaveBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="leaveBase.departmentId"
                placeholder="请选择"
                @change="handleChangeLeave"
                style="width: 200px"
              >
                <el-option
                  v-for="item in deparmentStore.initData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <p>假期类型</p>
          <el-table ref="singleTable" :data="leaveType" style="width: 100%">
            <el-table-column prop="name" label="类型" width="200" />
            <el-table-column label="是否可用">
              <template v-slot="scope">
                <el-switch
                  v-model="scope.row.isEnable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleLeave">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
          <el-alert type="warning" show-icon :closable="false" title class="tipInfo">
            <template #default>
              <div>
                <p>事假 请假单位为0.5天 只能提交工作日内的请假单</p>
                <p>当请假开关关闭后，员工则不可在员工端提交请假申请</p>
              </div>
            </template>
          </el-alert>
        </el-tab-pane>
        <!-- 扣款设置 -->
        <el-tab-pane label="扣款设置" name="third">
          <el-form
            ref="deductionsForm"
            :rules="rules"
            :model="deductionsBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="deductionsBase.departmentId"
                placeholder="请选择"
                @change="handleChangeDeductions"
                style="width: 200px"
              >
                <el-option
                  v-for="item in deparmentStore.initData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table ref="singleTable" :data="departmentType" style="width: 100%">
            <el-table-column>
              <template v-slot="scope">
                <div>
                  {{ scope.row.name }}
                  <el-switch
                    v-model="scope.row.isEnable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="handleStatus($event, scope.row)"
                  />
                </div>

                <div v-if="scope.row.dedTypeCode === '51000'" class="attentInfo">
                  <p>
                    迟到≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                    />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到≤
                      <el-input v-model="scope.row.timesUpperLimit" class="inputInfo" />次，每次扣款
                      <el-input v-model="scope.row.dedAmonutUpperLimit" class="inputInfo" />元
                    </p>
                    <p>
                      迟到>
                      <el-input
                        v-model="scope.row.timesLowerLimit"
                        class="inputInfo"
                        disabled
                      />次，每次扣款
                      <el-input v-model="scope.row.dedAmonutLowerLimit" class="inputInfo" />元
                    </p>
                  </div>
                  <p>
                    迟到>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到>
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />次，每次矿工
                      <el-input v-model="scope.row.absenceDays" class="inputInfo" />天
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode === '52000'" class="attentInfo">
                  <p>
                    早退≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                    />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      早退≤
                      <el-input v-model="scope.row.timesUpperLimit" class="inputInfo" />次，每次扣款
                      <el-input v-model="scope.row.dedAmonutUpperLimit" class="inputInfo" />元
                    </p>
                    <p>
                      早退>
                      <el-input
                        v-model="scope.row.timesLowerLimit"
                        class="inputInfo"
                        disabled
                      />次，每次扣款
                      <el-input v-model="scope.row.dedAmonutLowerLimit" class="inputInfo" />元
                    </p>
                  </div>
                  <p>
                    早退>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />分钟
                  </p>
                  <div style="padding-left: 120px">
                    <p>
                      早退>
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />次，每次矿工
                      <el-input v-model="scope.row.absenceDays" class="inputInfo" />天
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode === '53000'" class="attentInfo">
                  <p>
                    矿工按
                    <el-input v-model="scope.row.fineSalaryMultiples" class="inputInfo" />倍工资处罚
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleDeductions">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
        <!-- 加班设置 -->
        <el-tab-pane label="加班设置" name="fourth">
          <el-form
            ref="overtimeForm"
            :model="overtimeBase"
            :rules="overtimeRule"
            label-width="110px"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="overtimeBase.departmentId"
                placeholder="请选择"
                @change="handleChangeovertime"
                style="width: 200px"
              >
                <el-option
                  v-for="item in deparmentStore.initData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="打卡验证：" prop="isClock">
              <el-switch v-model="overtimeBase.isClock" />&nbsp;&nbsp;加班需要有打卡记录
            </el-form-item>
            <el-form-item label="开启补偿：" prop="isCompensationint">
              <el-switch v-model="overtimeBase.isCompensationint" />
            </el-form-item>
            <el-form-item label="调休假设置：" prop="latestEffectDate">
              <div class="ruleInfo">
                最晚有效期： 次年
                <el-date-picker
                  v-model="overtimeBase.latestEffectDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 150px"
                />
              </div>
            </el-form-item>
            <el-form-item label prop="unit">
              <div class="ruleInfo">
                <p>
                  请假最小单位
                  <el-input v-model="overtimeBase.unit" style="width: 50px" />天
                </p>
              </div>
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleOvertime">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.inputInfo {
  width: 50px;
}

.attentInfo {
  p {
    padding: 3px 0;
  }
  .el-input--medium {
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
}
.titmInfo {
  .el-date-editor--timerange.el-input__inner {
    width: 280px;
  }
  .el-date-editor .el-range-separator {
    padding: 0 15px 0 0;
  }
  .line {
    display: inline-block;
    margin: 0px 10px;
  }
  .line2 {
    display: inline-block;
    padding-top: 20px;
    margin: 0px 10px;
  }
}
.ruleInfo {
  .el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
.tipInfo {
  margin-top: 20px;
  p {
    padding: 5px 0;
  }
}
.titInfo {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  line-height: 30px;
  padding: 0 0 15px;
}
.attentInfo {
  padding: 30px 15px 15px 80px;
}
.ruleInfo {
  .pad {
    padding-left: 80px;
  }
}
.el-dialog__footer {
  display: flex;
  justify-content: center;
}
</style>
