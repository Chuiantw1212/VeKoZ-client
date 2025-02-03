<template>
  <el-menu :collapse="isCollapse" @open="handleOpen" @close="handleClose">
    <el-menu-item @click="isCollapse = !isCollapse">
      <el-icon v-if="isCollapse" >
        <Expand />
      </el-icon>
      <el-icon v-else>
        <Fold />
      </el-icon>
      <template #title>側邊欄開關</template>
    </el-menu-item>
    <NuxtLink to="/event">
      <el-menu-item>
        <el-icon>
          <Calendar />
        </el-icon>
        <template #title>活動管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/eventTemplate">
      <el-menu-item>
        <el-icon>
          <Document />
        </el-icon>
        <template #title>活動套版管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/accommodation">
      <el-menu-item>
        <el-icon>
          <Location />
        </el-icon>
        <template #title>空間&地點管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/organization">
      <el-menu-item>
        <el-icon>
          <OfficeBuilding />
        </el-icon>
        <template #title>權限&組織管理</template>
      </el-menu-item>
    </NuxtLink>
  </el-menu>
</template>
<script setup lang="ts">
import { Expand, Fold, Calendar, Document, Location, OfficeBuilding } from '@element-plus/icons-vue'
const isCollapse = ref<boolean>(true)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>