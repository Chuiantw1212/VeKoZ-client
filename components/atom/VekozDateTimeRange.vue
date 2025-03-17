<template>
    <div class="dateTimeRange">
        <!-- date {{  date }} -->
        <!-- typeof date {{ typeof date }} -->
        <!-- date instanceOf Date {{ date instanceof Date }} -->
        <el-date-picker class="dateTimeRange__date" :placeholder="props.placeholder" v-model="date"
            :disabled-date="disablePastDays" :disabled="props.disabled" @blur="onDateChanged()"
            @clear="checkClearDate()"></el-date-picker>
        <!-- startDate {{ startDate }}
        endDate {{ endDate }} -->
        <!-- minDate {{ minDate }}
        maxDate {{ maxDate }} -->
        <AtomVekozTimePickerNew class="dateTimeRange__time" v-model:startDate="startDate" v-model:endDate="endDate"
            :minDate="minDate" :maxDate="maxDate" :disabled="props.disabled">
        </AtomVekozTimePickerNew>
    </div>
</template>
<script setup lang="ts">
const date = ref<Date>()
const startDate = defineModel<Date | string | null>('startDate', {
    default: new Date()
})
const endDate = defineModel<Date | string | null>('endDate', {
    default: new Date()
})
const props = defineProps({
    placeholder: {
        type: String,
        default: '請輸入'
    },
    disabledDate: {
        type: Boolean,
        defualt: false,
    },
    minDate: {
        type: [String, Date],
    },
    maxDate: {
        type: [String, Date],
    },
    disabled: {
        type: Boolean,
        default: false
    },
})

// Hooks
onMounted(() => {
    setDefaultValue()
})

// Methods
function setDefaultValue() {
    const currentDateInstance = new Date()
    const currentYear = currentDateInstance.getFullYear()
    const currentMonth = currentDateInstance.getMonth()
    const currentDate = currentDateInstance.getDate()
    const defaultTime = getDefaultTime()

    if (!startDate.value) {
        if (props.minDate) {
            let copiedDate = props.minDate
            if (!(copiedDate instanceof Date)) {
                copiedDate = new Date(props.minDate)
            }
            startDate.value = new Date(copiedDate.getTime())
        } else {
            startDate.value = new Date(currentYear, currentMonth, currentDate, defaultTime.hour, defaultTime.minute)
        }
    }
    // console.log('wtf ', typeof startDate.value)
    if (typeof startDate.value === 'string') {
        // console.log('why ', typeof startDate.value)
        const formatStartDate = new Date(startDate.value)
        // console.log('formatStartDate ', formatStartDate instanceof Date)
        startDate.value = formatStartDate
    }
    // console.log('startDate.value', startDate.value)
    // console.log('typeof ', typeof startDate.value)
    // console.log('instanceOf ', startDate.value instanceof Date)
    if (startDate.value instanceof Date) {
        const isValidStart = !isNaN(startDate.value.getTime())
        if (!isValidStart) {
            startDate.value = new Date(currentYear, currentMonth, currentDate, defaultTime.hour, defaultTime.minute)
        }
    }
    date.value = startDate.value

    if (!endDate.value) {
        if (props.maxDate) {
            let copiedDate = props.maxDate
            if (!(copiedDate instanceof Date)) {
                copiedDate = new Date(props.maxDate)
            }
            endDate.value = new Date(copiedDate.getTime())
        } else {
            endDate.value = new Date(currentYear, currentMonth, currentDate, defaultTime.hour + 1, defaultTime.minute)
        }
    }
    if (typeof endDate.value === 'string') {
        endDate.value = new Date(endDate.value)
    }
    if (endDate.value instanceof Date) {
        const isValidEnd = !isNaN(endDate.value.getTime())
        if (!isValidEnd) {
            endDate.value = new Date(currentYear, currentMonth, currentDate, defaultTime.hour, defaultTime.minute)
        }
    }
}

function getDefaultTime() {
    const currentDate = new Date()
    let hour = currentDate.getHours()
    const minute = currentDate.getMinutes()
    let base = minute / 15
    base = Math.ceil(base)
    if (base === 4) {
        hour += 1
        base = 0
    }
    return {
        hour,
        minute: base * 15
    }
}

function disablePastDays(date: Date) {
    if (date) {
        const currentTime = new Date().getTime()
        return currentTime >= date.getTime()
    }
}
function checkClearDate() {
    startDate.value = null
    endDate.value = null
}
function setDate(incomingDate: Date) {
    date.value = incomingDate
    onDateChanged()
}
function onDateChanged() {
    // console.log('startDate.value', startDate.value)
    // console.log('date.value', date.value)
    if (!startDate.value || !endDate.value) {
        return
    }
    if (!date.value) {
        return
    }

    // console.log('assign?')
    let newDateInstance = date.value
    if (!(newDateInstance instanceof Date)) {
        newDateInstance = new Date(date.value)
    }
    const newYear = newDateInstance.getFullYear()
    const newMonth = newDateInstance.getMonth()
    const newDate = newDateInstance.getDate()

    const startTime = getTime(startDate.value)
    const endTime = getTime(endDate.value)

    if (startTime) {
        const newStartDate: Date = new Date(newYear, newMonth, newDate, startTime.hour, startTime.minute)
        startDate.value = newStartDate
    }
    if (endTime) {
        const newEndDate: Date = new Date(newYear, newMonth, newDate, endTime.hour, endTime.minute)
        endDate.value = newEndDate
    }
}
function getTime(incomingDate: Date | string) {
    if (!incomingDate) {
        return
    }
    let date = incomingDate
    if (!(date instanceof Date)) {
        date = new Date(incomingDate)
    }
    let hour = date.getHours()
    const minute = date.getMinutes()
    let base = minute / 15
    base = Math.ceil(base)
    if (base === 4) {
        hour += 1
        base = 0
    }
    return {
        hour,
        minute: base * 15
    }
}

defineExpose({
    setDate,
})
</script>
<style lang="scss" scoped>
.dateTimeRange {
    display: flex;
    // flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    width: fit-content;

    .dateTimeRange__date {
        flex: 1;
        // width: fit-content;
    }

    .dateTimeRange__time {
        flex: 1;
        // width: fit-content;
    }
}
</style>