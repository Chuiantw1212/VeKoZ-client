<template>
    <div class="timeRangePicker" :class="{ 'timeRangePicker--disabled': props.disabled }">
        <el-icon color="#a8abb2" size="14px">
            <Clock />
        </el-icon>
        <select v-model="displayStart" class="timeRangePicker__select" :disabled="props.disabled"
            @change="setStartDate()">
            <option v-for="time in startTimes" class="select__option">{{ time }}</option>
        </select>
        -
        <!-- {{ endDate }} -->
        <!-- {{ displayEnd }} -->
        <select v-model="displayEnd" class="timeRangePicker__select" :disabled="props.disabled" @change="setEndDate()">
            <option v-for="time in endTimes" class="select__option">{{ time }}</option>
        </select>
        <!-- {{ startTimes }} -->
    </div>
</template>
<script setup lang="ts">
import { Clock } from '@element-plus/icons-vue'
const debounceTimerId = ref()
const debounceFunc = ref()
const startTimes = ref<string[]>([])
const endTimes = ref<string[]>([])
const minutes = ref<string[]>(['00', '15', '30', '45',])
const displayStart = ref<string>('')
const displayEnd = ref<string>('')

const startDate = defineModel<Date | string | null>('startDate', {
    required: true,
    default: new Date(),
})

const endDate = defineModel<Date | string | null>('endDate', {
    required: true,
    default: new Date(),
})

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    minDate: {
        type: [String, Date],
    },
    maxDate: {
        type: [String, Date],
    },
})

onMounted(() => {
    setTimOptions()
})

/**
 * 在上面的watcher會先被執行
 */
watch(() => startDate.value, (newValue) => {
    displayStart.value = convertIsoToDisplayTime(newValue)
}, { deep: true, immediate: true })

watch(() => endDate.value, (newValue) => {
    displayEnd.value = convertIsoToDisplayTime(newValue)
}, { deep: true, immediate: true })

watch(() => props.minDate, () => {
    setTimOptions()
}, { immediate: true })

watch(() => props.maxDate, () => {
    setTimOptions()
}, { immediate: true })

// Methods
function setStartDate() {
    if (!startDate.value || !isValidDate(startDate.value) || !endDate.value || !isValidDate(endDate.value)) {
        const currentDateInstance = new Date()
        const currentYear = currentDateInstance.getFullYear()
        const currentMonth = currentDateInstance.getMonth()
        const currentDate = currentDateInstance.getDate()
        const currentTime = getTime(currentDateInstance)
        if (currentTime) {
            startDate.value = new Date(currentYear, currentMonth, currentDate, currentTime.hour, currentTime.minute, 0, 0)
            endDate.value = new Date(currentYear, currentMonth, currentDate, currentTime.hour + 1, currentTime.minute, 0, 0)
        }
    }
    // console.log(startDate.value)
    if (!startDate.value || !endDate.value) {
        // 清除type error
        return
    }
    let duration = 0
    // let startDateInstance = startDate.value
    // if (startDate.value) {
    if (!(startDate.value instanceof Date)) {
        startDate.value = new Date(startDate.value)
    }
    // }
    // let endDateInstance = endDate.value
    // if (endDate.value) {
    if (!(endDate.value instanceof Date)) {
        endDate.value = new Date(endDate.value)
    }
    // }

    const startTime = startDate.value.getTime()
    const endTime = endDate.value.getTime()
    duration = endTime - startTime

    const newStartDate = convertDisplayToDate(displayStart.value)
    startDate.value = newStartDate

    const newStartTime = newStartDate.getTime()
    endDate.value = new Date(newStartTime + duration)

    nextTick(() => {
        setEndTimes()
    })
}

// function isValidDate(d: any) {
//     return d instanceof Date && !isNaN(d.getTime());
// }

function setEndDate() {
    const newEndDate = convertDisplayToDate(displayEnd.value)
    endDate.value = newEndDate
}

