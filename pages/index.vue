<template>
    <div class="index">
        <FormSearchEvents v-model="form" ref="formRef" @change="getEventList()">
        </FormSearchEvents>
        <!-- {{ eventList }} -->
        <el-row :gutter="20" class="index__eventList" :class="{ 'mt--60': !repoUI.isMedium }">
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
    </div>
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
.index__eventList {
    margin-top: 60px; // form height;
}

.index__form {
    position: fixed;
    top: 0px;
    left: 50%;
    transform: translate(-50%);
    width: calc(100vw - 40px); // -padding x2
    z-index: 1;
    // background-color: rgba(255, 255, 255, 0.5);
    background-color: white;
    padding: 20px;
    padding-bottom: 0px;
    // box-shadow: 0 4px 2px -2px gray;
    border-bottom: 1px solid lightgrey;
    // border: 1px solid lightgray;
    // max-width: 720px;
}

.margin--header {
    margin-top: 60px;
}

.mt--60 {
    margin-top: 60px;
}

.index__row {
    margin-bottom: 20px;
}

.footer__offer {
    white-space: nowrap;
}
</style>