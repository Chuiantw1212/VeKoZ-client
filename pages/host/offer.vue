<template>
    <div>
        <el-alert type="info" show-icon :closable="false">
            欲調整票價、數量，請到活動管理。
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
                        <el-col :span="24">
                            <el-form-item label="售票連結">
                                <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                                    <el-button :icon="Share" @click="shareLink(groupOffers[0])">分享連結</el-button>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="售票單位">
                                {{ groupOffers[0].sellerName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="主辦單位">
                                {{ groupOffers[0].offererName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="公開狀態">
                                {{ groupOffers[0].eventIsPublic ? '已公開' : '非公開' }}
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
    </div>
</template>
<script setup lang="ts">
import { Calendar, Share } from '@element-plus/icons-vue';
import type { IOffer } from '~/types/offer';

// Tooltip
const shareTooltipVisible = ref(false)
// const position = ref({
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
// } as DOMRect)
// const triggerRef = ref({
//     getBoundingClientRect: () => position.value,
// })
// const mousemoveHandler = ({ clientX, clientY }: MouseEvent) => {
//     position.value = DOMRect.fromRect({
//         x: clientX,
//         y: clientY,
//     })
// }
onMounted(() => {
    if (import.meta.client) {
        getOfferList()
        // document.addEventListener('mousemove', mousemoveHandler)
    }
})

onUnmounted(() => {
    // document.removeEventListener('mousemove', mousemoveHandler)
})

const repoOffer = useRepoOffer()
const offers = ref<IOffer[]>()
const offerGroups = ref<any>({})

async function getOfferList() {
    const result: IOffer[] = await repoOffer.getOfferList()
    offers.value = result

    offerGroups.value = Object.groupBy(result, ({ eventId }) => eventId)
}

async function shareLink(offer: IOffer) {
    console.log({
        offer
    })
    const { origin } = window.location
    const openInLineExternalBrowser = `openExternalBrowser=1`
    const sellerId = `sellerId=${offer.sellerId}`
    const url = `${origin}/event/${offer.eventId}?${openInLineExternalBrowser}&${sellerId}`
    if (!navigator.share) {
        await navigator.share({
            title: offer.eventName,
            text: offer.eventName,
            url,
        });
    } else {
        await navigator.clipboard.writeText(url)
        shareTooltipVisible.value = true
    }
}

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