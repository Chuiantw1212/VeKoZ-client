<template>
  <NuxtLayout v-if="repoAuth.getUserType() === 'host'" name="host">
    <NuxtPage />
  </NuxtLayout>
  <NuxtLayout v-else name="attendee">
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const repoAuth = useRepoAuth()
</script>
