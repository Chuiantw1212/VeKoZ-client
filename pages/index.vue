<template>
    <div class="index">
        <el-row>
            <el-col>
                這邊放Banner
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col v-for="(item) in 20" :span="6">
                <el-card class="index__card">
                    活動
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/molecule/VenoniaCalendar.vue';

// definePageMeta({
//   layout: 'default',
// })
</script>

<style lang="scss" scoped>
.index {
    .index__card {
        margin-bottom: 20px;
        height: calc((100vh - 200px)/2);
    }
}
</style>