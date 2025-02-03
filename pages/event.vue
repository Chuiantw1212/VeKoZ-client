<template>
    <el-row :gutter="20">
        <el-col :span="18">
            <el-card>
                <MoleculeVenoniaCalendar ref="venoniaCalendarRef" @create="openNewEventDialog($event)">
                </MoleculeVenoniaCalendar>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <template #header>
                    月曆切換
                </template>
                <ul>
                    <li>
                        未來切換不同組織的行事曆使用
                    </li>
                    <li>
                        或許也可整合個人行事曆
                    </li>
                </ul>
            </el-card>
        </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" title="活動編輯" @close="dialogVisible = false" :lock-scroll="true">
        <FormTemplateDesign v-if="dialogVisible" v-model="eventTemplate.designs"></FormTemplateDesign>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitNewEvent()">
                確認
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import useRepoEvent from '~/composables/useRepoEvent';
import type { IEvent, IEventCreation, } from '~/types/event';
import type { IOrganizationMember } from '~/types/organization';
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'
import type { IEventMember } from '~/types/eventMember';
import type { CalendarApi, } from '@fullcalendar/core/index.js';
import type { IFullCalendarEvent } from '~/types/fullCalendar';

const repoEvent = useRepoEvent()
const venoniaCalendarRef = ref<CalendarApi>()

const dialogVisible = ref(false)

const eventTemplate = ref<IEventTemplate>({
    designs: []
})

// Hooks
onMounted(() => {
    getEventList()
    getEventTemplate()
})

// methods
async function getEventList() {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)

    const result: IEvent[] = await repoEvent.getEventList({
        startDate: startOfTheMonth.toISOString(),
    })

    const fullCalendarEventList: IFullCalendarEvent[] = result.map(event => {
        return {
            id: String(event.id),
            title: String(event.name),
            start: new Date(event.startDate ?? ''),
            end: new Date(event.endDate ?? ''),
        }
    })

    fullCalendarEventList.forEach(event => {
        venoniaCalendarRef.value?.addEvent(event)
    })
}

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