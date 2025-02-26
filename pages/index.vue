<template>
    <el-row class="events" :gutter="8">
        <template v-if="!repoUI.isLarge">
            <FormSearchEvents v-model="form" ref="formRef" class="events__form events__form--mobile"
                @change="getEventList()">
            </FormSearchEvents>
        </template>
        <el-col v-else :span="searchFromSize">
            <div class="events__sideContainer">
                <el-card class="sideContainer__card">
                    <FormSearchEvents v-model="form" ref="formRef" class="events__form" @change="getEventList()">
                    </FormSearchEvents>
                </el-card>
                <br />
                <div class="sideContainer__ads">
                    廣告合作徵求中
                </div>
            </div>
        </el-col>
        <el-col :span="cardGroupSize">
            <el-row :gutter="8" class="events__mainContainer"
                :class="{ 'events__mainContainer--mt-0': repoUI.isLarge }">
                <el-col v-loading="isLoading" v-for="(item, index) in eventList" :span="cardSize"
                    class="index__cardWrap">
                    <MoleculeEventCard :model-value="item">

                    </MoleculeEventCard>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default'
})
import type { IEventFromList, IEventQuery } from '~/types/event';
const id = ref<string>(crypto.randomUUID())
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const isLoading = ref<boolean>(false)

// Data
const eventList = ref<IEventFromList[]>([])
const startDate = new Date()
const currentMonth = new Date().getMonth()
const endDate = new Date()
endDate.setMonth(currentMonth + 1)
const formRef = ref()
const form = ref<IEventQuery>({
    keywords: '',
    startDate: startDate,
    endDate: endDate,
    startHour: '',
    locationAddressRegion: '',
    hasVirtualLocation: true,
    isPublic: true,
})

// Hooks
onMounted(() => {
    getEventList()
})

const searchFromSize = ref<number>(6)
const cardGroupSize = ref<number>(24)
const cardSize = ref<number>(8)
watch(() => repoUI, (ui) => {
    const { isSmall, isMedium, isLarge, isXLarge } = ui
    if (!isSmall) {
        searchFromSize.value = 6
        cardGroupSize.value = 24
        cardSize.value = 24
    } else {
        cardSize.value = 12
    }
    if (isMedium) {
        cardSize.value = 8
        cardGroupSize.value = 24
    }
    if (isLarge) {
        cardGroupSize.value = 18
    }
    if (isXLarge) {
        cardSize.value = 8
    }
}, { immediate: true, deep: true })

// Methods
async function getEventList() {
    const isValid = await formRef.value?.validate()
    if (!isValid) {
        return
    }
    isLoading.value = true
    repoUI.debounce(`${id.value}-search`, async () => {
        const startDate = form.value.startDate
        startDate?.setHours(0, 0, 0, 0)
        const endDate = form.value.endDate
        endDate?.setHours(24, 0, 0, 0)
        const result = await repoEvent.getEventList(form.value)
        eventList.value = result
        isLoading.value = false
    }, 500)
}
</script>

<style lang="scss" scoped>
.events {

    .events__form {
        z-index: 10;
    }

    .events__form--mobile {
        width: calc(100vw - 40px);
        position: fixed;
        top: 0px;
        left: 0px;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.9);
        border-bottom: 1px solid lightgrey;
    }

    .events__sideContainer {
        z-index: 20;
        position: fixed;
        width: calc((100% - 64px) / 4);
        max-width: 304px;

        .sideContainer__card {
            width: 100%;
        }

        .sideContainer__ads {
            border: 1px solid black;
            height: calc(100vh - 460px);
        }
    }



    .events__mainContainer {
        // padding: 70px 0px;
        // max-height: calc(100vh - 100px);
    }

    .events__mainContainer--mt-0 {
        padding: 0px;

    }
}
</style>