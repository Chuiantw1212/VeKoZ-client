<template>
  <VotionCalendar></VotionCalendar>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

import VotionCalendar from '~/components/Atom/VotionCalendar.vue';

</script>

<style>
.page-index {
  padding-top: 60px;
  text-align: center;
}
</style>
