<template>
    <div class="event">
        <div class="event__header">
            <h1>事件管理</h1>
            <el-button @click="dialogVisible = true">樣板設定</el-button>
        </div>
        <br />
        <VotionCalendar></VotionCalendar>

        <el-dialog v-model="dialogVisible">
            
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/molecule/VotionCalendar.vue';

const dialogVisible = ref(false)

</script>

<style lang="scss" scoped>
.event {
    .event__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>