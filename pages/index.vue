<template>
    <el-row class="index" :gutter="20">
        <FormSearchEvents v-if="!repoUI.isLarge" v-model="form" ref="formRef" class="form form--mobile"
            @change="getEventList()">
        </FormSearchEvents>
        <el-col v-else :span="6">
            <el-card>
                <FormSearchEvents v-model="form" ref="formRef" class="form form--desktop" @change="getEventList()">
                </FormSearchEvents>
            </el-card>
        </el-col>
        <el-col :span="repoUI.isLarge ? 18 : 24">
            <el-row :gutter="20" class="index__eventList">
                <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
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
const columnSpan = ref<number>(8)

// Hooks
onMounted(() => {
    getEventList()
    window.addEventListener('resize', setColumnSpan)
    setColumnSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setColumnSpan)
})

// Methods
function setColumnSpan() {
    repoUI.debounce(`${id.value}-col`, () => {
        columnSpan.value = 24
        if (repoUI.isSmall) {
            columnSpan.value = 12
        }
        if (repoUI.isXLarge) {
            columnSpan.value = 8
        }
        if (repoUI.isXXLarge) {
            columnSpan.value = 6
        }
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
        eventList.value = result
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

.margin--header {
    // margin-top: 60px;
}

.mt--60 {
    // margin-top: 60px;
}

.index__row {
    margin-bottom: 20px;
}

.footer__offer {
    white-space: nowrap;
}
</style>