function convertIsoToDisplayTime(isoString: Date | string | null) {
    if (!isoString) {
        return ''
    }
    let currentDate = isoString
    if (!(isoString instanceof Date)) {
        currentDate = new Date(isoString ?? '')
    }
    if (typeof currentDate === 'string') {
        return ''
    }

    let hour = currentDate.getHours()
    const minute = currentDate.getMinutes()
    let base = minute / 15
    base = Math.ceil(base)
    if (base === 4) {
        hour += 1
        base = 0
    }
    const hourString = String(hour).padStart(2, '0')
    const minuteString = String(base * 15).padStart(2, '0')
    return `${hourString}:${minuteString}`
}

function convertDisplayToDate(display: string) {
    const displayTime = display.split(':')
    const newHour = Number(displayTime[0])
    const newMinutes = Number(displayTime[1])
    let newDate: Date = new Date()
    const dateString = String(startDate.value)
    newDate = new Date(dateString)
    newDate.setHours(Math.max(newHour, 6))
    newDate.setMinutes(newMinutes)
    return newDate
}

function setTimOptions() {
    debounce(() => {
        setStartTimes()
        setEndTimes()
    })
}

function debounce(func: Function, timeout = 300) {
    const existedTimer = debounceTimerId.value
    if (existedTimer) {
        clearTimeout(existedTimer);
    }
    const newTimer = setTimeout(() => {
        debounceFunc.value()
        debounceTimerId.value = ''
    }, timeout);
    debounceTimerId.value = newTimer
    debounceFunc.value = func
}

function setStartTimes() {
    let minDateInstance = props.minDate ?? ''
    if (minDateInstance && !(minDateInstance instanceof Date) || typeof minDateInstance === 'string') {
        minDateInstance = new Date(minDateInstance)
    }
    let minHour = 6
    if (isValidDate(minDateInstance)) {
        minHour = minDateInstance.getHours()
    }

    let maxDateInstance = props.maxDate
    if (maxDateInstance && !(maxDateInstance instanceof Date) || typeof maxDateInstance === 'string') {
        maxDateInstance = new Date(maxDateInstance)
    }
    let maxHours = 23
    let maxMinutes = 0
    if (isValidDate(maxDateInstance)) {
        maxHours = maxDateInstance?.getHours() ?? 23
        maxMinutes = maxDateInstance?.getMinutes() ?? 0
    }

    // console.log(minHour)
    startTimes.value = []
    // console.log('minHour', minHour)
    // console.log('maxHours', maxHours)
    for (let hour = minHour; hour <= maxHours; hour++) {
        minutes.value.forEach((minute: string) => {
            const hourString = String(hour).padStart(2, '0')
            const minuteString = minute

            const isSmallerThanMax = !(hour === maxHours && Number(minute) > maxMinutes)
            const isLargerThanStart = !(hour === minHour && Number(minute) < maxMinutes)
            if (isSmallerThanMax && isLargerThanStart) {
                startTimes.value.push(`${hourString}:${minuteString}`)
            }
        })
    }

    const startTime = getTime(startDate.value)
    const firstOption = startTimes.value[0]
    const lastOption = startTimes.value[startTimes.value.length - 1]
    // console.log({
    //     startTime,
    //     firstOption
    // })
    if (firstOption && lastOption && startTime) {
        // Min Time
        const minTime = firstOption.split(':')
        const minHour = Number(minTime[0])
        const minMinutes = Number(minTime[1])
        const minTotalMins = minHour * 60 + minMinutes

        // Max Time
        const maxTime = lastOption.split(':')
        const maxHour = Number(maxTime[0])
        const maxMinutes = Number(maxTime[1])
        const maxTotalMins = maxHour * 60 + maxMinutes

        const defaultStartMins = startTime.hour * 60 + startTime.minute

        const isTooEarly = minTotalMins > defaultStartMins
        const isTooLate = maxTotalMins < defaultStartMins
        // console.log({
        //     minTotalMins,
        //     defaultStartMins
        // })
        if (isTooEarly) {
            // console.log('?', startDate.value instanceof Date)
            if (startDate.value instanceof Date) {
                startDate.value.setHours(minHour, minMinutes, 0, 0)
                displayStart.value = convertIsoToDisplayTime(startDate.value)
            }
            // console.log('?', startDate.value)
        }
        if (isTooLate) {
            // console.log({
            //     isTooLate,
            //     maxHour,
            //     maxMinutes
            // })
            if (startDate.value instanceof Date) {
                startDate.value.setHours(maxHour, maxMinutes, 0, 0)
                displayStart.value = convertIsoToDisplayTime(startDate.value)
            }
        }
    }
}

