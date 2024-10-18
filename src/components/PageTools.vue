<script lang="ts" setup>
defineProps(['beforeShow', 'afterShow'])
</script>
<template>
  <el-card class="page-tools">
    <el-row class="tools">
      <!-- 工具栏左侧 -->
      <div class="before" v-if="beforeShow">
        <slot name="before" />
      </div>
      <!-- 工具栏右侧 -->
      <div class="after">
        <slot name="after" v-if="afterShow" />
      </div>
    </el-row>
  </el-card>
</template>

<style lang="scss">
.page-tools {
  margin: 5px 0;
  .tools {
    display: flex;
    justify-content: space-between;
    .before {
      line-height: 40px;
    }
    .after {
      line-height: 40px;
    }
  }
}
</style>
