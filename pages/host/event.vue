<template>
    <div class="event">
        <el-row :gutter="20">
            <el-col :span="repoUI.isLarge ? 19 : 24">
                <el-card v-loading.lock="isLoading">
                    <MoleculeVenoniaCalendar ref="venoniaCalendarRef" @create="openNewEventDialog($event)"
                        @eventChange="handleEventCalendarChange($event)" @event-click="handleEventClick($event)"
                        @dates-set="handleDatesSet($event)">
                    </MoleculeVenoniaCalendar>
                </el-card>
            </el-col>
            <el-col v-if="repoUI.isLarge" :span="5">
                <el-card>
                    <el-divider content-position="left">篩選</el-divider>
                    <el-checkbox-group v-model="selectedOrganizationIds">
                        <el-checkbox v-for="(item) in organizationList" :label="trimOrganizationName(item)"
                            :value="item.id" />
                    </el-checkbox-group>
                    <el-divider content-position="left">Todo</el-divider>
                    如果是多日的活動，就要個別編輯不同課堂的資料，比如當日教學內容。
                </el-card>
            </el-col>
        </el-row>

        <AtomVenoniaDialog v-model="eventDialogIsOpen" :showClose="false">
            <template #header>
                <el-text size="large">
                    活動編輯
                </el-text>
            </template>
            <template #headerUI>
                <el-button v-if="dialogTemplate.id" v-loading="isDialogPatchLoading" :icon="Delete" text
                    @click="deleteEvent()">
                </el-button>
                <el-button :icon="Close" text @click="cancelEventEditing()">
                </el-button>
            </template>
            <template #default>
                <el-container v-loading.lock="isLoading">
                    <!-- 用v-if避免更新請求重複派送 -->
                    <FormTemplateDesign v-if="eventDialogIsOpen" v-model="dialogTemplate.designs"
                        :onchange="handleEventFormChange">
                    </FormTemplateDesign>
                </el-container>
            </template>
        </AtomVenoniaDialog>

        <AtomVenoniaDialog v-model="loadTemplateDialogIsOpen" :showClose="true">
            <template #header>
                <el-text size="large">
                    選擇模板
                </el-text>
            </template>
            <FormReadEventTemplate v-model="dialogTemplate" @update:modelValue="openCalendarEvent()">
            </FormReadEventTemplate>
        </AtomVenoniaDialog>
    </div>
</template>

<script setup lang="ts">
import { Delete, Close, } from '@element-plus/icons-vue';
import type { IEvent, IEventCreation, } from '~/types/event';
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'
import type { CalendarApi, DatesSetArg, EventSourceInput } from '@fullcalendar/core/index.js';
import type { IChangeInfo, IFullCalendarEvent, IEventClickInfo } from '~/types/fullCalendar';
import type { IOrganization } from '~/types/organization';
import type { IPreferenceEvent } from '~/types/user';
// Data Repo
const repoEvent = useRepoEvent()
const repoOrganization = useRepoOrganization()
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoGoogle = useRepoGoogle()
const isLoading = ref<boolean>(false)
// Data Calendar
const googleCalendarEventIds = ref<string[]>([])
const venoniaCalendarRef = ref<CalendarApi>()
const calendarEventCreation = ref<IEventCreation>()
const calendarEventList = ref<IEvent[]>([])
// Data sidemenu
const organizationList = ref<IOrganization[]>([])
const selectedOrganizationIds = ref<string[]>([])
// Data Dialog
const isDialogPatchLoading = ref<boolean>(false)
const eventDialogIsOpen = ref<boolean>(false)
const currentEvent = ref<IEvent>()
const dialogTemplate = ref<IEventTemplate>({
    designs: []
})
const loadTemplateDialogIsOpen = ref<boolean>(false)

// Hooks
onMounted(async () => {
    isLoading.value = true
    await Promise.all([
        getEventList(),
        getOrganizationList()
    ])
    // setCalendarView()
    isLoading.value = false
})
watch((() => repoUser.userType), () => {
    if (repoUser.userInfo.id) {
        setCalendarView()
    }
}, { immediate: true })

// Methods
function trimOrganizationName(item: IOrganization) {
    if (item.name.length >= 12) {
        return `${item.name.slice(0, 10)}...`
    } else {
        return item.name
    }
}

