<template>
    <!-- root必須是div，不然deep樣式會跑掉 -->
    <div class="votionCalendar">
        <div class="votionCalendar__calendar" ref="calendarRef"></div>
    </div>
</template>
<script setup lang="ts">
import { Calendar, } from '@fullcalendar/core';
import type { CalendarApi, DatesSetArg, ViewMountArg } from '@fullcalendar/core';
import zhTwLocale from '@fullcalendar/core/locales/zh-tw';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction';
import type { IEventCreation } from '~/types/event';
import type { IFullCalendarEvent, IChangeInfo, IEventClickInfo } from '~/types/fullCalendar';

const emit = defineEmits(['update:modelValue', 'create', 'eventChange', 'eventClick', 'datesSet'])
const repoUI = useRepoUI()
const calendarRef = ref()
const calendarInstance = ref<CalendarApi>()
const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
    }
})

// Hooks
onMounted(() => {
    initializeCalendar()
    nextTick(() => {
        listenToDateCell(true)
        listenToFcButton(true)
        resizeCalendar()
    })
})

onBeforeUnmount(() => {
    listenToDateCell(false)
    listenToFcButton(false)
})

watch(() => repoUI.isResizing, (newValue: boolean, oldValue: boolean) => {
    if (!newValue && oldValue) {
        resizeCalendar()
    }
})

// Methods
function resizeCalendar() {
    repoUI.debounce(props.id, () => {
        setTimeout(() => {
            const idealHeight = window.innerHeight - 150
            calendarInstance.value?.setOption('height', idealHeight);
            calendarInstance.value?.updateSize()
        }, 50) // 不科學實驗結果的最佳數字
    })
}

function initializeCalendar() {
    const calendarEl = calendarRef.value
    if (!calendarEl) {
        return
    }

    // 設定Calendar
    const idealHeight = window.innerHeight - 150
    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, multiMonthPlugin],
        initialView: 'dayGridMonth',
        events: [],
        eventClick: handleEventClick,
        eventChange: handleEventChange,
        viewDidMount: handleViewDidMount,
        datesSet: handleDatesSet,
        locales: [zhTwLocale],
        locale: 'zh-tw',
        headerToolbar: {
            left: 'today prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,listWeek'
            // right: ''
        },
        multiMonthMaxColumns: 1, // force a single column
        height: idealHeight,
    });
    calendar.render();

    // 紀錄instance
    calendarInstance.value = markRaw(calendar)
}

/**
 * 
 */
function handleDatesSet(datesSetArg: DatesSetArg) {
    emit('datesSet', datesSetArg)
}

/**
 * 
 */
function handleViewDidMount(viewMountArg: ViewMountArg) {
    const { view } = viewMountArg
    const { type } = view
    // console.log({
    //     type
    // })
}

/**
 * https://fullcalendar.io/docs/eventClick
 */
function handleEventClick(eventClickInfo: IEventClickInfo) {
    emit('eventClick', eventClickInfo)
}

/**
 * https://fullcalendar.io/docs/eventChange
 * @param changeInfo 
 */
function handleEventChange(changeInfo: any) {
    emit('eventChange', changeInfo)
}

function addEvent(event: IFullCalendarEvent) {
    calendarInstance.value?.addEvent(event)
}

function getEventById(event: string) {
    return calendarInstance.value?.getEventById(event)
}

function removeAllEvents() {
    calendarInstance.value?.removeAllEvents()
}

function listenToDateCell(isOn: boolean) {
    const frames = document.querySelectorAll('.fc-daygrid-day-frame')
    frames.forEach(item => {
        item.removeEventListener('mouseenter', toggleEventAddingBtn)
    })
    if (isOn) {
        frames.forEach(item => {
            item.addEventListener('mouseenter', toggleEventAddingBtn)
        })
    }
}

function listenToFcButton(isOn: boolean) {
    const fcButtons = document.querySelectorAll('.fc-button')
    fcButtons.forEach(item => {
        item.removeEventListener('click', resetDateCellListener)
    })
    if (isOn) {
        fcButtons.forEach(item => {
            item.addEventListener('click', resetDateCellListener)
        })
    }
}

function resetDateCellListener() {
    listenToDateCell(true)
}

function toggleEventAddingBtn(event: Event) {
    // 移除所有的事件增加按鈕
    const items = document.querySelectorAll('.addEventBtn')
    items.forEach(item => {
        item.remove()
    })

    const dayFrame = event.target as any
    const dayTop = dayFrame.querySelector('.fc-daygrid-day-top')
    if (!dayTop) {
        return
    }

    // 顯示新增按鈕上去
    const button = document.createElement("button")
    button.type = 'button'
    button.classList.add('addEventBtn')
    button.classList.add('el-button')
    button.classList.add('el-button--small')
    button.innerHTML = `<i class="el-icon"><svg data-v-96a87c83="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
    <path fill="currentColor"
    d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"></path>
    </svg></i>`

    // 附加屬性與事件
    const dateNumber = dayTop.querySelector('.fc-daygrid-day-number')
    const dateLabelInChinese: string = dateNumber.ariaLabel
    let formatLabel = dateLabelInChinese.replace('年', '-')
    formatLabel = formatLabel.replace('月', '-')
    formatLabel = formatLabel.replace('日', '')
    const dateInstance = new Date(formatLabel)
    const isoDateString = dateInstance.toISOString()
    const eventCreation: IEventCreation = {
        date: isoDateString
    }
    button.onclick = async () => {
        emit('create', eventCreation)
    }

    // 顯示新增按鈕上去
    dayTop.append(button)
}

defineExpose({
    addEvent,
    removeAllEvents,
    getEventById,
})
</script>

<style lang="scss" scoped>
:deep(.votionCalendar__calendar) {
    max-width: 100%;

    .fc-daygrid-day-top {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
    }

    .addEventBtn {
        transform: translate(4px, 4px);
    }
}
</style>
