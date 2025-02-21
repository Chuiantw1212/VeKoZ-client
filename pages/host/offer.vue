<template>
    <h1>票券管理</h1>
    Todo：等後台開發。
</template>
<script setup lang="ts">
import type { IOffer } from '~/types/offer';
const repoOffer = useRepoOffer()
const offers = ref<IOffer[]>()
// const repoUser = useRepouser()

async function getOfferList() {
    const result = await repoOffer.getOfferList()
}

onMounted(() => {
    getOfferList()
})
</script>