<template>
  <div class="defaultLayout">
    <el-container>
      <el-header>
        <HeaderMenu></HeaderMenu>
      </el-header>
      <el-container>
        <el-aside class="defaultLayout__aside">
          <SideMenu></SideMenu>
        </el-aside>
        <el-container>
          <el-main>
            <slot></slot>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import HeaderMenu from '~/components/organism/HeaderMenu.vue'
import SideMenu from '~/components/organism/SideMenu.vue';
</script>
<style lang="scss" scoped>
.defaultLayout {
  .defaultLayout__aside {
    width: fit-content;
    transition: all 0.3s;
  }
}
</style>