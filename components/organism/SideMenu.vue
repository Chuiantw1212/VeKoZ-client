<template>
  <el-menu :default-active="activeIndex" :collapse="repoUI.isMenuCollapse">
    <NuxtLink to="/host/event">
      <el-menu-item index="host-event">
        <el-icon>
          <Calendar />
        </el-icon>
        <template #title>活動管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/event-template">
      <el-menu-item index="host-event-template">
        <el-icon>
          <Document />
        </el-icon>
        <template #title>活動模板管理</template>
      </el-menu-item>
    </NuxtLink>
    <!-- <NuxtLink to="/host/event-group">
      <el-menu-item index="host-event-group">
        <el-icon>
          <DocumentCopy />
        </el-icon>
        <template #title>活動群組管理</template>
      </el-menu-item>
    </NuxtLink> -->
    <NuxtLink to="/host/offer">
      <el-menu-item index="host-offer">
        <el-icon>
          <Tickets />
        </el-icon>
        <template #title>票券詳細設定</template>
      </el-menu-item>
    </NuxtLink>
    <!-- <NuxtLink to="/host/order">
      <el-menu-item index="host-order">
        <el-icon>
          <Ticket />
        </el-icon>
        <template #title>票券訂單管理</template>
      </el-menu-item>
    </NuxtLink> -->
    <NuxtLink to="/host/place">
      <el-menu-item index="host-place">
        <el-icon>
          <Location />
        </el-icon>
        <template #title>空間地點管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/organization">
      <el-menu-item index="host-organization">
        <el-icon>
          <OfficeBuilding />
        </el-icon>
        <template #title>組織管理</template>
      </el-menu-item>
    </NuxtLink>
  </el-menu>
</template>
<script setup lang="ts">
import { Ticket, Tickets, Calendar, Document, DocumentCopy, Location, OfficeBuilding } from '@element-plus/icons-vue'
const repoUI = useRepoUI()
const activeIndex = ref('event')
const route = useRoute()
onMounted(() => {
  activeIndex.value = route.name
})
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
</style>