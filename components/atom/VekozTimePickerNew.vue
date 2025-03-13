<template>
    <div class="timeRangePicker" :class="{ 'timeRangePicker--disabled': props.disabled }">
        <!-- {{ modelValue }} -->
        <el-icon color="#a8abb2" size="14px">
            <Clock />
        </el-icon>
        <!-- instanceOf Date {{ modelValue[0] instanceof Date }} -->
        <select v-model="displayStart" class="timeRangePicker__select" :disabled="props.disabled"
            @change="setStartDate()">
            <option v-for="time in startTimes" class="select__option">{{ time }}</option>
        </select>
        -
        <!-- {{ displayEnd }} -->
        <select v-model="displayEnd" class="timeRangePicker__select" :disabled="props.disabled" @change="setEndDate()">
            <option v-for="time in endTimes" class="select__option">{{ time }}</option>
        </select>
    </div>
</template>
<script setup lang="ts">
import { Clock } from '@element-plus/icons-vue'
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
    }
})

// Hooks
onMounted(() => {
    setTimes()
    setStartDate()
})

watch(() => startDate.value, (newValue) => {
    if (newValue) {
        const startTime = String(newValue)
        displayStart.value = convertIsoToDisplayTime(startTime)
    } else {
        displayStart.value = ''
    }
}, { deep: true, immediate: true })

watch(() => endDate.value, (newValue) => {
    if (newValue) {
        const endTime = String(newValue)
        displayEnd.value = convertIsoToDisplayTime(endTime)
    } else {
        displayEnd.value = ''
    }
}, { deep: true, immediate: true })


// Methods
function setStartDate() {
    const isoString = convertDisplayToDate(displayStart.value)
    startDate.value = isoString

    const displayTime = displayStart.value.split(':')
    const newHour = Number(displayTime[0])
    const newMinutes = Number(displayTime[1])
    for (let hour = newHour; hour <= 23; hour++) {
        minutes.value.forEach((minute: string) => {
            const hourString = String(hour).padStart(2, '0')
            const minuteString = minute
            if (hour !== newHour || Number(minute) > newMinutes) {
                endTimes.value.push(`${hourString}:${minuteString}`)
            }
        })
    }
}

function setEndDate() {
    const isoString = convertDisplayToDate(displayEnd.value)
    endDate.value = isoString
}

function convertIsoToDisplayTime(isoString: string) {
    const currentDate = new Date(isoString)
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

function setTimes() {
    for (let hour = 6; hour <= 23; hour++) {
        minutes.value.forEach((minute: string) => {
            const hourString = String(hour).padStart(2, '0')
            const minuteString = minute
            startTimes.value.push(`${hourString}:${minuteString}`)
        })
    }
}
</script>
<style lang="scss" scoped>
.timeRangePicker {
    display: inline-flex;
    align-items: center;
    height: 30px;
    border: 1px solid lightgray;
    border-radius: 4px;
    gap: 4px;
    width: fit-content;
    // width: 100%;
    padding: 0 10px;
    color: rgb(96, 98, 102);
    // transform: translateY(2px);

    .timeRangePicker__select {
        border: 0px;
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