<template>
    <div class="follows">
        <el-row :gutter="20">
            <el-col :span="repoUI.isXLarge ? 19 : 24">
                <MoleculeEventCalendar ref="vekozCalendarRef" @dates-set="handleDatesSet">
                </MoleculeEventCalendar>
            </el-col>
            <el-col v-if="repoUI.isXLarge" :span="5">
                <el-card>
                    <template #header>
                        <div class="card__header">
                            行事曆篩選
                            <el-button v-if="followList.length" :icon="More" :text="true" :circle="true"
                                @click="openCalendarModal()">
                            </el-button>
                        </div>
                    </template>
                    <!-- <el-divider>組織</el-divider>
                    <el-divider>講師</el-divider> -->
                    <AtomVekozCheckboxGroup v-if="followList.length" v-model="selectedFolloweeIds" :items="followList"
                        :item-label="'followeeName'" :item-value="'followeeId'" @change="updatePrefernece()">
                    </AtomVekozCheckboxGroup>
                    <el-empty v-else description="沒有訂閱的行事曆"></el-empty>
                </el-card>
            </el-col>
        </el-row>

        <AtomVekozDialog v-model="followModalVisible" :showClose="true">
            <template #header>
                行事曆設定
            </template>
            <FormUserFollowList v-model="followList"></FormUserFollowList>
        </AtomVekozDialog>
    </div>
</template>
<script lang="ts" setup>
import { More } from '@element-plus/icons-vue'
import type { CalendarApi, DatesSetArg, EventApi } from '@fullcalendar/core/index.js'
import type { IEventFromList } from '~/types/event'
import type { IFullCalendarEvent } from '~/types/fullCalendar'
import type { IPreferenceFollow } from '~/types/user'
import type { IFollowAction } from '~/types/userFollow'
const repoUI = useRepoUI()
const repoUserFollow = useRepoUserFollow()
const repoUser = useRepoUser()
const repoEvent = useRepoEvent()
const vekozCalendarRef = ref<CalendarApi>()
const followModalVisible = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const followList = ref<IFollowAction[]>([])
const eventMap = ref<{ [key: string]: IEventFromList[] }>()
const selectedFolloweeIds = ref<string[]>([])
const vekozEventList = ref<IEventFromList[]>([])

// Hooks
watch(() => repoUser.userInfo.id, async (isLoggedIn) => {
    if (isLoggedIn) {
        await getFollowList()
        setCalendarView()
        isLoading.value = false
    }
}, { immediate: true })

// Methods
function updatePrefernece() {
    const preference: IPreferenceFollow = {
        followeeIds: selectedFolloweeIds.value,
    }
    repoUser.patchUserPreference('follow', preference)
}

async function getFollowList() {
    const result = await repoUserFollow.getFollowActionList({
        id: repoUser.userInfo.id,
    })
    followList.value = result

    // 從偏好讀取已選擇的組織/人
    const followeeIds = repoUser.preference.follow.followeeIds
    if (followeeIds) {
        selectedFolloweeIds.value = followeeIds
    } else {
        selectedFolloweeIds.value = result.items.map((followAction: IFollowAction) => {
            return followAction.followeeId ?? ''
        })
    }
}

function setCalendarView() {
    const preference = repoUser.userInfo.preference
    const calendarViewType = preference?.follow.calendarViewType
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
    const preferenceEvnet: IPreferenceFollow = {
        calendarViewType: type,
    }

    // 更新偏好
    isLoading.value = true
    repoUI.debounce(`handleDatesSet`, () => {
        repoUser.patchUserPreference('follow', preferenceEvnet)
        getCalendarEvents({
            start
        })
        isLoading.value = false
    })
}

async function getCalendarEvents(payload: any) {
    // 移除所有事件資料
    const calendarEvents: EventApi[] | undefined = vekozCalendarRef.value?.getEvents()
    if (calendarEvents) {
        calendarEvents.forEach(event => {
            event.remove()
        })
    }

    // 抓取當月事件資料
    vekozEventList.value = []
    selectedFolloweeIds.value.forEach(async (organizerId: string) => {
        const orgEventList = await repoEvent.getEventList({
            organizerId: organizerId,
            startDate: payload.start,
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

function parseFullCalendarEvent(event: IEventFromList): IFullCalendarEvent {
    const selectedFollowAction = followList.value.find(followAction => {
        return followAction.followeeId === event.organizerId
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
        backgroundColor: selectedFollowAction?.calendarColor,
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

async function getOrganizationEvents(organizerId: string) {
    const result = await repoEvent.getEventList({
        organizerId,
    })
}

function openCalendarModal() {
    followModalVisible.value = true
}
</script>
<style lang="scss" scoped>
.follows {
    .card__header {
        display: flex;
        justify-content: space-between;
    }

    .event__todoList {
        margin-top: 20px;
    }
}
</style>