<template>
    <div class="common-layout">
      <el-container>
        <el-header>
          <HeaderMenu></HeaderMenu>
        </el-header>
        <el-container>
          <el-container>
            <el-main>
              <slot></slot>
            </el-main>
            <el-footer>
                <VotionFooter></VotionFooter>
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </template>
  <script setup lang="ts">
  import HeaderMenu from '@/components/HeaderMenu.vue';
  import VotionFooter from '@/components/VotionFooter.vue';
  </script>