<template>
  <div class="votion">
    <div class="votion__header">
      <el-dropdown>
        <span class="el-dropdown-link">
          Dropdown List
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>

      </el-dropdown>
    </div>
    <!-- <div class="votion__container">
      <img src="@/assets/mock/活動月曆.jpg">
    </div> -->
    <VotionCalendar></VotionCalendar>
  </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/Atom/VotionCalendar.vue';

// definePageMeta({
//   layout: 'default',
// })
</script>

<style lang="scss" scoped>
.votion {
  .votion__header {
    display: flex;
    justify-content: space-between;
  }

  .votion__container {
    display: flex;
    justify-content: center;
  }
}
</style>