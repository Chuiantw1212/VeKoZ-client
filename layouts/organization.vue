<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <HeaderMenu></HeaderMenu>
      </el-header>
      <el-container>
        <el-aside>
          <SideMenu></SideMenu>
        </el-aside>
        <el-container>
          <el-main>
            <slot></slot>
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import HeaderMenu from '~/components/organism/HeaderMenu.vue'
import SideMenu from '~/components/organism/SideMenu.vue';
</script>