<template>
    <div class="event">
        <el-row :gutter="20">
            <el-col :span="repoUI.isLarge ? 16 : 24">
                <el-card v-loading.lock="isLoading">
                    <MoleculeVenoniaCalendar ref="venoniaCalendarRef" @create="openNewEventDialog($event)"
                        @eventChange="handleEventChange($event)" @event-click="handleEventClick($event)">
                    </MoleculeVenoniaCalendar>
                </el-card>
            </el-col>
            <el-col v-if="repoUI.isLarge" :span="8">
                <el-card>
                    <template #header>
                        月曆切換與訂閱
                    </template>
                    <el-input placeholder="請搜尋欲訂閱的月曆或輸入月曆ID"></el-input>
                    <ul>
                        <li>
                            歐洲多語言
                        </li>
                        <li>
                            常識經濟學
                        </li>
                        <li>
                            個人行事曆
                        </li>
                    </ul>
                </el-card>
            </el-col>
        </el-row>

        <AtomVenoniaDialog v-model="dialogVisible">
            <template #header>
                <el-text size="large">
                    活動編輯
                </el-text>
                <el-icon>

                </el-icon>
            </template>
            <template #headerUI>
                <el-button v-if="dialogTemplate.id" :icon="Delete" text @click="deleteEvent()">
                </el-button>
                <el-button v-loading="isLoading" :icon="Close" text @click="cancelEventEditing()">
                </el-button>
            </template>
            <template #default>
                <el-container v-loading.lock="isLoading">
                    <FormTemplateDesign v-model="dialogTemplate.designs" :onchange="handleChange"></FormTemplateDesign>
                </el-container>
            </template>
        </AtomVenoniaDialog>
    </div>
</template>

<script setup lang="ts">
import useRepoEvent from '~/composables/useRepoEvent';
import { Delete, Close, } from '@element-plus/icons-vue';
import type { IEvent, IEventCreation, } from '~/types/event';
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'
import type { CalendarApi, } from '@fullcalendar/core/index.js';
import type { IChangeInfo, IFullCalendarEvent, IEventClickInfo } from '~/types/fullCalendar';

// Data
const repoEvent = useRepoEvent()
const repoEventTemplate = useRepoEventTemplate()
const repoUI = useRepoUI()
const isLoading = ref<boolean>(false)
const venoniaCalendarRef = ref<CalendarApi>()
const calendarEventList = ref<IEvent[]>([])
const currentEvent = ref<IEvent>()
const dialogVisible = ref(false)
const dialogTemplate = ref<IEventTemplate>({
    designs: []
})

// Hooks
onMounted(async () => {
    isLoading.value = true
    await Promise.all([
        getEventList(),
        getEventTemplate()
    ])
    isLoading.value = false
})

// Methods
function handleChange(templateDesign: ITemplateDesign) {
    console.log({
        templateDesign
    })
    // repoEvent.patchEvent({
    //     id: templateDesign.id,
    //     mutable: templateDesign.mutable
    // })
}

async function getEventList() {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)

    calendarEventList.value = await repoEvent.getEventList({
        startDate: startOfTheMonth.toISOString(),
    })

    const fullCalendarEventList: IFullCalendarEvent[] = calendarEventList.value.map(event => {
        return {
            id: String(event.id),
            title: String(event.name ?? '未命名'),
            start: String(event.startDate),
            end: String(event.endDate),
            startStr: String(event.startDate),
            endStr: String(event.endDate),
            editable: true,
        }
    })

    fullCalendarEventList.forEach(event => {
        venoniaCalendarRef.value?.addEvent(event)
    })
}

async function handleEventChange(changeInfo: IChangeInfo) {
    /**
     * 疑似BUG，無法直接拿到endDateStr
     */
    const eventId = changeInfo.event.id
    const changedEvent = calendarEventList.value.find(event => {
        return event.id === eventId
    })
    const oldEndDate = String(changedEvent?.endDate)
    const newStartDate: Date = changeInfo.event.start as Date
    const newYear = newStartDate.getFullYear()
    const newMonth = newStartDate.getMonth()
    const newDate = newStartDate.getDate()
    const newEndDate = new Date(oldEndDate)
    newEndDate.setFullYear(newYear)
    newEndDate.setMonth(newMonth)
    newEndDate.setDate(newDate)

    // repoEvent

}

async function handleEventClick(eventClickInfo: IEventClickInfo) {
    const eventId = eventClickInfo.event.id
    currentEvent.value = eventClickInfo.event
    const eventTemplate: IEventTemplate = await repoEvent.getEvent(eventId)
    dialogTemplate.value.eventId = eventId // 用這行刪除
    Object.assign(dialogTemplate.value, eventTemplate)
    dialogVisible.value = true
}

async function getEventTemplate() {
    const result = await repoEventTemplate.getEventTemplate()
    if (result) {
        dialogTemplate.value = result
    }
}

async function openNewEventDialog(data: IEventCreation) {
    isLoading.value = true
    const seoDateTimeRange = dialogTemplate.value.designs.find((design) => {
        return design.type === 'dateTimeRange'
    })
    if (seoDateTimeRange) {
        if (seoDateTimeRange.mutable) {
            const { date } = data
            seoDateTimeRange.mutable.value = [date, date]
        }
    }
    const newEvent = await repoEvent.postEvent(dialogTemplate.value)
    currentEvent.value = newEvent
    dialogTemplate.value.eventId = newEvent.eventId
    await getEventList()
    dialogVisible.value = true
    isLoading.value = false
}

async function cancelEventEditing() {
    dialogVisible.value = false
}

async function deleteEvent() {
    isLoading.value = true
    if (dialogTemplate.value.eventId) {
        await repoEvent.deleteEvent(dialogTemplate.value.eventId)
        venoniaCalendarRef.value?.removeAllEvents()
        await getEventList()
        dialogVisible.value = false
        isLoading.value = false
    }
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