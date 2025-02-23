<template>
    <div class="event">
        <el-row :gutter="20">
            <el-col :span="repoUI.isXLarge ? 19 : 24">
                <el-card v-loading.lock="isLoading">
                    <MoleculeVenoniaCalendar ref="venoniaCalendarRef" @create="openNewEventDialog($event)"
                        @eventChange="handleEventCalendarChange($event)" @event-click="handleEventClick($event)"
                        @dates-set="handleDatesSet($event)">
                    </MoleculeVenoniaCalendar>
                </el-card>
            </el-col>
            <el-col v-if="repoUI.isXLarge" :span="5">
                <el-card>
                    <el-form>
                        <!-- <el-form-item label="事件狀態">
                            <el-checkbox-group v-model="calendarStatus" @change="getEventList">
                                <el-checkbox v-for="(item) in calendatPublicOptins" :label="item.label"
                                    :value="item.value" />
                            </el-checkbox-group>
                        </el-form-item> -->
                        <!-- <el-checkbox-group v-model="selectedOrganizationIds">
                            <el-checkbox v-for="(item) in organizationList" :label="trimOrganizationName(item)"
                                :value="item.id" />
                        </el-checkbox-group> -->
                        <el-divider content-position="left">Todo</el-divider>
                        如果是多日的活動，就要個別編輯不同課堂的資料，比如當日教學內容。
                    </el-form>
                </el-card>
            </el-col>
        </el-row>

        <AtomVenoniaDialog v-model="eventDialogIsOpen" :showClose="false">
            <template #header>
                <el-text size="large">
                    活動編輯
                    ({{ dialogEventTemplate.id }})
                </el-text>
            </template>
            <template #headerUI>
                <el-button v-if="dialogEventTemplate.id" v-loading="isDialogPatchLoading" :icon="Delete" text
                    @click="deleteEvent()">
                </el-button>
                |
                <el-switch v-loading="isDialogPatchLoading" v-model="dialogEventTemplate.isPublic" inline-prompt
                    active-text="已公開" inactive-text="非公開" @change="validiateForm()" />
                |
                <NuxtLink :to="`/event/${dialogEventTemplate.id}`" target="_blank">
                    <el-button :icon="View" text :disabled="!dialogEventTemplate.isPublic">

                    </el-button>
                </NuxtLink>
                <el-button :icon="Close" text @click="cancelEventEditing()">
                </el-button>
            </template>
            <template #default>
                <!-- 用v-if避免更新請求重複派送 -->
                <el-container v-loading.lock="isLoading" v-if="eventDialogIsOpen">
                    <FormTemplateDesign ref="formRef" v-model="dialogEventTemplate.designs"
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
            <FormReadEventTemplate v-model="dialogEventTemplate" @update:modelValue="openNewCalendarEvent()">
            </FormReadEventTemplate>
        </AtomVenoniaDialog>
    </div>
</template>

<script setup lang="ts">
import { Delete, Close, View } from '@element-plus/icons-vue';
import type { IEventFromList, IEventCreation, } from '~/types/event';
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'
import type { CalendarApi, DatesSetArg, EventSourceInput } from '@fullcalendar/core/index.js';
import type { IChangeInfo, IFullCalendarEvent, IEventClickInfo } from '~/types/fullCalendar';
import type { IOrganization } from '~/types/organization';
import type { IPreferenceEvent } from '~/types/user';
import type { FormInstance } from 'element-plus';
// Data Repo
const repoEvent = useRepoEvent()
const repoOrganization = useRepoOrganization()
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoGoogle = useRepoGoogle()
const isLoading = ref<boolean>(false)
// Data Calendar
const calendatPublicOptins = ref([
    {
        label: '已公開',
        value: 'public',
    },
    {
        label: '未公開',
        value: 'private',
    }
])
const calendarStatus = ref<string[]>(['public', 'private'])
const googleCalendarEventIds = ref<string[]>([])
const venoniaCalendarRef = ref<CalendarApi>()
const calendarEventCreation = ref<IEventCreation>({
    date: '',
})
const calendarEventList = ref<IEventFromList[]>([])
// Data sidemenu
const organizationList = ref<IOrganization[]>([])
const selectedOrganizationIds = ref<string[]>([])
// Data Dialog
const isDialogPatchLoading = ref<boolean>(false)
const eventDialogIsOpen = ref<boolean>(false)
const dialogEventTemplate = ref<IEventTemplate>({
    designs: []
})
const loadTemplateDialogIsOpen = ref<boolean>(false)
const formRef = ref<FormInstance>()
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
watch((() => repoUser.userPreference), () => {
    setCalendarView()
}, { immediate: true, deep: true })

