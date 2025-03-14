<template>
    <div class="event">
        <el-row :gutter="20">
            <el-col :span="repoUI.isXLarge ? 19 : 24">
                <el-card v-loading.lock="isLoading">
                    <MoleculeVekozCalendar ref="vekozCalendarRef" @create="openNewEventDialog"
                        @eventChange="handleEventCalendarChange" @event-click="handleEventClick"
                        @dates-set="handleDatesSet" @mounted="getCalendarEvents">
                    </MoleculeVekozCalendar>
                </el-card>
            </el-col>
            <el-col v-if="repoUI.isXLarge" :span="5">
                <el-card>
                    <template #header>
                        <div class="card__header">
                            組織行事曆
                            <el-button :icon="More" :text="true" :circle="true" @click="openOrgCalendarModal()">

                            </el-button>
                        </div>
                    </template>
                    <AtomVekozCheckboxGroup v-model="selectedOrganizationIds" :items="memberOrganizationList"
                        :item-label="'organizationName'" :item-value="'organizationId'"
                        @change="updatePreferneceOrgs()">
                    </AtomVekozCheckboxGroup>
                    <!-- <el-checkbox-group v-model="selectedOrganizationIds" @change="updatePreferneceOrgs()">
                        <template v-for="(item) in memberOrganizationList">
                            <el-checkbox :value="item.organizationId" :label="trimOrganizationName(item)" />
                        </template>
                    </el-checkbox-group> -->
                </el-card>
                <el-card class="event__todoList">
                    <template #header>
                        待辦事項
                    </template>
                    <el-row>
                        未完成的海報
                    </el-row>
                    <el-row>
                        未完成的海報
                    </el-row>
                </el-card>
            </el-col>
        </el-row>

        <AtomVekozDialog v-model="eventDialogIsOpen" :showClose="false">
            <template #header>
                <el-avatar :src="dialogEventTemplate.organizerLogo"></el-avatar>
                <el-text size="large">
                    活動編輯
                    ({{ dialogEventTemplate.id }})
                </el-text>
            </template>
            <template #headerUI>
                <el-button v-if="dialogEventTemplate.id" v-loading="isDialogPatchLoading" :disabled="eventDisabled"
                    :icon="Delete" text @click="deleteEvent()">
                </el-button>
                |
                <el-switch v-loading="isDialogPatchLoading" v-model="dialogEventTemplate.isPublic" inline-prompt
                    active-text="已公開" inactive-text="非公開" :disabled="eventDisabled" @change="validiateForm()" />
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
                    <FormEventTemplate ref="formRef" v-if="eventDialogIsOpen" v-model="dialogEventTemplate"
                        :disabled="eventDisabled" :onchange="handleEventFormChange">
                    </FormEventTemplate>
                </el-container>
            </template>
        </AtomVekozDialog>

        <AtomVekozDialog v-model="loadTemplateDialogIsOpen" :showClose="true">
            <FormTemplateSelecting v-model="dialogEventTemplate" @update:modelValue="openNewCalendarEvent()">
            </FormTemplateSelecting>
        </AtomVekozDialog>

        <AtomVekozDialog v-model="orgCalendarModalVisible" :showClose="true">
            <template #header>
                組織行事曆
            </template>
            <FormOrganizationCalendarList v-model="memberOrganizationList"></FormOrganizationCalendarList>
        </AtomVekozDialog>
    </div>
</template>

<script setup lang="ts">
import { Delete, Close, View, More } from '@element-plus/icons-vue';
import type { IEventFromList, IEventCreation, IEventSingle, } from '~/types/event';
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { CalendarApi, DatesSetArg, EventApi } from '@fullcalendar/core/index.js';
import type { IChangeInfo, IFullCalendarEvent, IEventClickInfo } from '~/types/fullCalendar';
import type { IOrganizationMember } from '~/types/organization';
import type { IPreferenceEvent } from '~/types/user';
import type { FormInstance, } from 'element-plus';
import { ElMessage } from 'element-plus';
// Data Repo
const repoEvent = useRepoEvent()
const repoOrganizationMeber = useRepoOrganizationMember()
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoGoogle = useRepoGoogle()
const isLoading = ref<boolean>(false)
// Data Calendar
const calendarStatus = ref<string[]>(['public', 'private'])
const googleCalendarEventIds = ref<string[]>([])
const vekozCalendarRef = ref<CalendarApi>()
const calendarEventCreation = ref<IEventCreation>({
    date: new Date(),
})
const vekozEventList = ref<IEventFromList[]>([])
// const vekozEventMap = ref<{ [key: string]: IEventFromList[] }>({})

