<template>
    <div class="event">
        <el-row :gutter="20">
            <el-col :span="repoUI.isLarge ? 16 : 24">
                <el-card v-loading.lock="isLoading">
                    {{ repoUI.isLarge }}
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

        <el-dialog v-model="dialogVisible" title="活動編輯" width="85%" :show-close="false" :lock-scroll="true"
            :align-center="true" body-class="venonia-dialog-body">
            <template #header="{ titleId, titleClass }">
                <div class="venonia-dialog-header">
                    <span :id="titleId" :class="titleClass">活動編輯</span>
                    <div class="header__btnGroup">
                        <el-button v-if="dialogTemplate.id" class="btnGroup__btn">
                            <el-icon @click="deleteEvent()">
                                <Delete />
                            </el-icon>
                        </el-button>
                        <el-button class="btnGroup__btn">
                            <el-icon @click="cancelEventEditing()">
                                <Close />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
            </template>
            <el-container v-loading.lock="isLoading">
                <FormTemplateDesign v-model="dialogTemplate.designs"></FormTemplateDesign>
            </el-container>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import useRepoEvent from '~/composables/useRepoEvent';
import { Delete, Close } from '@element-plus/icons-vue';
import type { IEvent, IEventCreation, } from '~/types/event';
import type { IEventTemplate, } from '~/types/eventTemplate'
import type { CalendarApi, } from '@fullcalendar/core/index.js';
import type { IChangeInfo, IFullCalendarEvent, IEventClickInfo } from '~/types/fullCalendar';

// Data
const repoEvent = useRepoEvent()
const repoUI = useRepoUI()
const isLoading = ref<boolean>(false)
const venoniaCalendarRef = ref<CalendarApi>()
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
            start: String(event.startDate),
            end: String(event.endDate),
            startStr: String(event.startDate),
            endStr: String(event.endDate),
            startEditable: true,
        }
    })

    fullCalendarEventList.forEach(event => {
        venoniaCalendarRef.value?.addEvent(event)
    })
}

async function handleEventChange(changeInfo: IChangeInfo) {
    if (!currentEvent.value) {
        return
    }
    const originStarDate = currentEvent.value.startDate ?? new Date()
    const originEndDate = currentEvent.value.endDate ?? new Date()
    const duration = new Date(originEndDate).getTime() - new Date(originStarDate).getTime()

    const newStartDate = changeInfo.event.start
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
    const result = await repoEvent.getEventTemplate()
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