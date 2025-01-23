<template>
    <div class="event">
        <div class="event__header">
            <h1>事件管理</h1>
            <el-button>樣板選擇</el-button>
        </div>
        <br />
        <VotionCalendar></VotionCalendar>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
})

import VotionCalendar from '~/components/Atom/VotionCalendar.vue';
</script>

<style lang="scss" scoped>
.event {
    .event__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>