function setCalendarView() {
    const preference = repoUser.userInfo.preference
    const calendarViewType = preference?.event.calendarViewType
    if (calendarViewType) {
        venoniaCalendarRef.value?.changeView(calendarViewType)
    }
}
async function handleDatesSet(datesSetArg: DatesSetArg) {
    const { view } = datesSetArg
    const type = view.type as 'dayGridMonth' | 'dayGridWeek' | 'listWeek'
    const preferenceEvnet: IPreferenceEvent = {
        calendarViewType: type,
    }
    repoUser.patchUserPreference('event', preferenceEvnet)

    // // Remove Google Calendar Events
    // const calendarEvent = venoniaCalendarRef.value.getEventById(String(templateDesign.eventId))
    // calendarEvent?.remove()

    // // Get Google Calender Events
    // const orgsWithCalendar = organizationList.value.filter((org) => {
    //     return selectedOrganizationIds.value.includes(org.id) && org.googleCalendarId
    // });

    // orgsWithCalendar.forEach(async org => {
    //     const timeMin = new Date(view.currentStart).toISOString()
    //     const timeMax = new Date(view.currentEnd).toISOString()
    //     const eventList = await repoGoogle.getGoogleCalendarEvents({
    //         calendarId: org.googleCalendarId,
    //         timeMin,
    //         timeMax,
    //     })
    //     eventList.forEach((event: IEvent) => {
    //         const fullCalendarEvent = parseFullCalendarEvent(event)
    //         venoniaCalendarRef.value?.addEvent(fullCalendarEvent)
    //     })
    // })
}

async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
    // 預設全選
    selectedOrganizationIds.value = result.map(org => {
        return org.id
    })
}

async function handleEventFormChange(templateDesign: ITemplateDesign) {
    isDialogPatchLoading.value = true
    if (!currentEvent.value || !venoniaCalendarRef.value) {
        return
    }
    templateDesign.eventId = currentEvent.value.id
    await repoEvent.patchEventForm(templateDesign)
    if (templateDesign.sqlField === 'date') {
        const calendarEvent = venoniaCalendarRef.value.getEventById(String(templateDesign.eventId))
        calendarEvent?.remove()
        currentEvent.value.startDate = new Date(templateDesign.mutable?.value[0]).toISOString()
        currentEvent.value.endDate = new Date(templateDesign.mutable?.value[1]).toISOString()
        const newFullCalendarEvent = parseFullCalendarEvent(currentEvent.value)
        venoniaCalendarRef.value.addEvent(newFullCalendarEvent)
    }
    isDialogPatchLoading.value = false
}

async function getEventList() {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)

    calendarEventList.value = await repoEvent.getEventList({
        startDate: startOfTheMonth.toISOString(),
    })

    const fullCalendarEventList: IFullCalendarEvent[] = calendarEventList.value.map(event => {
        return parseFullCalendarEvent(event, true)
    })

    fullCalendarEventList.forEach(event => {
        venoniaCalendarRef.value?.addEvent(event)
    })
}

function parseFullCalendarEvent(event: IEvent, editable = false): IFullCalendarEvent {
    return {
        id: String(event.id),
        title: String(event.name ?? '未命名'),
        start: String(event.startDate),
        end: String(event.endDate),
        startStr: String(event.startDate),
        endStr: String(event.endDate),
        editable,
    }
}

async function handleEventCalendarChange(changeInfo: IChangeInfo) {
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

    // 送出請求
    await repoEvent.patchEventCalendar({
        id: eventId,
        dateDesignId: changedEvent?.dateDesignId,
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString()
    })
}

async function handleEventClick(eventClickInfo: IEventClickInfo) {
    const eventId = eventClickInfo.event.id
    eventClickInfo.event.name = eventClickInfo.event.title // Full Calendar Event轉換
    currentEvent.value = eventClickInfo.event
    const eventTemplate: IEventTemplate = await repoEvent.getEvent(eventId)
    dialogTemplate.value.eventId = eventId // 用這行刪除
    Object.assign(dialogTemplate.value, eventTemplate)
    eventDialogIsOpen.value = true
}

async function openNewEventDialog(eventCreation: IEventCreation) {
    calendarEventCreation.value = eventCreation
    loadTemplateDialogIsOpen.value = true
}

async function openCalendarEvent() {
    loadTemplateDialogIsOpen.value = false
    const seoDateTimeRange = dialogTemplate.value.designs.find((design) => {
        return design.type === 'dateTimeRange'
    })

    if (seoDateTimeRange?.mutable && calendarEventCreation.value) {
        const { date } = calendarEventCreation.value
        seoDateTimeRange.mutable.value = [date, date]
    }

    const newEvent = await repoEvent.postEvent(dialogTemplate.value)
    currentEvent.value = newEvent
    dialogTemplate.value.eventId = newEvent.eventId
    eventDialogIsOpen.value = true
    await getEventList() // 在背景更新月曆事件
}

async function cancelEventEditing() {
    eventDialogIsOpen.value = false
}

async function deleteEvent() {
    isLoading.value = true
    if (dialogTemplate.value.eventId) {
        await repoEvent.deleteEvent(dialogTemplate.value.eventId)
        venoniaCalendarRef.value?.removeAllEvents()
        await getEventList()
        eventDialogIsOpen.value = false
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