// Data sidemenu
const memberOrganizationList = ref<IOrganizationMember[]>([])
const selectedOrganizationIds = ref<string[]>([])
// Data Dialog
const isDialogPatchLoading = ref<boolean>(false)
const eventDialogIsOpen = ref<boolean>(false)
const dialogEventTemplate = ref<IEventSingle>({
    designs: []
})
const eventDisabled = ref<boolean>(false)
const loadTemplateDialogIsOpen = ref<boolean>(false)
const formRef = ref<FormInstance>()

// 組織月曆管理
const orgCalendarModalVisible = ref<boolean>(false)

// Hooks
/**
 * 觸發來源
 * 初始化&更新月曆組織
 */
watch((() => repoUser.preference.event), () => {
    isLoading.value = true
    repoUI.debounce('preferenceEventChanged', async () => {
        await getMemberOrganizationList()
        setCalendarView()
        isLoading.value = false
    })
}, { immediate: true, deep: true })

// Methods
function openOrgCalendarModal() {
    orgCalendarModalVisible.value = true
}

function updatePreferneceOrgs() {
    const preference: IPreferenceEvent = {
        organizerIds: selectedOrganizationIds.value,
    }
    repoUser.patchUserPreference('event', preference)
}

async function validiateForm() {
    if (!dialogEventTemplate.value || !vekozCalendarRef.value) {
        return
    }
    const calendarEvent = vekozCalendarRef.value.getEventById(String(dialogEventTemplate.value.id))
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
    // calendarEvent.setProp('backgroundColor', 'lightblue')
}

function trimOrganizationName(item: IOrganizationMember) {
    if (item.organizationName) {
        if (item.organizationName.length >= 12) {
            return `${item.organizationName.slice(0, 10)}...`
        } else {
            return item.organizationName
        }
    }
}

function setCalendarView() {
    const preference = repoUser.userInfo.preference
    const calendarViewType = preference?.event.calendarViewType
    if (calendarViewType) {
        vekozCalendarRef.value?.changeView(calendarViewType)
    }
}
async function handleDatesSet(datesSetArg: DatesSetArg) {
    const { start, endStr, view } = datesSetArg
    // console.log({
    //     datesSetArg
    // })
    const type = view.type as 'dayGridMonth' | 'dayGridWeek' | 'listWeek'
    const preferenceEvnet: IPreferenceEvent = {
        calendarViewType: type,
    }

    // 更新偏好
    repoUser.patchUserPreference('event', preferenceEvnet)

    // 移除所有事件資料
    const calendarEvents: EventApi[] | undefined = vekozCalendarRef.value?.getEvents()
    if (calendarEvents) {
        calendarEvents.forEach(event => {
            event.remove()
        })
    }

    getCalendarEvents({
        start
    })
    // // Remove Google Calendar Events
    // const calendarEvent = vekozCalendarRef.value.getEventById(String(templateDesign.eventId))
    // calendarEvent?.remove()

    // // Get Google Calender Events
    // const orgsWithCalendar = memberOrganizationList.value.filter((org) => {
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
    //         vekozCalendarRef.value?.addEvent(fullCalendarEvent)
    //     })
    // })
}

