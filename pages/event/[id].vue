<template>
    <!-- 活動表單的呈現頁面，要可以被iFrame完美鑲嵌。 -->
    <div v-if="event" class="event" :gutter="20">
        <img class="event__banner" :src="event.banner">
        <el-main>
            <el-row>
                <el-col :span="mainSpan" class="event__main">
                    <el-card>
                        <h1>{{ event.name }}</h1>
                        <p>{{ }}</p>
                        <p v-if="event.startDate && event.endDate">{{ new Date(event.startDate).toLocaleString('zh-TW')
                        }}
                            ~
                            {{ new Date(event.endDate).toLocaleString('zh-TW') }}</p>
                        <el-text>{{ event.description }}</el-text>
                    </el-card>
                </el-col>
                <el-col :span="sideSpan" class="event__side">
                    <el-card class="side__card">
                        <div class="organization__body">
                            <img class="card__logo" :src="event.organizerLogo">
                            <div class="organizationNameGroup">
                                <div class="card__name">
                                    {{ event.organizerName }}
                                </div>
                                <div>已有?人追蹤</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col>
                    <el-card class="event__custom">
                        <template v-for="(design) in event.designs">
                            <template v-if="!design.formField">
                                {{ design }}
                            </template>
                            <template v-if="design.type === 'editor'">
                                <div v-if="design" v-html="design.value">
                                </div>
                            </template>
                        </template>
                    </el-card>
                </el-col>
                <div class="event__actions">
                    <div>
                        <el-button :icon="Money">
                            購票
                        </el-button>
                    </div>
                </div>
            </el-row>
        </el-main>
    </div>
</template>
<script setup lang="ts">
import { CollectionTag, Money } from '@element-plus/icons-vue'
import type { IEvent } from '~/types/event'
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const repoOffer = useRepoOffer()
const route = useRoute()
const event = ref<IEvent>()

const form = ref({
    ticket: ''
})

const ticketOptions = ref([
    {
        label: '早鳥票',
        value: ''
    },
    {
        label: '一般票',
        value: ''
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
    if (id) {
        const result = await repoEvent.getEvent(String(id))
        // console.log({
        //     result
        // })
        event.value = result
    }
}
</script>
<style lang="scss" scoped>
.event {
    margin: -20px;
    padding-bottom: 80px;

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
        gap: 8px;
        padding: 20px;
        z-index: 20;
        border-top: 1px solid lightgrey;

        >* {
            width: 50%;
        }
    }

    .side__card {
        margin-top: 20px;

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