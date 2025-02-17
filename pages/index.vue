<template>
    <el-row class="index" :gutter="20">
        <FormSearchEvents v-if="!repoUI.isLarge" v-model="form" ref="formRef" class="form form--mobile"
            @change="getEventList()">
        </FormSearchEvents>
        <el-col v-else :span="searchFromSize">
            <div class="test">

                <el-card class="fixedCard">
                    <FormSearchEvents v-model="form" ref="formRef" class="form" @change="getEventList()">
                    </FormSearchEvents>
                </el-card>
            </div>
            TODO: 廣告活動放這
        </el-col>
        <el-col :span="cardGroupSize">
            <el-row :gutter="20" class="index__eventList">
                <el-col v-for="(item) in eventList" :span="cardSize" class="index__row">
                    <MoleculeVenoniaCard class="index__card">
                        <template #default>
                            <NuxtLink :to="`/event/${item.id}`">
                                <img :src="item.image" style="width: 100%" />
                            </NuxtLink>
                        </template>
                        <template #footer>
                            <span>
                                台北市
                            </span>
                            <span>
                                {{ item.name }}
                            </span>
                            <span class="footer__offer">
                                NTD 250
                            </span>
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
    location: '',
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
const searchFromSize = ref<number>(6)
function setSearchFormSize() {
    repoUI.debounce(`${id.value}-searchForm`, () => {
        searchFromSize.value = 6
        if (repoUI.isXLarge) {
            searchFromSize.value = 5
        }
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
            cardGroupSize.value = 19
        }
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
        // if (repoUI.isXXLarge) {
        //     cardSize.value = 6
        // }
    })
}
async function getEventList() {
    const isValid = await formRef.value.validate()
    if (!isValid) {
        return
    }

    repoUI.debounce(`${id.value}-search`, async () => {
        eventList.value = []
        const result = await repoEvent.getEventList({
            ...form.value,
            isPublic: true,
        })
        eventList.value = [...result, ...result, ...result, ...result]
    }, 500)
}
</script>

<style lang="scss" scoped>
.form {
    z-index: 10;
    background-color: rgba(255, 255, 255, 1);
}

.form--mobile {
    width: calc(100vw - 40px);
    position: fixed;
    top: 0px;
    left: 0px;
    padding: 20px;
    border-bottom: 1px solid lightgrey;
}

.test{
    position: relative;
}

.fixedCard {
    position: sticky;
    max-width: 100%;
    z-index: 10;
    // top: 0px;
    // left: 0px;
    // max-width: 100%;
}

.index__row {
    margin-bottom: 20px;
}

.footer__offer {
    white-space: nowrap;
}
</style>