async function getCalendarEvents(payload: any) {
    const start = payload.start

    // 抓取當月事件資料
    vekozEventList.value = []
    selectedOrganizationIds.value.forEach(async (organizerId: string) => {
        const orgEventList = await repoEvent.getEventList({
            organizerId: organizerId,
            startDate: start,
            allowMethods: ['GET'],
        })
        vekozEventList.value.push(...orgEventList)
        // vekozEventMap.value[organizerId] = orgEventList

        const fullCalendarEventList: IFullCalendarEvent[] = orgEventList.map(event => {
            return parseFullCalendarEvent(event)
        })

        fullCalendarEventList.forEach(event => {
            vekozCalendarRef.value?.addEvent(event)
        })
    })
}

async function getMemberOrganizationList() {
    // 取得用戶組織列表
    const result = await repoOrganizationMeber.getMemberOrganizationList()
    if (!result) {
        return
    }
    memberOrganizationList.value = result.items

    // 勾選組織
    const preferenceOrgs = repoUser.preference.event.organizerIds
    if (preferenceOrgs) {
        selectedOrganizationIds.value = preferenceOrgs
    } else {
        selectedOrganizationIds.value = result.items.map((membership: IOrganizationMember) => {
            return membership.organizationId ?? ''
        })
    }
}

async function handleEventFormChange(templateDesign: ITemplateDesign) {
    isDialogPatchLoading.value = true
    if (!vekozCalendarRef.value) {
        return
    }
    /**
     * calendarEvent.call Will trigger handleEventCalendarChange
     */
    const calendarEvent = vekozCalendarRef.value.getEventById(String(templateDesign.eventId))
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
            const changedEvent = vekozEventList.value.find(event => {
                return event.id === templateDesign.eventId
            })
            if (changedEvent) {
                let startTime: number = 0
                if (typeof templateDesign.value[0] === 'string') {
                    startTime = new Date(templateDesign.value[0]).getTime()
                } else {
                    startTime = templateDesign.value[0].getTime()
                }
                const nowTime = new Date().getTime()
                if (nowTime >= startTime) {
                    return
                }
                changedEvent.startDate = templateDesign.value[0]
                changedEvent.endDate = templateDesign.value[1]
                calendarEvent.setDates(templateDesign.value[0], templateDesign.value[1])
            }
            break;
        }
    }
    await repoEvent.patchEventForm(templateDesign)
    isDialogPatchLoading.value = false
}

async function handleEventCalendarChange(changeInfo: IChangeInfo) {
    const event: IFullCalendarEvent = changeInfo.event
    const eventId = changeInfo.event.id
    const startDate = new Date(event.startStr ?? '')
    const endDate = new Date(event.endStr ?? '')
    const nowTime = new Date().getTime()
    if (nowTime >= startDate.getTime()) {
        ElMessage('不可變更為過去事件。')
        const oldEvent = changeInfo.oldEvent
        const calendarEvent = vekozCalendarRef.value?.getEventById(eventId)
        if (calendarEvent) {
            calendarEvent.setDates(oldEvent.start, oldEvent.end)
        }
        return
    }

    const eventPatch: IEventFromList = {
        id: event.id,
        startDate,
        endDate,
    }
    const vekozEvent = vekozEventList.value.find(event => {
        return event.id === eventId
    })
    if (vekozEvent) {
        eventPatch.offerCategoryIds = vekozEvent.offerCategoryIds
        // eventPatch.isPublic = vekozEvent.isPublic // 這會導致事件永遠打不開
        eventPatch.dateDesignId = vekozEvent.dateDesignId
        eventPatch.organizerId = vekozEvent.organizerId
    }
    await repoEvent.patchEventCalendar(eventPatch)
}

