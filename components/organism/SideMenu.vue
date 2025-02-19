<template>
  <el-menu :default-active="activeIndex" :collapse="repoUI.isMenuCollapse">
    <NuxtLink to="/host/event">
      <el-menu-item index="1">
        <el-icon>
          <Calendar />
        </el-icon>
        <template #title>活動管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/event-template">
      <el-menu-item index="2">
        <el-icon>
          <Document />
        </el-icon>
        <template #title>活動模板管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/event-group">
      <el-menu-item index="3">
        <el-icon>
          <DocumentCopy />
        </el-icon>
        <template #title>活動群組管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/place">
      <el-menu-item index="4">
        <el-icon>
          <Location />
        </el-icon>
        <template #title>空間地點管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/organization">
      <el-menu-item index="5">
        <el-icon>
          <OfficeBuilding />
        </el-icon>
        <template #title>組織管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/offer">
      <el-menu-item index="6">
        <el-icon>
          <Ticket />
        </el-icon>
        <template #title>票券管理</template>
      </el-menu-item>
    </NuxtLink>
  </el-menu>
</template>
<script setup lang="ts">
import { Ticket, Calendar, Document, DocumentCopy, Location, OfficeBuilding } from '@element-plus/icons-vue'
const repoUI = useRepoUI()
const activeIndex = ref('1')
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
</style>