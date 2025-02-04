<template>
    <el-row :gutter="20">
        <el-col :span="16">
            <el-card>
                <MoleculeVenoniaCalendar ref="venoniaCalendarRef" @create="openNewEventDialog($event)"
                    @eventChange="handleEventChange($event)" @event-click="handleEventClick($event)">
                </MoleculeVenoniaCalendar>
            </el-card>
        </el-col>
        <el-col :span="8">
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

    <el-dialog v-model="dialogVisible" title="活動編輯" :show-close="false" :lock-scroll="true">
        <template #header="{ titleId, titleClass }">
            <div class="venonia-dialog-header">
                <span :id="titleId" :class="titleClass">活動編輯</span>
                <div class="header__btnGroup">
                    <button v-if="dialogTemplate.eventId" class="btnGroup__btn">
                        <el-icon @click="deleteEvent()">
                            <Delete />
                        </el-icon>
                    </button>
                    <button class="btnGroup__btn">
                        <el-icon @click="cancelEventEditing()">
                            <Close />
                        </el-icon>
                    </button>
                </div>
            </div>
        </template>
        <FormTemplateDesign v-if="dialogVisible" v-model="dialogTemplate.designs"></FormTemplateDesign>
        <template #footer>
            <el-button @click="cancelEventEditing()">取消</el-button>
            <el-button type="primary" @click="submitNewEvent()">
                確認
            </el-button>
        </template>
    </el-dialog>
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
const venoniaCalendarRef = ref<CalendarApi>()
const defaultTemplate = ref<IEventTemplate>({
    designs: []
})
const dialogVisible = ref(false)
const dialogTemplate = ref<IEventTemplate>({
    designs: []
})

// Hooks
onMounted(() => {
    getEventList()
    getEventTemplate()
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
            startEditable: true,
            durationEditable: false,
        }
    })

    fullCalendarEventList.forEach(event => {
        venoniaCalendarRef.value?.addEvent(event)
    })
}

async function handleEventChange(changeInfo: IChangeInfo) {

}

async function handleEventClick(eventClickInfo: IEventClickInfo) {
    const eventId = eventClickInfo.event.id
    const eventTemplate: IEventTemplate = await repoEvent.getEvent(eventId)
    Object.assign(dialogTemplate.value, eventTemplate)
    dialogVisible.value = true
}

async function getEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    defaultTemplate.value = markRaw(result)
}

async function openNewEventDialog(data: IEventCreation) {
    dialogTemplate.value = structuredClone(defaultTemplate.value)
    const seoDateTimeRange = dialogTemplate.value.designs.find((design) => {
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

async function cancelEventEditing() {
    dialogVisible.value = false
}

async function deleteEvent() {
    if (dialogTemplate.value.eventId) {
        await repoEvent.deleteEvent(dialogTemplate.value.eventId)
        venoniaCalendarRef.value?.removeAllEvents()
        await getEventList()
        dialogVisible.value = false
    }
}

/**
 * 存到Firestore的資料要可以篩選，所以這邊就要把資料格式整理好
 */
async function submitNewEvent() {
    await repoEvent.postEvent(dialogTemplate.value)
    await getEventList()
    dialogVisible.value = false
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