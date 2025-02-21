<template>
    <!-- 活動表單的呈現頁面，要可以被iFrame完美鑲嵌。 -->
    <el-row v-if="event" class="event" :gutter="20">
        <el-col :span="mainSpan">
            <div class="event__main">
                <img class="event__banner" :src="event.banner">
                <el-card>
                    <h1>{{ event.name }}</h1>
                    <p>{{ }}</p>
                    <p v-if="event.startDate && event.endDate">{{ new Date(event.startDate).toLocaleString('zh-TW')
                        }}
                        ~
                        {{ new Date(event.endDate).toLocaleString('zh-TW') }}</p>
                    <el-text>{{ event.description }}</el-text>
                </el-card>
                <el-card>
                    <template v-for="(design) in event.designs">
                        <template v-if="design.type === 'editor'">
                            <div v-if="design.mutable" v-html="design.mutable.value">
                            </div>
                        </template>
                    </template>
                </el-card>
            </div>
        </el-col>
        <el-col v-if="repoUI.isSmall" :span="6">
            <el-card>
                <img :src="event.organizerLogo">
                <div>
                    {{ event.organizerName }}
                </div>
            </el-card>
        </el-col>
        <div class="event__actions">
            <div>
            </div>
            <el-button :icon="CollectionTag">
                追蹤
            </el-button>
            <!-- <el-select v-model="form.ticket" placeholder="請選擇">
                <el-option v-for="(item, index) in ticketOptions" :key="index" :label="`${item.label}`"
                    :value="item.value" />
            </el-select> -->
            <el-button :icon="Money">
                購票
            </el-button>
        </div>
    </el-row>
</template>
<script setup lang="ts">
import { CollectionTag, Money } from '@element-plus/icons-vue'
import type { IEvent } from '~/types/event'
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
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

// Hooks
watch(() => repoUI, (ui) => {
    mainSpan.value = 24
    if (ui.isSmall) {
        mainSpan.value = 18
    }
})

onMounted(() => {
    getEvent()
})
// Methods
async function getEvent() {
    const { id } = route.params
    if (id) {
        const result = await repoEvent.getEvent(String(id))
        console.log({
            result
        })
        event.value = result
    }
}
</script>
<style lang="scss" scoped>
.event {
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
        bottom: 60px;
        background-color: white;
        width: calc(100vw - 40px);
        display: flex;
        gap: 8px;
        padding: 20px;
        z-index: 10px;
        border-top: 1px solid lightgrey;

        >* {
            width: 50%;
        }
    }
}
</style>