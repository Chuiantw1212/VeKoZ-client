<template>
    <!-- 活動表單的呈現頁面，要可以被iFrame完美鑲嵌。 -->
    <div v-if="event" class="event" :gutter="20">
        <img class="event__banner" :src="event.banner">
        <el-main>
            <el-row>
                <el-col :span="mainSpan" class="event__main">
                    <el-card>
                        <h1 class="event__title">{{ event.name }}</h1>
                        <el-descriptions :column="1">
                            <el-descriptions-item>{{ event.description }}</el-descriptions-item>
                            <el-descriptions-item label="時間">
                                {{ getDate(event) }}
                                {{ getTimes(event) }}
                            </el-descriptions-item>
                            <el-descriptions-item label="地點">
                                {{ event.locationAddress }}
                                <a target="_blank"
                                    :to="`https://www.google.com/maps/search/?api=1&query=${event.locationAddress}`">
                                    <el-button :icon="LocationFilled" text circle></el-button>
                                </a>
                            </el-descriptions-item>
                            <el-descriptions-item label="視訊連結">
                                <a target="_blank" :src="event.virtualLocationValue">{{ event.virtualLocationName }}</a>
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-card>
                </el-col>
                <el-col :span="sideSpan" class="event__side">
                    <el-carousel :interval="4000" type="card" height="200px">
                        <el-carousel-item v-for="item in 6" :key="item">
                            <el-card class="side__card">
                                <img class="card__logo" :src="event.organizerLogo">
                                <div class="organization__body">
                                    <div class="organizationNameGroup">
                                        <div class="card__name">
                                            {{ event.organizerName }}
                                        </div>
                                        <div>已有?人追蹤</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
                <el-col>
                    <el-card class="event__custom">
                        <FormEventTemplate :model-value="customDesigns"></FormEventTemplate>
                    </el-card>
                </el-col>
                <div class="event__actions">
                    <div class="actions__offers">
                        <div class="offers__options">
                            <el-select v-model="form.offerId" placeholder="請選擇" class="row__item row__item--select">
                                <el-option v-for="(item, index) in ticketOptions" :key="index" :label="`${item.label}`"
                                    :value="item.value" />
                            </el-select>
                            <!-- </el-col> -->
                            <!-- <el-col :span="12"> -->
                            <el-input-number v-model="form.offerCount" class="row__item" :controls-position="'right'">

                            </el-input-number>
                        </div>
                        <div class="offers__desc">
                            任選三場合購優惠價_每場1400元（定價2000元以內活動，可以任選3場參加。除本場活動，另外2場可以先保留）
                        </div>
                    </div>
                    <div class="actions__btnGroup">
                        <!-- <div class="btnGroup__price">NTD 250</div> -->
                        <!-- <div class="row__actionGroup"> -->
                        <el-button class="btnGroup__btn btnGroup__btn--large" type="danger" plain size="large">
                            <div class="btn__content">
                                <el-icon :size="24">
                                    <Money />
                                </el-icon>
                                1,200
                            </div>
                        </el-button>
                        <el-button class="btnGroup__btn" :icon="More" :disabled="true">
                            更多
                        </el-button>
                        <!-- </div> -->
                        <!-- </el-col> -->
                    </div>
                    <!-- </div> -->
                </div>
            </el-row>
        </el-main>
    </div>
</template>
<script setup lang="ts">
import { More, LocationFilled, AlarmClock } from '@element-plus/icons-vue'
import { CollectionTag, Money } from '@element-plus/icons-vue'
import type { IEventSingle } from '~/types/event'
import type { ITemplateDesign } from '~/types/eventTemplate'
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const repoOffer = useRepoOffer()
const route = useRoute()
const event = ref<IEventSingle>()
const customDesigns = ref<ITemplateDesign[]>([])

const form = ref({
    ticket: '',
    offerId: 'earlyBird',
    offerCount: 1,
})

const ticketOptions = ref([
    {
        label: '早鳥票',
        value: 'earlyBird'
    },
    {
        label: '一般票',
        value: 'normal'
    },
])

const mainSpan = ref<number>(24)
const sideSpan = ref<number>(24)

// Hooks
watch(() => repoUI, (ui) => {
    mainSpan.value = 24
    if (ui.isSmall) {
        mainSpan.value = 18
        sideSpan.value = 6
    }
})

onMounted(() => {
    getEvent()
    getOfferList()
})
// Methods
async function getOfferList() {
    const { id } = route.params as any
    const result = await repoOffer.getOfferList({
        eventId: id,
    })
}

async function getEvent() {
    const { id } = route.params as any
    if (!id) {
        return
    }
    const result = await repoEvent.getEvent(String(id))
    // console.log({
    //     result
    // })
    event.value = result
    if (result.designs) {
        const nonRequiredFields = result.designs.filter(design => {
            return !design.formField
        })
        customDesigns.value = nonRequiredFields
    }
}

function getDate(event: IEventSingle) {
    if (event.startDate) {
        const startDate: Date = new Date(event.startDate)
        const date = startDate.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: "2-digit",
            day: "2-digit",
        })
        const weekOfTheDay = startDate.getDay()
        const dayString = ['日', '一', '二', '三', '四', '五', '六']
        return `${date}(${dayString[weekOfTheDay]})`
    }
}

function getTimes(event: IEventSingle) {
    let timeString = ''
    if (event.startDate) {
        const startDate: Date = new Date(event.startDate)
        const startTime = startDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += `${startTime.slice(0, 5)}`
    }
    if (event.endDate) {
        const endDate: Date = new Date(event.endDate)
        const endTime = endDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += ` ~ ${endTime.slice(0, 5)}`
    }
    return timeString
}
</script>
<style lang="scss" scoped>
.event {
    margin: -20px;
    padding-bottom: 180px;

    .event__title {
        margin-bottom: 20px;
    }

    .event__main {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .event__banner {
        width: 100%;
        height: auto;
        background-position: center;
        background-size: cover;
    }

    .event__actions {
        left: 0px;
        position: fixed;
        bottom: 0px;
        background-color: white;
        width: calc(100vw - 40px);
        display: flex;
        // flex-direction: column;
        gap: 8px;
        padding: 20px;
        z-index: 20;
        border-top: 1px solid lightgrey;

        .actions__offers {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            justify-content: space-between;

            .offers__desc {
                text-align: justify;
            }

            .row__item {
                width: 50%;
            }



            .row__item--price {
                width: fit-content;
                text-align: right;
                white-space: nowrap;
            }

            .offers__options {
                display: flex;
                gap: 8px;

            }
        }

        .actions__btnGroup {
            width: fit-content;
            display: flex;
            flex-direction: column;
            // justify-content: flex-end;
            gap: 8px;

            .btnGroup__price {
                text-align: right;
                height: 32px;
                line-height: 32px;
            }

            .btnGroup__btn {
                margin: 0px;
            }

            .btnGroup__btn--large {
                min-width: 95px;
                height: 100%;
                padding: 0px;

                .btn__content {
                    display: flex;
                    gap: 8px;
                    flex-direction: column;
                    align-items: center;
                    font-size: 24px;
                }
            }
        }

        .row__actionGroup {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .group__icon {
                margin: 0px;
            }
        }

    }

    .side__card {
        margin-top: 20px;
        text-align: center;

        .organization__body {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .organizationNameGroup {
            display: flex;
            flex-direction: column;
        }

        .card__logo {
            width: 40px;
        }

        .card__name {}
    }

    .event__custom {
        margin-top: 20px;
    }
}
</style>