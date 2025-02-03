<template>
    <div class="event">
        <div class="event__header">
            <h1>活動管理</h1>
            <NuxtLink to="/eventTemplate">點此設計活動套板</NuxtLink>
        </div>

        <VotionCalendar @create="openNewEventDialog($event)">
        </VotionCalendar>

        <el-dialog v-model="dialogVisible" title="活動編輯" @close="dialogVisible = false" :lock-scroll="true">
            <FormTemplateDesign v-if="dialogVisible" v-model="eventTemplate.designs"></FormTemplateDesign>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitNewEvent()">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/molecule/VotionCalendar.vue';
import useRepoEvent from '~/composables/useRepoEvent';
import type { IEvent, IEventCreation } from '~/types/event';
import type { IOrganizationMember } from '~/types/organization';
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'
import type { IEventMember } from '~/types/eventMember';

const repoEvent = useRepoEvent()

const dialogVisible = ref(false)

const eventTemplate = ref<IEventTemplate>({
    designs: []
})

// Hooks
onMounted(() => {
    getEventTemplate()
})

// methods
async function getEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(eventTemplate.value, result)
}

async function openNewEventDialog(data: IEventCreation) {


    const seoDateTimeRange = eventTemplate.value.designs.find((design) => {
        return design.type === 'dateTimeRange'
    })
    if (seoDateTimeRange) {
        if (seoDateTimeRange.mutable) {
            const { date } = data
            seoDateTimeRange.mutable.value = [date, date]
        }
    }

    dialogVisible.value = true
}

/**
 * 存到Firestore的資料要可以篩選，所以這邊就要把資料格式整理好
 */
async function submitNewEvent() {
    await repoEvent.postEvent(eventTemplate.value)
}
</script>

<style lang="scss" scoped>
.event {
    .event__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>