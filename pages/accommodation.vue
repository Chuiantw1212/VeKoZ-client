<template>
  <h1 class="el-header">空間管理</h1>
  <p>這邊只是簡單的，設定地址方便帶入，很久後的未來才會延展成空間管理系統。</p>
  <br/>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="空間名稱" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="description" label="描述" />
  </el-table>
</template>

<script lang="ts" setup>
/**
 * Accomodation
 * https://schema.org/Accommodation
 */
const tableData = [
  {
    name: '齊文藝 2F-Q 安靜區大桌座位',
    address: '台北車站南陽街32號',
    description: '預定須知',
  },
  {
    name: 'TCCC台灣文創訓練中心',
    address: '台灣台北市中山區長安東路一段27號2樓',
    description: '預定須知',
  },
]
</script>