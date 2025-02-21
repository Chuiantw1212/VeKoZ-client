<template>
    <!-- <h1>票券銷售分派</h1> -->
    <!-- Todo：等後台開發。
    票券可以不公開 -->
    <el-card>
        <template #header>
            投資進階管道 2025/02/22
        </template>
        <el-table :data="offers" style="width: 100%">
            <!-- <el-table-column prop="validFrom" label="日期">
                <template #default="{ row }">
                    {{ new Date(row.validFrom).toLocaleDateString('zh-TW') }}
                </template>
            </el-table-column> -->
            <el-table-column prop="offererName" label="主辦">
            </el-table-column>
            <el-table-column prop="sellerName" label="售票">
            </el-table-column>
            <el-table-column prop="name" label="票券名稱">
            </el-table-column>
            <el-table-column prop="" label="功能">
                <template #default="{ row }">
                    {{ new Date(row.validFrom).toLocaleDateString('zh-TW') }}
                </template>
            </el-table-column>
        </el-table>
    </el-card>
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