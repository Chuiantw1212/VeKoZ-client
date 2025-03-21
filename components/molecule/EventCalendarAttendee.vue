<template>
    <!-- root必須是div，不然deep樣式會跑掉 -->
    <div class="votionCalendar">
        <div class="votionCalendar__calendar" ref="calendarRef"></div>
    </div>
</template>
<script setup lang="ts">
import { Calendar, } from '@fullcalendar/core';
import type { CalendarApi, DatesSetArg, EventApi, EventSourceInput, ViewMountArg } from '@fullcalendar/core';
import zhTwLocale from '@fullcalendar/core/locales/zh-tw';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction';
import type { IEventCreation } from '~/types/event';
import type { IFullCalendarEvent, IEventClickInfo } from '~/types/fullCalendar';

const emit = defineEmits(['create', 'eventChange', 'eventClick', 'datesSet', 'mounted'])
const repoUI = useRepoUI()
const calendarRef = ref()
const calendarInstance = ref<CalendarApi>()
const viewTypes = ref<string[]>(['dayGridMonth', 'timeGridWeek', 'listYear'])
const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
    }
})

// Hooks
onMounted(() => {
    initializeCalendar()
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

function addEvent(event: IFullCalendarEvent) {
    calendarInstance.value?.addEvent(event)
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
        locales: [zhTwLocale],
        locale: 'zh-tw',
        headerToolbar: {
            left: 'today prev,next',
            center: 'title',
            right: viewTypes.value.join(',')
        },
        /**
         * like '14:30'
         * https://fullcalendar.io/docs/eventTimeFormat
         */
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            meridiem: false,
        },
        multiMonthMaxColumns: 1, // force a single column
        height: idealHeight,
        views: {
            listYear: {
                type: 'list',
                duration: { year: 1 },
                buttonText: '全年列表'
            },
            timeGridWeek: {
                type: 'timeGrid',
                duration: { week: 1 },
                buttonText: '未來一週'
            },
        }
    });
    calendar.render();

    // 紀錄instance
    calendarInstance.value = markRaw(calendar)
}

defineExpose({
    addEvent,
    // getEvents,
    // addEventSource,
    // removeAllEvents,
    // getEventById,
    // changeView,
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
