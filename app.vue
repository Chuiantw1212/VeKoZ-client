<template>
  <NuxtLayout name="host">
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const repoUI = useRepoUI()
const repoAuth = useRepoAuth()
</script>
