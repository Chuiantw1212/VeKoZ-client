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
                    ({{ dialogTemplate.id }})
                </el-text>
            </template>
            <template #headerUI>
                <el-button v-if="dialogTemplate.id" v-loading="isDialogPatchLoading" :icon="Delete" text
                    @click="deleteEvent()">
                </el-button>
                |
                <el-switch v-loading="isDialogPatchLoading" v-model="dialogTemplate.isPublic" inline-prompt
                    active-text="已公開" inactive-text="非公開" @change="validiateForm()" />
                |
                <NuxtLink :to="`/event/${dialogTemplate.id}`" target="_blank">
                    <el-button :icon="View" text :disabled="!dialogTemplate.isPublic">

                    </el-button>
                </NuxtLink>
                <el-button :icon="Close" text @click="cancelEventEditing()">
                </el-button>
            </template>
            <template #default>
                <!-- 用v-if避免更新請求重複派送 -->
                <el-container v-loading.lock="isLoading" v-if="eventDialogIsOpen">
                    <FormTemplateDesign ref="formRef" v-model="dialogTemplate.designs"
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
            <FormReadEventTemplate v-model="dialogTemplate" @update:modelValue="openNewCalendarEvent()">
            </FormReadEventTemplate>
        </AtomVenoniaDialog>
    </div>
</template>

<script setup lang="ts">
import { Delete, Close, View } from '@element-plus/icons-vue';
import type { IEvent, IEventCreation, } from '~/types/event';
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
const calendarEventCreation = ref<IEventCreation>()
const calendarEventList = ref<IEvent[]>([])
// Data sidemenu
const organizationList = ref<IOrganization[]>([])
const selectedOrganizationIds = ref<string[]>([])
// Data Dialog
const isDialogPatchLoading = ref<boolean>(false)
const eventDialogIsOpen = ref<boolean>(false)
const currentEvent = ref<IEvent>({})
const dialogTemplate = ref<IEventTemplate>({
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
    if (!dialogTemplate.value || !venoniaCalendarRef.value) {
        return
    }
    const calendarEvent = venoniaCalendarRef.value.getEventById(String(dialogTemplate.value.id))
    if (!calendarEvent) {
        return
    }
    try {
        if (dialogTemplate.value.isPublic) {
            const isValid = await formRef.value?.validate()
            if (isValid) {
                await repoEvent.patchEventCalendar({
                    id: dialogTemplate.value.id,
                    isPublic: true,
                })
                if (currentEvent.value) {
                    calendarEvent.setProp('backgroundColor', '')
                    // calendarEvent.setProp('textColor', '')
                    calendarEvent.setProp('classNames', [])
                }
                return true // 回傳新增已公開月曆事件
            }
        } else {
            await repoEvent.patchEventCalendar({
                id: dialogTemplate.value.id,
                isPublic: false,
            })
        }
    } catch (error) {
        dialogTemplate.value.isPublic = false
        await repoEvent.patchEventCalendar({
            id: dialogTemplate.value.id,
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
    isDialogPatchLoading.value = false

    // update fullcalendar event
    const calendarEvent = venoniaCalendarRef.value.getEventById(String(templateDesign.eventId))
    if (!calendarEvent || !templateDesign.mutable) {
        return
    }
    switch (templateDesign.formField) {
        case 'name': {
            calendarEvent.setProp('title', templateDesign.mutable.value)
            break;
        }
        case 'dates': {
            calendarEvent.setDates(templateDesign.mutable.value[0], templateDesign.mutable.value[1])
            break;
        }
    }

}

async function getEventList() {
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)

    const condition: IEvent = {
        startDate: startOfTheMonth,
    }

    const hasStatus = calendarStatus.value.length === 1
    const selectedStatus: string = String(calendarStatus.value[0])
    if (hasStatus && selectedStatus === 'public') {
        condition.isPublic = true
    }
    if (hasStatus && selectedStatus === 'private') {
        condition.isPublic = false
    }
    calendarEventList.value = await repoEvent.getEventList(condition)

    const fullCalendarEventList: IFullCalendarEvent[] = calendarEventList.value.map(event => {
        return parseFullCalendarEvent(event, true)
    })

    venoniaCalendarRef.value?.removeAllEvents()

    fullCalendarEventList.forEach(event => {
        venoniaCalendarRef.value?.addEvent(event)
    })
}

function parseFullCalendarEvent(event: IEvent, editable = false): IFullCalendarEvent {
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

async function handleEventCalendarChange(changeInfo: IChangeInfo) {
    /**
     * 疑似BUG，無法直接拿到endDateStr
     */
    const eventId = changeInfo.event.id
    const changedEvent = calendarEventList.value.find(event => {
        return event.id === eventId
    })
    if (!changedEvent) {
        return
    }
    const oldEndDate = String(changedEvent.endDate)
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
        offerCategoryIds: changedEvent.offerCategoryIds,
        dateDesignId: changedEvent?.dateDesignId,
        startDate: newStartDate,
        endDate: newEndDate,
    })
}

async function handleEventClick(eventClickInfo: IEventClickInfo) {
    const eventId = eventClickInfo.event.id
    eventClickInfo.event.name = eventClickInfo.event.title // Full Calendar Event轉換
    currentEvent.value = eventClickInfo.event
    isLoading.value = true
    const eventTemplate: IEventTemplate = await repoEvent.getEvent(eventId)
    isLoading.value = false
    if (eventTemplate) {
        dialogTemplate.value = eventTemplate
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
    const newEvent = await repoEvent.postEvent(dialogTemplate.value)
    currentEvent.value = newEvent // 繞過full calendar內部bug使用
    dialogTemplate.value = newEvent // 呈現給使用者編輯使用

    const calendarEvent = parseFullCalendarEvent(newEvent, true)
    venoniaCalendarRef.value?.addEvent(calendarEvent)
    eventDialogIsOpen.value = true
    // // dialog打開後才可以透過formRef檢核
    // nextTick(async () => { // 至少要設定時間，所以自動打開並不合理
    //     dialogTemplate.value.isPublic = true
    //     validiateForm()
    // })
}

async function cancelEventEditing() {
    eventDialogIsOpen.value = false
}

async function deleteEvent() {
    isLoading.value = true
    if (dialogTemplate.value.id) {
        await repoEvent.deleteEvent(dialogTemplate.value.id)
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