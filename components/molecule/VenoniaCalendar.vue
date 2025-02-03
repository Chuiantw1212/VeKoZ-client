<template>
    <div class="votionCalendar">
        <FullCalendar ref="calendarRef" class="votionCalendar__calendar" :options='calendarOptions'></FullCalendar>
    </div>
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import type { IEventCreation } from '~/types/event';
import type { EventApi } from '@fullcalendar/core/index.js';

const emit = defineEmits(['update:modelValue', 'create'])
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => { }
    }
})

watch(() => props.modelValue, () => {

})

const calendarRef = ref()
/**
 * Vue3範例
 * https://github.com/fullcalendar/fullcalendar-examples/blob/main/vue3/src/DemoApp.vue
 */
const calendarOptions = reactive({
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    eventClick: handleEventClick,
    eventChange: handleEventChange,
    locale: 'zh-tw',
    headerToolbar: {
        left: 'today prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
    },
})

// Hooks
onMounted(() => {
    toggleResize(true)
    nextTick(() => {
        listenToDateCell(true)
        listenToFcButton(true)
    })
})

onBeforeUnmount(() => {
    toggleResize(false)
    listenToDateCell(false)
    listenToFcButton(false)
})

// Methods
/**
 * https://fullcalendar.io/docs/eventClick
 */
function handleEventClick(info: any) {
    // alert('Event: ' + info.event.title);
    // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    // alert('View: ' + info.view.type);

    // change the border color just for fun
    // info.el.style.borderColor = 'red';
}

/**
 * https://fullcalendar.io/docs/eventChange
 * @param changeInfo 
 */
function handleEventChange(changeInfo: any) {

}

function addEvent(event: EventApi) {
    const calendar = calendarRef.value.getApi()
    calendar.addEvent(event)
    // calendar.render()
    // const testEvents = calendar.getEvents()
    // console.log({
    //     testEvents
    // })
}

function toggleResize(isOn: boolean) {
    if (isOn) {
        window.addEventListener('resize', resizeCalendar)
    } else {
        window.removeEventListener('resize', resizeCalendar)
    }
}

function resizeCalendar() {
    setTimeout(() => {
        const calendar = calendarRef.value.getApi()
        calendar.render()
    }, 350)
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
    const dayFrame = event.target as any
    const dayTop = dayFrame.querySelector('.fc-daygrid-day-top')

    // 移除所有的事件增加按鈕
    const items = document.querySelectorAll('.addEventBtn')
    items.forEach(item => {
        item.remove()
    })

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
    addEvent
})
</script>

<style lang="scss" scoped>
.votionCalendar {
    // max-width: 100vh;
}

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
