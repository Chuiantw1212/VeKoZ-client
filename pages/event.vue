<template>
    <h1>登入後的月曆，可能會有別的功能</h1>
    <VotionCalendar></VotionCalendar>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
})

import VotionCalendar from '~/components/Atom/VotionCalendar.vue';
</script>