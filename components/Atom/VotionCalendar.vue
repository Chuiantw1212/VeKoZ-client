<template>
    <h1>Demo App</h1>
    <FullCalendar :options='calendarOptions' />
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

const calendarOptions = reactive({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [
        { title: 'Meeting', start: new Date() }
    ]
})

function locateToday() {
    const dateNow = new Date()
    const day = dateNow.getDay()
}

onMounted(() => {
    locateToday()
})
</script>