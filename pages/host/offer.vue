<template>
    <!-- <h1>票券管理</h1> -->
    <!-- Todo：等後台開發。
    票券可以不公開 -->
    <el-table :data="offers" style="width: 100%">
        <el-table-column prop="eventName" label="eventName" width="180" />
    </el-table>

</template>
<script setup lang="ts">
import type { IOffer } from '~/types/offer';
const repoOffer = useRepoOffer()
const offers = ref<IOffer[]>()
// const repoUser = useRepouser()

async function getOfferList() {
    const result: IOffer[] = await repoOffer.getOfferList()
    offers.value = result
}

onMounted(() => {
    getOfferList()
})
</script>