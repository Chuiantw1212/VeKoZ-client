<template>
    <el-alert type="info" show-icon :closable="false">
        <p>
            欲調整票價、數量，請到活動管理。
        </p>
    </el-alert>
    <div class="offerList">
        <el-card v-for="(groupOffers, index) in offerGroups" class="offerList__item">
            <template #header>
                <div class="card__header">
                    {{ groupOffers[0].eventName }}
                    <div>
                        <el-button :icon="Calendar">
                            在活動管理打開
                        </el-button>
                    </div>
                </div>
            </template>
            <el-form>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公開狀態">
                            
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="售票單位">
                            {{ groupOffers[0].sellerName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="售票連結">
                            <!-- {{ getDate(groupOffers[0]) }} {{ getTimes(groupOffers[0]) }} -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="主辦單位">
                            {{ groupOffers[0].offererName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="日期時間">
                            {{ getDate(groupOffers[0]) }} {{ getTimes(groupOffers[0]) }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="groupOffers" style="width: 100%">
                <!-- <el-table-column prop="sellerName" label="售票">
            </el-table-column> -->
                <el-table-column prop="name" label="票券名稱">
                </el-table-column>
                <el-table-column prop="price" label="票價">
                </el-table-column>
                <el-table-column prop="inventoryValue" label="數量">
                    <template #default="{ row }">
                        {{ row.inventoryValue }} / {{ row.inventoryMaxValue }}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="" label="說明">
                    <template #default="{ row }">
                        <el-button :icon="Calendar">
                            在活動管理打開
                        </el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue';
import type { IOffer } from '~/types/offer';
const repoOffer = useRepoOffer()
const offers = ref<IOffer[]>()
const offerGroups = ref<any>({})
// const repoUser = useRepouser()

async function getOfferList() {
    const result: IOffer[] = await repoOffer.getOfferList()
    offers.value = result

    offerGroups.value = Object.groupBy(result, ({ eventId }) => eventId)
}

onMounted(() => {
    getOfferList()
})

function getDate(offer: IOffer) {
    if (offer.validFrom) {
        const validFrom: Date = new Date(offer.validFrom)
        const date = validFrom.toLocaleDateString('zh-TW')
        return date
    }
}

function getTimes(offer: IOffer) {
    let timeString = ''
    if (offer.validFrom) {
        const validFrom: Date = new Date(offer.validFrom)
        const startTime = validFrom.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += `${startTime.slice(0, 5)}`
    }
    if (offer.validThrough) {
        const validThrough: Date = new Date(offer.validThrough)
        const endTime = validThrough.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += ` ~ ${endTime.slice(0, 5)}`
    }
    return timeString
}
</script>
<style lang="scss" scoped>
.offerList {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;

    .offerList__item {

        .card__header {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>