function parseFullCalendarEvent(event: IEventFromList): IFullCalendarEvent {
    const selectedMembership = memberOrganizationList.value.find(membership => {
        return membership.organizationId === event.organizerId
    })

    /**
     * Event Object
     * https://fullcalendar.io/docs/event-object
     */
    const title = String(event.name || '未命名')
    const iFullCalendarEvent: IFullCalendarEvent = {
        id: String(event.id),
        title: `${title}`,
        start: '',
        end: '',
        startStr: '',
        endStr: '',
        editable: event.eventStatus !== 'ended',
        backgroundColor: selectedMembership?.calendarColor,
        // textColor: 'lightblue',
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
    // if (currentTime >= iFullCalendarEvent.end.getTime()) {
    //     iFullCalendarEvent.editable = false
    // }
    return iFullCalendarEvent
}

async function handleEventClick(eventClickInfo: IEventClickInfo) {
    const eventId = eventClickInfo.event.id
    eventClickInfo.event.name = eventClickInfo.event.title // Full Calendar Event轉換
    isLoading.value = true
    const eventTemplate: IEventSingle = await repoEvent.getEvent(eventId)
    const selectedEventMaster = vekozEventList.value.find(event => {
        return event.id === eventId
    })
    if (selectedEventMaster) {
        const relatedMembership = memberOrganizationList.value.find(item => {
            return item.organizationId === selectedEventMaster?.organizerId
        })
        eventTemplate.allowMethods = relatedMembership?.allowMethods
    }
    dialogEventTemplate.value = eventTemplate
    isLoading.value = false

    if (eventTemplate.designs) {
        const designDates = eventTemplate.designs.find(design => {
            return design.formField === 'dates'
        })
        if (designDates) {
            eventDisabled.value = false

            const startTime = new Date(designDates.value[0]).getTime()
            const currentTime = new Date().getTime()
            const isEnded = currentTime >= startTime

            const hasNoAuth = !eventTemplate.allowMethods?.includes('PATCH')
            if (isEnded || hasNoAuth) {
                eventDisabled.value = true
            }
        }
        eventDialogIsOpen.value = true
    } else {
        const calendarEvent = vekozCalendarRef.value?.getEventById(eventId)
        calendarEvent?.remove()
    }
}

async function openNewEventDialog(eventCreation: IEventCreation) {
    // 紀錄點擊的日期
    calendarEventCreation.value = eventCreation
    loadTemplateDialogIsOpen.value = true
}

async function openNewCalendarEvent() {
    // eventDisabled.value = false
    loadTemplateDialogIsOpen.value = false

    // 給定新月曆所選擇的值
    const selectedDateInstance = calendarEventCreation.value.date
    const selectedYear = selectedDateInstance.getFullYear()
    const selectedMonth = selectedDateInstance.getMonth()
    const selectedDate = selectedDateInstance.getDate()
    const dateDesign = dialogEventTemplate.value.designs?.find(design => {
        return design.formField === 'dates'
    })
    if (dateDesign?.value) {
        if (dateDesign.value[0]) {
            const startDate = new Date(dateDesign.value[0] ?? '')
            startDate.setFullYear(selectedYear)
            startDate.setMonth(selectedMonth)
            startDate.setDate(selectedDate)
            const originalStartHour = startDate.getHours()
            const originalStartMinues = startDate.getMinutes()
            const defaultStartHour = Math.max(originalStartHour, 6)
            startDate.setHours(defaultStartHour, originalStartMinues, 0, 0)
            dateDesign.value[0] = startDate
        }
        if (dateDesign.value[1]) {
            const endDate = new Date(dateDesign.value[1] ?? '')
            const originalEndHour = endDate.getHours()
            const originalEndMinues = endDate.getMinutes()
            endDate.setFullYear(selectedYear)
            endDate.setMonth(selectedMonth)
            endDate.setDate(selectedDate)
            endDate.setHours(originalEndHour, originalEndMinues, 0, 0)
            dateDesign.value[1] = endDate
        }
    }

    const newEvent = await repoEvent.postEvent(dialogEventTemplate.value)
    vekozEventList.value.push(newEvent)
    dialogEventTemplate.value = newEvent // 呈現給使用者編輯使用

    const calendarEvent = parseFullCalendarEvent(newEvent)
    vekozCalendarRef.value?.addEvent(calendarEvent)

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
        await repoEvent.deleteEvent({
            id: dialogEventTemplate.value.id,
        })
        // vekozCalendarRef.value?.removeAllEvents()
        // await getEventList()
        eventDialogIsOpen.value = false
        isLoading.value = false
    }
}
</script>

<style lang="scss" scoped>
.event {
    .card__header {
        display: flex;
        justify-content: space-between;
    }

    .event__todoList {
        margin-top: 20px;
    }
}
</style>