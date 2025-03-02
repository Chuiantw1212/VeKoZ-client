<template>
    <!-- 活動表單的呈現頁面，要可以被iFrame完美鑲嵌。 -->
    <div v-if="event" class="event" :gutter="20">
        <img class="event__banner" :src="event.banner">
        <el-row :gutter="20">
            <el-col :span="mainSpan">
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
                <el-carousel :interval="4000" :autoplay="false" type="card" height="160px">
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
                <el-card class="event__mt">
                    <div v-html="editorDesign.value"></div>
                </el-card>
            </el-col>
            <el-col v-if="repoUI.isLarge" :span="6">
                <el-card class="event__actionCard">
                    <MoleculeEventAction></MoleculeEventAction>
                </el-card>
            </el-col>
            <MoleculeEventAction v-if="!repoUI.isLarge"></MoleculeEventAction>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { LocationFilled } from '@element-plus/icons-vue'
import type { IEventSingle } from '~/types/event'
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { IEventCarouselCard } from '~/types/ui'
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const repoOffer = useRepoOffer()
const repoUser = useRepoUser()
const route = useRoute()
const event = ref<IEventSingle>()
const cardUnits = ref<IEventCarouselCard[]>([])

const editorDesign = ref<ITemplateDesign>({
    value: ''
})

const form = ref({
    ticket: '',
    offerId: 'earlyBird',
    offerCount: 1,
})

const mainSpan = ref<number>(24)
const sideSpan = ref<number>(24)

// Hooks
watch(() => repoUI, (ui) => {
    mainSpan.value = 24
    if (ui.isSmall) {
        mainSpan.value = 18
    }
}, { immediate: true, deep: true, })

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
    event.value = result
    if (result.designs) {
        const eventDesign = result.designs.find(design => {
            return design.type === 'editor'
        })
        if (eventDesign) {
            editorDesign.value = eventDesign
        }
    }
    result.performerIds?.forEach(async id => {
        const user = await repoUser.getUserPublicInfo(id)
        cardUnits.value.push({
            name: user.name ?? '未命名'
        })
    })
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
        overflow-y: unset;
    }

    .event__banner {
        width: 100%;
        height: auto;
        background-position: center;
        background-size: cover;
    }

    .side__card {
        margin-top: 20px;
        text-align: center;

        .organization__body {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .organizationNameGroup {
            display: flex;
            flex-direction: column;
        }

        .card__logo {
            width: 40px;
        }
    }

    .event__mt {
        margin-top: 20px;
    }
}

@media screen and (min-width: 992px) {
    .event {
        padding-bottom: 20px;
    }
}

@media screen and (min-width: 1200px) {
    .event__main {
        padding: 0px;
    }

    .event__actionCard {
        position: sticky;
        top: 70px;
    }
}
</style>