// Methods
async function validiateForm() {
    console.log('validiateForm')
    if (!dialogEventTemplate.value || !venoniaCalendarRef.value) {
        return
    }
    const calendarEvent = venoniaCalendarRef.value.getEventById(String(dialogEventTemplate.value.id))
    if (!calendarEvent) {
        return
    }
    try {
        if (dialogEventTemplate.value.isPublic) {
            const isValid = await formRef.value?.validate()
            if (isValid) {
                await repoEvent.patchEventCalendar({
                    id: dialogEventTemplate.value.id,
                    isPublic: true,
                })
                calendarEvent.setProp('backgroundColor', '')
                calendarEvent.setProp('classNames', [])
                return true // 回傳新增已公開月曆事件
            }
        } else {
            await repoEvent.patchEventCalendar({
                id: dialogEventTemplate.value.id,
                isPublic: false,
            })
        }
    } catch (error) {
        dialogEventTemplate.value.isPublic = false
        await repoEvent.patchEventCalendar({
            id: dialogEventTemplate.value.id,
            isPublic: false,
        })
    }
    // Fail fallback to private
    calendarEvent.setProp('backgroundColor', 'lightblue')
    // calendarEvent.setProp('textColor', 'lightblue')
    calendarEvent.setProp('classNames', ['blue-text-event'])
}
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
    //     const timeMin = new Date(view.currentStart)
    //     const timeMax = new Date(view.currentEnd)
    //     const eventList = await repoGoogle.getGoogleCalendarEvents({
    //         calendarId: org.googleCalendarId,
    //         timeMin,
    //         timeMax,
    //     })
    //     eventList.forEach((event: IEventFromList) => {
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
    if (!venoniaCalendarRef.value) {
        return
    }
    // await repoEvent.patchEventForm(templateDesign)
    // isDialogPatchLoading.value = false

    /**
     * Will trigger handleEventCalendarChange
     */
    const calendarEvent = venoniaCalendarRef.value.getEventById(String(templateDesign.eventId))
    if (!calendarEvent || !templateDesign) {
        return
    }
    switch (templateDesign.formField) {
        case 'name': {
            calendarEvent.setProp('title', templateDesign.value)
            break;
        }
        case 'dates': {
            /**
             * 這邊這樣是因為calendarEvent.setDates會觸發補丁
             */
            const changedEvent = calendarEventList.value.find(event => {
                return event.id === templateDesign.eventId
            })
            if (changedEvent) {
                changedEvent.startDate = templateDesign.value[0]
                changedEvent.endDate = templateDesign.value[1]
                calendarEvent.setDates(templateDesign.value[0], templateDesign.value[1])
            }
            break;
        }
        default: {
            await repoEvent.patchEventForm(templateDesign)
        }
    }
    isDialogPatchLoading.value = false
}

async function getEventList() {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)

    // const condition: IEventFromList = {
    //     startDate: startOfTheMonth,
    // }

    // const hasStatus = calendarStatus.value.length === 1
    // const selectedStatus: string = String(calendarStatus.value[0])
    // if (hasStatus && selectedStatus === 'public') {
    //     condition.isPublic = true
    // }
    // if (hasStatus && selectedStatus === 'private') {
    //     condition.isPublic = false
    // }
    calendarEventList.value = await repoEvent.getEventList({
        startDate: startOfTheMonth,
    })

    const fullCalendarEventList: IFullCalendarEvent[] = calendarEventList.value.map(event => {
        return parseFullCalendarEvent(event, true)
    })

    venoniaCalendarRef.value?.removeAllEvents()

    fullCalendarEventList.forEach(event => {
        venoniaCalendarRef.value?.addEvent(event)
    })
}

async function handleEventCalendarChange(changeInfo: IChangeInfo) {
    // console.trace(changeInfo)
    /**
     * 1. 疑似BUG，無法直接拿到endDateStr
     * 2. 從月曆與直接改form最終都會觸發這個function
     */
    const eventId = changeInfo.event.id
    const changedEvent = calendarEventList.value.find(event => {
        return event.id === eventId
    })
    if (!changedEvent) {
        return
    }
    if (dialogEventTemplate.value.id === eventId) {
        changedEvent.isPublic = dialogEventTemplate.value.isPublic
    }

    // 用Event資料找出該Event的時間日期，所以會找到舊的
    const oldEndDate = String(changedEvent.endDate)
    const newStartDate: Date = changeInfo.event.start as Date
    const newYear = newStartDate.getFullYear()
    const newMonth = newStartDate.getMonth()
    const newDate = newStartDate.getDate()
    const newEndDate = new Date(oldEndDate)
    const originHour = newEndDate.getHours()
    const originMinutes = newEndDate.getMinutes()
    newEndDate.setFullYear(newYear, newMonth, newDate,)
    newEndDate.setHours(originHour, originMinutes, 0, 0,)

    // 送出請求
    await repoEvent.patchEventCalendar({
        id: eventId,
        offerCategoryIds: changedEvent.offerCategoryIds,
        dateDesignId: changedEvent?.dateDesignId,
        startDate: newStartDate,
        endDate: newEndDate,
        isPublic: changedEvent.isPublic,
    })
}

