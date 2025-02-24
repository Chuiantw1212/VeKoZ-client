<template>
    <el-card class="offerList__item">
        <template #header>
            <div class="card__header">
                {{ getDate(groupOffers[0]) }}
                {{ groupOffers[0].categoryName }}
                <!-- {{ trimLongString(groupOffers[0].eventName) }} -->
                <div class="header__btnGroup">
                    <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                        <el-button :icon="Share" class="btnGroup__btn"
                            @click="shareLink(groupOffers[0])">分享專屬售票連結</el-button>
                    </el-tooltip>
                    <!-- <el-button :icon="Calendar" class="btnGroup__btn">
                                    在活動管理打開
                                </el-button> -->
                </div>
            </div>
        </template>
        <el-form>
            <el-row :gutter="20">
                <el-col :span="formFieldSpan">
                    <el-form-item label="活動名稱">
                        {{ groupOffers[0].eventName }}
                    </el-form-item>
                </el-col>
                <el-col :span="formFieldSpan">
                    <el-form-item label="活動時間">
                        {{ getTimes(groupOffers[0]) }}
                    </el-form-item>
                </el-col>
                <el-col :span="formFieldSpan">
                    <el-form-item label="活動是否公開">
                        {{ groupOffers[0].eventIsPublic ? '已公開' : '非公開' }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="formFieldSpan">
                    <el-form-item label="主辦單位">
                        {{ groupOffers[0].offererName }}
                    </el-form-item>
                </el-col>
                <el-col :span="formFieldSpan">
                    <el-form-item label="售票單位">
                        <el-select v-model="groupOffers[0].sellerId" placeholder="請選擇"
                            @change="patchOfferCategory(groupOffers[0])" :disabled="checkOfferIsOver(groupOffers[0])">
                            <el-option v-for="(item, index) in props.organizationList" :key="index"
                                :label="`${item.name}`" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="formFieldSpan">
                    <el-form-item label="票券剩餘數量">
                        <el-switch v-model="groupOffers[0].eventIsPublic" inline-prompt active-text="對外公開"
                            inactive-text="對外隱藏" @change="patchOfferCategory(groupOffers[0])"
                            :disabled="checkOfferIsOver(groupOffers[0])" />
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
                <el-col :span="formFieldSpan">
                    <el-form-item label="退票方法">
                        <el-input v-model="groupOffers[0].merchantReturnPolicy" placeholder="將顯示在購票畫面" :maxlength="150"
                        :show-word-limit="true" type="textarea" :rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row> -->
        </el-form>
        <el-divider>票券個別設定</el-divider>
        <el-descriptions v-for="offer in groupOffers" :title="offer.name" :column="2" label-width="auto">
            <el-descriptions-item label="票價">{{ offer.price }}</el-descriptions-item>
            <el-descriptions-item label="數量">{{ offer.inventoryValue }} / {{ offer.inventoryMaxValue
            }}</el-descriptions-item>
            <el-descriptions-item :colspan="2" label="描述">
                <el-input v-model="offer.description" placeholder="將顯示在購票畫面" :maxlength="150" :show-word-limit="true"
                    type="textarea" :rows="3" @change="patchOffer(offer)"></el-input>
            </el-descriptions-item>
        </el-descriptions>
    </el-card>
</template>

<script setup lang="ts">

import { Calendar, Share, FolderOpened } from '@element-plus/icons-vue';
import type { IOffer } from '~/types/offer';
import type { IOrganization } from '~/types/organization';
import type { CollapseModelValue } from 'element-plus'
const emit = defineEmits(['category', 'offer'])
const repoUI = useRepoUI()
const formFieldSpan = ref<number>(24)
const shareTooltipVisible = ref(false)

const activeNames = ref(['1'])
const handleChange = (val: CollapseModelValue) => {
    console.log(val)
}

const groupOffers = defineModel('modelValue', {
    type: Object,
    required: true,
})
const props = defineProps({
    organizationList: {
        type: Array,
        default: [] as IOrganization[],
        required: true,
    }
})
//
watch(() => repoUI, (ui) => {
    formFieldSpan.value = 24
    if (ui.isMedium) {
        formFieldSpan.value = 12
    }
    if (ui.isLarge) {
        formFieldSpan.value = 8
    }
    // if (ui.isXLarge) {
    //     formFieldSpan.value = 6
    // }
}, { immediate: true, deep: true, })

// Methods
function patchOffer(offer: IOffer) {
    emit('offer', offer)
}

function patchOfferCategory(offer: IOffer) {
    emit('category', offer)
}

async function shareLink(offer: IOffer) {
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

@media screen and (min-width: 768px) {
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
</style>