<template>
    <el-row class="events" :gutter="8">
        <FormSearchEvents v-if="!repoUI.isLarge" v-model="form" ref="formRef" class="form form--mobile"
            @change="getEventList()">
        </FormSearchEvents>
        <el-col v-else :span="searchFromSize">
            <div class="cardContainer">
                <el-card class="cardContainer__card">
                    <FormSearchEvents v-model="form" ref="formRef" class="form" @change="getEventList()">
                    </FormSearchEvents>
                </el-card>
                <br />
                廣告合作徵求中
            </div>
        </el-col>
        <el-col :span="cardGroupSize">
            <el-row :gutter="8">
                <el-col v-loading="isLoading" v-for="(item, index) in eventList" :span="cardSize"
                    class="index__cardWrap">
                    <MoleculeVenoniaCard class="index__card">
                        <template #default>
                            <NuxtLink :to="`/event/${item.id}`">
                                <img :src="item.image" style="width: 100%" />
                            </NuxtLink>
                        </template>
                        <template #footer>
                            <table class="card__footTable">
                                <tbody>
                                    <tr>
                                        <td colspan="3">{{ getDates(item) }}</td>
                                    </tr>
                                    <tr>
                                        <td>台北市</td>
                                        <td>{{ item.name }}</td>
                                        <td>
                                            <div class="footer__offer">
                                                NTD 250
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <!-- <tr>
                                    <td>5</td>
                                    <td>
                                       
                                    </td>
                                    <td>6</td>
                                </tr> -->
                            </table>
                            <!-- <span>
                                台北市
                            </span>
                            <span>
                                {{ item.name }}
                            </span>
                            <span class="footer__offer">
                                NTD 250
                            </span> -->
                        </template>
                    </MoleculeVenoniaCard>
                </el-col>
            </el-row>
        </el-col>
        <!-- {{ eventList }} -->
    </el-row>
</template>

<script setup lang="ts">
import type { IEvent } from '~/types/event';
const id = ref<string>(crypto.randomUUID())
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const isLoading = ref<boolean>(false)

// Data
const eventList = ref<IEvent[]>([])
const startDate = new Date()
const currentMonth = new Date().getMonth()
const endDate = new Date()
endDate.setMonth(currentMonth + 1)
const formRef = ref()
const form = ref({
    keywords: '',
    startDate: startDate,
    endDate: endDate,
    timeFrame: '',
    addressRegion: '',
    includeVirtualLocation: true,
})

// Hooks
onMounted(() => {
    getEventList()
    window.addEventListener('resize', setSearchFormSize)
    setSearchFormSize()
    window.addEventListener('resize', setCardGroupSize)
    setCardGroupSize()
    window.addEventListener('resize', setCardSize)
    setCardSize()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setCardGroupSize)
    window.removeEventListener('resize', setCardSize)
})

// Methods

function getDates(event: IEvent) {
    // const { startDate, endDate } = event
    let timeString = ''
    if (event.startDate) {
        const startDate: Date = new Date(event.startDate)
        const date = startDate.toLocaleDateString('zh-TW')
        const startTime = startDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += `${date} ${startTime}`
    }
    if (event.endDate) {
        const endDate: Date = new Date(event.endDate)
        const endTime = endDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += ` ~ ${endTime}`
    }
    return timeString
}

const searchFromSize = ref<number>(6)
function setSearchFormSize() {
    repoUI.debounce(`${id.value}-searchForm`, () => {
        searchFromSize.value = 6
        if (repoUI.isXLarge) {
            // searchFromSize.value = 5
        }
        // if (repoUI.isXXLarge) {
        //     searchFromSize.value = 4.5
        // }
    })
}

const cardGroupSize = ref<number>(6)
function setCardGroupSize() {
    repoUI.debounce(`${id.value}-cardGroup`, () => {
        cardGroupSize.value = 24
        if (repoUI.isLarge) {
            cardGroupSize.value = 18
        }
        if (repoUI.isXLarge) {
            // cardGroupSize.value = 19
        }
        // if (repoUI.isXXLarge) {
        //     cardGroupSize.value = 19.5
        // }
    })
}

const cardSize = ref<number>(8)
function setCardSize() {
    repoUI.debounce(`${id.value}-card`, () => {
        cardSize.value = 24
        if (repoUI.isSmall) {
            cardSize.value = 12
        }
        if (repoUI.isMedium) {
            cardSize.value = 12
        }
        if (repoUI.isLarge) {
            cardSize.value = 12
        }
        if (repoUI.isXLarge) {
            cardSize.value = 8
        }
        if (repoUI.isXXLarge) {
            // cardSize.value = 6
        }
    })
}
async function getEventList() {
    const isValid = await formRef.value.validate()
    if (!isValid) {
        return
    }

    isLoading.value = true
    repoUI.debounce(`${id.value}-search`, async () => {
        // eventList.value = []
        const result = await repoEvent.getEventList({
            ...form.value,
            isPublic: true,
        })
        eventList.value = [...result,]
        isLoading.value = false
    }, 500)
}
</script>

<style lang="scss" scoped>
.events {

    // max-height: calc(100vh - 200px);
    // overflow-y: auto;
    .events__cardContainer {
        min-height: calc(100vh - 160px);
    }
}

.index__eventList {
    max-height: calc(100vh - 160px);
}

.form {
    z-index: 10;
}

.form--mobile {
    width: calc(100vw - 40px);
    position: fixed;
    top: 0px;
    left: 0px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid lightgrey;
}

.cardContainer {
    position: fixed;
    width: 22vw;
    max-width: 295px;
    // width: inherit;
    // max-width: inherit;

    .cardContainer__card {
        width: calc(100%);
        z-index: 20;
    }
}

.index__cardWrap {
    margin-bottom: 8px;
}

.card__footTable {
    width: 100%;
}

.footer__offer {
    white-space: nowrap;
    text-align: right;
    width: 100%;
}
</style>