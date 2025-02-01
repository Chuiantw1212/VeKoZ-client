<template>
  <div class="votion">
    <div class="votion__header">
      <el-form :style="{ 'width': '100%' }">
        <el-row justify="end">
          <el-form-item label="視圖切換">
            <el-dropdown>
              <span class="el-dropdown-link">
                月曆
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>網格</el-dropdown-item>
                  <el-dropdown-item>列表</el-dropdown-item>
                  <el-dropdown-item>月曆</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!-- <h1>登入前的月曆</h1> -->
    <!-- <VotionCalendar></VotionCalendar> -->
  </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/molecule/VotionCalendar.vue';

// definePageMeta({
//   layout: 'default',
// })
</script>

<style lang="scss" scoped>
.Venonia{
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