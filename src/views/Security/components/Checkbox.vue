<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDepartmentStore } from '@/stores/useDeparmentStore'

const myEmit = defineEmits(['changeSelect'])

const deparmentStore = useDepartmentStore()
const departmentChecks = ref()
const socialSecurityChecks = ref([])
const providentFundChecks = ref([])
const cityList = ref(['北京', '上海', '深圳', '天津', '重庆', '珠海', '广州', '西安'])

const checkChange = () => {
  const selectParams = {
    departmentChecks: departmentChecks.value,
    socialSecurityChecks: socialSecurityChecks.value,
    providentFundChecks: providentFundChecks.value
  }
  console.log(selectParams)
  myEmit('changeSelect',selectParams)
  // this.$parent.changeSelectParams && this.$parent.changeSelectParams(selectParams)
}

onMounted(() => {
  deparmentStore.getDepartmentData()
})
</script>

<template>
  <div class="cont-top-box">
    <el-form label-width="100px">
      <el-form-item label="部门">
        <el-checkbox-group v-model="departmentChecks" style="display: inline-block">
          <el-checkbox
            v-for="item in deparmentStore.initData"
            :key="item.id"
            :label="item.id"
            :value="item.id"
            @change="checkChange"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="社保城市">
        <el-checkbox-group v-model="socialSecurityChecks" style="display: inline-block">
          <el-checkbox
            v-for="item in cityList"
            :key="item"
            :value="item"
            :label="item"
            @change="checkChange"
            >{{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="公积金城市">
        <el-checkbox-group v-model="providentFundChecks" style="display: inline-block">
          <el-checkbox
            v-for="item in cityList"
            :key="item"
            :value="item"
            :label="item"
            @change="checkChange"
            >{{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
.cont-top-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