function setEndTimes() {
    const displayTime = displayStart.value.split(':')
    const startHour = Number(displayTime[0]) ?? 6
    const startMinutes = Number(displayTime[1]) ?? 45
    endTimes.value = []

    let maxDateInstance = props.maxDate
    if (maxDateInstance && !(maxDateInstance instanceof Date) || typeof maxDateInstance === 'string') {
        maxDateInstance = new Date(maxDateInstance)
    }
    let maxHours = 23
    let maxMinutes = 45
    if (isValidDate(maxDateInstance)) {
        maxHours = maxDateInstance?.getHours() ?? 23
        maxMinutes = maxDateInstance?.getMinutes() ?? 45
    }

    for (let hour = startHour; hour <= maxHours; hour++) {
        minutes.value.forEach((minute: string) => {
            const hourString = String(hour).padStart(2, '0')
            const minuteString = minute

            const isLargerThanStart = !(hour === startHour && Number(minute) < startMinutes)
            const isSmallerThanMax = !(hour === maxHours && Number(minute) > maxMinutes)
            if (isLargerThanStart && isSmallerThanMax) {
                endTimes.value.push(`${hourString}:${minuteString}`)
            }
        })
    }

    const endTime = getTime(endDate.value)
    // console.log(endTimes.value)

    const firstOption = endTimes.value[0]
    const lastOption = endTimes.value[endTimes.value.length - 1]
    if (firstOption && lastOption && endTime) {
        // Min Time
        const minTime = firstOption.split(':')
        const minHour = Number(minTime[0])
        const minMinutes = Number(minTime[1])
        const minTotalMins = minHour * 60 + minMinutes
        // console.log({
        //     minTotalMins,
        // })

        // Max Time
        const maxTime = lastOption.split(':')
        const maxHour = Number(maxTime[0])
        const maxMinutes = Number(maxTime[1])
        const maxTotalMins = maxHour * 60 + maxMinutes
        // console.log({
        //     maxTotalMins,
        // })

        const defaultEndMins = endTime.hour * 60 + endTime.minute
        // console.log({
        //     defaultEndMins
        // })
        const isTooEarly = minTotalMins > defaultEndMins
        const isTooLate = maxTotalMins < defaultEndMins
        // console.log({
        //     isTooEarly,
        //     isTooLate,
        //     endTime,
        // })

        if (isTooEarly) {
            // console.log({
            //     isTooEarly,
            //     minHour,
            //     minMinutes
            // })
            if (endDate.value instanceof Date) {
                endDate.value.setHours(minHour + 1, minMinutes, 0, 0)
                displayEnd.value = convertIsoToDisplayTime(endDate.value)
            }
        }
        if (isTooLate) {
            // console.log({
            //     isTooLate,
            //     maxHour,
            //     maxMinutes
            // })
            if (endDate.value instanceof Date) {
                endDate.value.setHours(maxHour, maxMinutes, 0, 0)
                displayEnd.value = convertIsoToDisplayTime(endDate.value)
            }
        }
    }
}

function getTime(incomingDate: Date | string | null) {
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

function isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
}

</script>
<style lang="scss" scoped>
.timeRangePicker {
    display: inline-flex;
    align-items: center;
    height: 30px;
    border: 1px solid rgb(228, 231, 237);
    border-radius: 4px;
    gap: 4px;
    width: fit-content;
    padding: 0 10px;
    color: rgb(96, 98, 102);

    .timeRangePicker__select {
        border: 0px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
        padding: 0 10px;
        color: rgb(96, 98, 102);

        &:focus {
            outline: none;
        }

        &:disabled {
            background-color: rgb(245, 247, 250);
        }

        .select__option {
            padding: 0 4px;
        }
    }
}

.timeRangePicker--disabled {
    background-color: rgb(245, 247, 250);
}
</style>