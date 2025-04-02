<template>
    <div class="follows">
        <el-row :gutter="20">
            <el-col :span="repoUI.isXLarge ? 19 : 24">
                <MoleculeEventCalendar ref="vekozCalendarRef" @dates-set="handleDatesSet"
                    @event-click="handleEventClick">
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
                        :item-label="'followeeName'" :item-value="'followeeId'" @change="onFolloweeIdsChanged()">
                    </AtomVekozCheckboxGroup>
                    <el-empty v-else description="沒有訂閱的行事曆"></el-empty>
                </el-card>
            </el-col>
        </el-row>

        <AtomVekozDialog v-model="followModalVisible" :showClose="true">
            <template #header>
                行事曆設定
            </template>
            <FormUserFollowList v-model="followList" @change="changeFollowAction($event)"></FormUserFollowList>
        </AtomVekozDialog>
    </div>
</template>
<script lang="ts" setup>
import { More } from '@element-plus/icons-vue'
import type { CalendarApi, DatesSetArg, EventApi } from '@fullcalendar/core/index.js'
import type { IEventFromList, } from '~/types/event'
import type { IEventClickInfo, IFullCalendarEvent } from '~/types/fullCalendar'
import type { IPreferenceFollow } from '~/types/user'
import type { IFollowAction } from '~/types/userFollow'
const repoUI = useRepoUI()
const repoUserFollow = useRepoUserFollow()
const repoUser = useRepoUser()
const repoEvent = useRepoEvent()
const router = useRouter()
const vekozCalendarRef = ref<CalendarApi>()
const followModalVisible = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const followList = ref<IFollowAction[]>([])
const selectedFolloweeIds = ref<string[]>([])
const vekozEventList = ref<IEventFromList[]>([])

// Hooks
watch(() => repoUser.preference.follow.followeeIds, async (isLoggedIn) => {
    if (isLoggedIn) {
        await getFollowList()
        setCalendarView()
        isLoading.value = false
    }
}, { immediate: true })

// Methods
async function handleEventClick(eventClickInfo: IEventClickInfo) {
    const eventId = eventClickInfo.event.id
    // const routeData = router.resolve({ name: 'event', });
    // const href = routeData.href
    const { origin } = window.location
    window.open(`${origin}/event/${eventId}`, '_blank');
    // eventClickInfo.event.name = eventClickInfo.event.title // Full Calendar Event轉換
    // const selectedEventMaster = vekozEventList.value.find(event => {
    //     return event.id === eventId
    // })
    // if (!selectedEventMaster) {
    //     return
    // }
    // isLoading.value = true
    // const eventTemplate: IEventSingle = await repoEvent.getEvent({
    //     id: eventId,
    //     organizerId: selectedEventMaster.organizerId,
    // })
    // dialogEventTemplate.value = eventTemplate
    // isLoading.value = false
}

/**
 * 觸發watcher
 */
function onFolloweeIdsChanged() {
    const preference: IPreferenceFollow = {
        followeeIds: selectedFolloweeIds.value,
    }
    repoUser.patchUserPreference('follow', preference)
}

function changeFollowAction(followAction: IFollowAction) {
    const relatedEvents = vekozEventList.value.filter(event => {
        return event.organizerId === followAction.followeeId
    })
    relatedEvents.forEach(followeeEvent => {
        const calendarEvent = vekozCalendarRef.value?.getEventById(String(followeeEvent.id))
        calendarEvent?.setProp('backgroundColor', followAction.calendarColor)
    })
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
        selectedFolloweeIds.value = result.map((followAction: IFollowAction) => {
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

/**
 * 連動取得月曆事件
 * @param datesSetArg 
 */
async function handleDatesSet(datesSetArg: DatesSetArg) {
    const { start, view } = datesSetArg
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
    selectedFolloweeIds.value.forEach(async (followeeId: string) => {
        const relatedFollowAction = followList.value.find((action: IFollowAction) => {
            return action.followeeId === followeeId
        })
        if (!relatedFollowAction) {
            return
        }

        let fetchedEventList: IEventFromList[] = []
        let fullCalendarEventList: IFullCalendarEvent[] = []
        switch (relatedFollowAction.followeeType) {
            case 'user': {
                fetchedEventList = await repoEvent.getEventList({
                    performerIds: [String(relatedFollowAction.followeeId)],
                    startDate: payload.start,
                    allowMethods: ['GET'],
                })
                fullCalendarEventList = fetchedEventList.map(event => {
                    const parsedEvent = parseFullCalendarEvent(event)
                    const selectedFollowAction = followList.value.find(followAction => {
                        return event.performerIds?.includes(String(followAction.followeeId))
                    })
                    parsedEvent.backgroundColor = selectedFollowAction?.calendarColor
                    return parsedEvent
                })
                break;
            }
            case 'organization': {
                fetchedEventList = await repoEvent.getEventList({
                    organizerId: relatedFollowAction.followeeId,
                    startDate: payload.start,
                    allowMethods: ['GET'],
                })
                fullCalendarEventList = fetchedEventList.map(event => {
                    const parsedEvent = parseFullCalendarEvent(event)
                    const selectedFollowAction = followList.value.find(followAction => {
                        return followAction.followeeId === event.organizerId
                    })
                    parsedEvent.backgroundColor = selectedFollowAction?.calendarColor
                    return parsedEvent
                })
                break;
            }
            default: {
                alert('followeeType例外')
            }
        }

        fullCalendarEventList.forEach(event => {
            vekozCalendarRef.value?.addEvent(event)
        })
        vekozEventList.value.push(...fetchedEventList)

    })
}

function parseFullCalendarEvent(event: IEventFromList,): IFullCalendarEvent {
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