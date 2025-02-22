<template>
    <div class="offer">
        <el-alert type="info" show-icon :closable="false">
            欲調整公開狀態、票名、票價、數量，請到活動管理。
        </el-alert>
        <div class="offerList">
            <template v-for="(groupOffers, index) in offerGroups">
                <el-divider v-if="checkOfferIsOver(groupOffers[0])">已結束的活動</el-divider>
                <el-card class="offerList__item">
                    <template #header>
                        <div class="card__header">
                            {{ getDate(groupOffers[0]) }} {{ groupOffers[0].eventName }}
                            <div class="header__btnGroup">
                                <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                                    <el-button :icon="Share" class="btnGroup__btn"
                                        @click="shareLink(groupOffers[0])">分享售票連結</el-button>
                                </el-tooltip>
                                <!-- <el-button :icon="Calendar" class="btnGroup__btn">
                                    在活動管理打開
                                </el-button> -->
                            </div>
                        </div>
                    </template>
                    <el-form>
                        <el-row>
                            <el-col :span="formFieldSpan">
                                <el-form-item label="時間">
                                    {{ getTimes(groupOffers[0]) }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="formFieldSpan">
                                <el-form-item label="主辦單位">
                                    {{ groupOffers[0].offererName }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="formFieldSpan">
                                <el-form-item label="活動公開狀態">
                                    {{ groupOffers[0].eventIsPublic ? '已公開' : '非公開' }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="formFieldSpan">
                                <el-form-item label="售票單位">
                                    {{ groupOffers[0].sellerName }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="formFieldSpan">
                                <el-form-item label="票券剩餘數量">
                                    <el-switch v-model="groupOffers[0].eventIsPublic" inline-prompt active-text="公開"
                                        inactive-text="隱藏" @change="patchOfferCategory(groupOffers[0])" />
                                    <!-- {{ groupOffers[0].eventIsPublic ? '顯示' : '隱藏' }} -->
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
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Calendar, Share } from '@element-plus/icons-vue';
import type { IOffer } from '~/types/offer';
const repoUI = useRepoUI()
const repoOffer = useRepoOffer()
const shareTooltipVisible = ref(false)
const offers = ref<IOffer[]>()
const offerGroups = ref<any>({})
const formFieldSpan = ref<number>(24)

// Hooks
onMounted(() => {
    getOfferList()
})
watch(() => repoUI, (ui) => {
    formFieldSpan.value = 24
    if (ui.isMedium) {
        formFieldSpan.value = 12
    }
    if (ui.isLarge) {
        formFieldSpan.value = 8
    }
    if (ui.isXLarge) {
        formFieldSpan.value = 6
    }
}, { immediate: true, deep: true, })

// Methods
async function patchOfferCategory(offer: IOffer,) {
    await repoOffer.patchOfferCategory(offer)
}

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

const currentTime = new Date().getTime()
function checkOfferIsOver(offer: IOffer) {
    const endTime = new Date(offer.validThrough).getTime()
    if (endTime < currentTime) {
        return true
    }
}
</script>
<style lang="scss" scoped>
.offer {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
}

.offerList {
    margin-top: 20px;

    .offerList__item {

        .card__header {
            display: flex;
            justify-content: space-between;

            .header__btnGroup {
                display: flex;
                flex-direction: column;
                gap: 4px;

                .btnGroup__btn {
                    margin: 0px;
                }
            }
        }
    }
}

@media screen and (min-width: 768px) {
    .offerList {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: 20px;

        .offerList__item {

            .card__header {
                display: flex;
                justify-content: space-between;

                .header__btnGroup {
                    display: flex;
                    flex-direction: row;
                    gap: 4px;

                    .btnGroup__btn {
                        margin: 0px;
                    }
                }
            }
        }
    }
}
</style>