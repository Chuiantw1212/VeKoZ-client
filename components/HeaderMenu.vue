<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
    @select="handleSelect">
    <el-menu-item>
      <NuxtLink to="/">
        <img style="width: 40px" src="@/assets/logo.png" alt="Element logo" />
      </NuxtLink>
    </el-menu-item>
    <el-menu-item>
      <NuxtLink to="/signin">
        Sign In
      </NuxtLink>
    </el-menu-item>
    <el-menu-item>
      <el-avatar class="mr-3" :size="32" :src="avatar" />
    </el-menu-item>
    <!-- <el-sub-menu index="2">
        <template #title>Workspace</template>
<el-menu-item index="2-1">item one</el-menu-item>
<el-menu-item index="2-2">item two</el-menu-item>
<el-menu-item index="2-3">item three</el-menu-item>
<el-sub-menu index="2-4">
  <template #title>item four</template>
  <el-menu-item index="2-4-1">item one</el-menu-item>
  <el-menu-item index="2-4-2">item two</el-menu-item>
  <el-menu-item index="2-4-3">item three</el-menu-item>
</el-sub-menu>
</el-sub-menu> -->
  </el-menu>
</template>

<script lang="ts" setup>
import avatar from '@/assets/mock/user.jpg'
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>