<template>
    <h1>Demo App</h1>
    <FullCalendar :options='calendarOptions' />
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';

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
        info.dayEl.style.backgroundColor = 'red';
    }
})

function locateToday() {
    const dateNow = new Date()
    const day = dateNow.getDay()
}

onMounted(() => {
    locateToday()
})
</script>