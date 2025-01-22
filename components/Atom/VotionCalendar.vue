<template>
    <div class="votionCalendar">
        <ElButton size="small">123</ElButton>
        <ElButton small>123</ElButton>
        <FullCalendar class="votionCalendar__calendar" :options='calendarOptions'></FullCalendar>
    </div>
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';

/**
 * Vue3範例
 * https://github.com/fullcalendar/fullcalendar-examples/blob/main/vue3/src/DemoApp.vue
 */
const calendarOptions = reactive({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [
        { title: 'Meeting', start: new Date() }
    ],
    dateClick: function (info: any) {
        /**
         * 選取日期
         * https://fullcalendar.io/docs/dateClick
         */
        // alert('Clicked on: ' + info.dateStr);
        // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        // alert('Current view: ' + info.view.type);
        // change the day's background color just for fun
        // info.dayEl.style.backgroundColor = 'red';
    },
})

function locateToday() {
    const dateNow = new Date()
    const day = dateNow.getDay()
}

function listenToDateCell(isOn: boolean) {
    const items = document.querySelectorAll('.fc-daygrid-day-frame')
    if (isOn) {
        items.forEach(item => {
            item.addEventListener('mouseenter', toggleEventAddingBtn)
        })
    }
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
    button.innerHTML = "+"
    dayTop.append(button)
}

onMounted(() => {
    locateToday()
    nextTick(() => {
        listenToDateCell(true)
    })
})

onBeforeUnmount(() => {
    listenToDateCell(false)
})
</script>

<style lang="scss" scoped>
:deep(.votionCalendar__calendar) {
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
