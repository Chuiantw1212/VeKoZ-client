<template>
  <el-menu :collapse="repoUI.isMenuCollapse">
    <NuxtLink to="/host/event">
      <el-menu-item>
        <el-icon>
          <Calendar />
        </el-icon>
        <template #title>活動管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/eventTemplate">
      <el-menu-item>
        <el-icon>
          <Document />
        </el-icon>
        <template #title>活動套版管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/place">
      <el-menu-item>
        <el-icon>
          <Location />
        </el-icon>
        <template #title>空間&地點管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/organization">
      <el-menu-item>
        <el-icon>
          <OfficeBuilding />
        </el-icon>
        <template #title>權限&組織管理</template>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/host/offer">
      <el-menu-item>
        <el-icon>
          <Ticket />
        </el-icon>
        <template #title>票券管理</template>
      </el-menu-item>
    </NuxtLink>
  </el-menu>
</template>
<script setup lang="ts">
import { Ticket, Calendar, Document, Location, OfficeBuilding } from '@element-plus/icons-vue'
const repoUI = useRepoUI()

// Hooks
onMounted(() => {
  if (import.meta.client) {
    setMenuCollapse()
    toggleResize(true)
  }
})

onBeforeUnmount(() => {
  toggleResize(false)
})

function toggleResize(isOn: boolean) {
  if (isOn) {
    window.addEventListener('resize', setMenuCollapse)
  } else {
    window.removeEventListener('resize', setMenuCollapse)
  }
}

// Methods
function setMenuCollapse() {
  if (window.innerWidth > 992) {
    repoUI.setMenuCollapse(false)
  } else {
    repoUI.setMenuCollapse(true)
  }
}

</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
</style>