function parseFullCalendarEvent(event: IEventFromList, editable = false): IFullCalendarEvent {
    const title = String(event.name || '未命名')
    // const todos = '1/2'
    /**
     * Event Object
     * https://fullcalendar.io/docs/event-object
     */
    const iFullCalendarEvent: IFullCalendarEvent = {
        id: String(event.id),
        title: `${title}`,
        start: '',
        end: '',
        startStr: '',
        endStr: '',
        editable,
        backgroundColor: 'lightblue',
        // textColor: 'lightblue',
        classNames: ['blue-text-event']
    }
    if (event.isPublic) {
        delete iFullCalendarEvent.backgroundColor
        // delete iFullCalendarEvent.textColor
        delete iFullCalendarEvent.classNames
    }
    const startDate = event.startDate
    if (startDate instanceof Date) {
        iFullCalendarEvent.start = startDate
        iFullCalendarEvent.startStr = startDate.toISOString()
    } else {
        iFullCalendarEvent.start = new Date(String(startDate))
        iFullCalendarEvent.startStr = startDate
    }
    const endDate = event.endDate
    if (endDate instanceof Date) {
        iFullCalendarEvent.end = endDate
        iFullCalendarEvent.startStr = endDate.toISOString()
    } else {
        iFullCalendarEvent.end = new Date(String(endDate))
        iFullCalendarEvent.endStr = endDate
    }
    return iFullCalendarEvent
}

async function handleEventClick(eventClickInfo: IEventClickInfo) {
    const eventId = eventClickInfo.event.id
    eventClickInfo.event.name = eventClickInfo.event.title // Full Calendar Event轉換
    isLoading.value = true
    const eventTemplate: IEventTemplate = await repoEvent.getEvent(eventId)
    isLoading.value = false
    if (eventTemplate) {
        dialogEventTemplate.value = eventTemplate
        eventDialogIsOpen.value = true
    } else {
        const calendarEvent = venoniaCalendarRef.value?.getEventById(eventId)
        calendarEvent?.remove()
    }
}

async function openNewEventDialog(eventCreation: IEventCreation) {
    calendarEventCreation.value = eventCreation
    loadTemplateDialogIsOpen.value = true
}

async function openNewCalendarEvent() {
    loadTemplateDialogIsOpen.value = false
    const date = calendarEventCreation.value.date
    const selectedDateInstance = new Date(date)
    const selectedYear = selectedDateInstance.getFullYear()
    const selectedMonth = selectedDateInstance.getMonth()
    const selectedDate = selectedDateInstance.getDate()

    // 給定新月曆所選擇的值
    const dateDesign = dialogEventTemplate.value.designs.find(design => {
        return design.formField === 'dates'
    })
    if (dateDesign && dateDesign.startDate && dateDesign.endDate) {
        const startDate = new Date(dateDesign.startDate ?? '')
        startDate.setFullYear(selectedYear)
        startDate.setMonth(selectedMonth)
        startDate.setDate(selectedDate)
        const originalStartHour = startDate.getHours()
        const originalStartMinues = startDate.getMinutes()
        const defaultStartHour = Math.max(originalStartHour, 6)
        startDate.setHours(defaultStartHour, originalStartMinues, 0, 0)
        const endDate = new Date(dateDesign.endDate ?? '')
        endDate.setFullYear(selectedYear)
        endDate.setMonth(selectedMonth)
        endDate.setDate(selectedDate)
        endDate.setHours(defaultStartHour + 1, originalStartMinues, 0, 0)
        dateDesign.value = [startDate.toISOString(), endDate.toISOString()]
    }

    // return
    const newEvent = await repoEvent.postEvent(dialogEventTemplate.value)
    dialogEventTemplate.value = newEvent // 呈現給使用者編輯使用

    const calendarEvent = parseFullCalendarEvent(newEvent, true)
    venoniaCalendarRef.value?.addEvent(calendarEvent)
    eventDialogIsOpen.value = true
}

async function cancelEventEditing() {
    // 關閉時，清空資料
    dialogEventTemplate.value = {
        designs: []
    }
    eventDialogIsOpen.value = false
}

async function deleteEvent() {
    isLoading.value = true
    if (dialogEventTemplate.value.id) {
        await repoEvent.deleteEvent(dialogEventTemplate.value.id)
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

:deep(.blue-text-event) {
    color: lightblue;
}
</style>