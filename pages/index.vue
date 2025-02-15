<template>
    <div class="index">
        <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="時間">
                <el-date-picker v-model="dateRange" type="datetimerange" />
            </el-form-item>
        </el-form>
        <el-row :gutter="20">
            <el-col v-for="(item) in eventList" :span="columnSpan">
                <MoleculeVenoniaCard class="index__card">
                    <template #default>
                        <img src="https://storage.googleapis.com/public.venonia.com/eventDesign/imKB1tyxFBlthb4fBbaG/banner.png"
                            style="width: 100%" />
                    </template>
                    <template #footer>
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
const eventList = ref<IEvent[]>([])
const dateRange = ref([])
const form = ref<IEvent>({
    startDate: new Date(),
})
const columnSpan = ref<number>(8)

// Hooks
onMounted(() => {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)
    form.value.startDate = startOfTheMonth
    getEventList()
    window.addEventListener('resize', setColumnSpan)
    setColumnSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setColumnSpan)
})

// Methods
function setColumnSpan() {
    repoUI.debounce(id.value, () => {
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
    const result = await repoEvent.getEventList({
        ...form.value,
        isPublic: true,
    })
    eventList.value = result
}


</script>

<style lang="scss" scoped>
.footer__offer {
    white-space: nowrap;
}
</style>