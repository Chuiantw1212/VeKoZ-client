<template>
    <div class="index">
        <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="時間">
                <el-date-picker v-model="dateRange" type="datetimerange" />
            </el-form-item>
        </el-form>
        <el-row :gutter="20">
            <el-col v-for="(item) in eventList" :span="8">
                <MoleculeVenoniaCard class="index__card">
                    <!-- <template #header>
                    </template> -->
                    <template #default>
                        <img src="https://storage.googleapis.com/public.venonia.com/eventDesign/imKB1tyxFBlthb4fBbaG/banner.png"
                            style="width: 100%" />
                    </template>
                    <template #footer>
                        <span>
                            {{ item.name }}
                        </span>
                        <span>
                            $250
                        </span>
                    </template>
                </MoleculeVenoniaCard>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import type { IEvent } from '~/types/event';

const repoEvent = useRepoEvent()
const eventList = ref<IEvent[]>([])
const dateRange = ref([])

// Hooks
const form = ref<IEvent>({
    startDate: new Date(),
})

// Methods
async function getEventList() {
    const result = await repoEvent.getEventList({
        ...form.value,
        isPublic: true,
    })
    eventList.value = result
}

onMounted(() => {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)
    form.value.startDate = startOfTheMonth
    getEventList()
})

</script>

<style lang="scss" scoped>
// .index {
//     .index__card {
//         margin-bottom: 20px;
//         height: calc((100vh - 200px)/2);
//     }
// }</style>