<template>
    <div class="timeRangePicker" :class="{ 'timeRangePicker--disabled': props.disabled }">
        <el-icon color="#a8abb2" size="14px">
            <Clock />
        </el-icon>
        <select v-model="displayStart" class="timeRangePicker__select" :disabled="props.disabled"
            @change="setStatDate()">
            <option v-for="time in times" class="select__option">{{ time }}</option>
        </select>
        -
        <select v-model="displayEnd" class="timeRangePicker__select" :disabled="props.disabled" @change="setEndDate()">
            <option v-for="time in times" class="select__option">{{ time }}</option>
        </select>
    </div>
</template>
<script setup lang="ts">
import { Clock } from '@element-plus/icons-vue'
const times = ref<string[]>([])
const minutes = ref<string[]>(['00', '15', '30', '45',])
const displayStart = ref<string>('')
const displayEnd = ref<string>('')

const modelValue = defineModel<string[]>('modelValue', {
    type: Array,
    required: true,
    default: []
})

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
})

watch(() => modelValue.value, () => {
    setDiaplyTime()
}, { deep: true, immediate: true })


// Methods
function setStatDate() {
    const isoString = convertDisplayToIso(displayStart.value)
    modelValue.value[0] = isoString
}

function setEndDate() {
    const isoString = convertDisplayToIso(displayEnd.value)
    modelValue.value[1] = isoString
}

function setDiaplyTime() {
    const startDate = modelValue.value[0] as any
    if (!startDate) {
        setDefaultStarTime()
    }
    else if (startDate instanceof Date) {
        displayStart.value = convertIsoToDisplayTime(startDate.toISOString())
    } else {
        const startTime = String(modelValue.value[0])
        displayStart.value = convertIsoToDisplayTime(startTime)
    }

    const endDate = modelValue.value[1] as any
    if (!endDate) {
        setDefaultEndTime()
    } else if (endDate instanceof Date) {
        displayEnd.value = convertIsoToDisplayTime(endDate.toISOString(), 1)
    } else {
        const endTime = String(modelValue.value[1])
        displayEnd.value = convertIsoToDisplayTime(endTime, 1)
    }
}

function setDefaultStarTime() {
    const currentDate = new Date()
    let hour = currentDate.getHours()
    const minute = currentDate.getMinutes()
    let base = minute / 15
    base = Math.ceil(base)
    if (base === 4) {
        hour += 1
        base = 0
    }
    let hourString = String(hour).padStart(2, '0')
    const minuteString = String(base * 15).padStart(2, '0')
    displayStart.value = `${hourString}:${minuteString}`
    currentDate.setHours(hour)
    currentDate.setMinutes(base * 15)
    modelValue.value[0] = currentDate.toISOString()
}

function setDefaultEndTime() {
    const currentDate = new Date()
    let hour = currentDate.getHours() + 1
    const minute = currentDate.getMinutes()
    let base = minute / 15
    base = Math.ceil(base)
    if (base === 4) {
        hour += 1
        base = 0
    }
    let hourString = String(hour).padStart(2, '0')
    const minuteString = String(base * 15).padStart(2, '0')
    displayEnd.value = `${hourString}:${minuteString}`
    currentDate.setHours(hour)
    currentDate.setMinutes(base * 15)
    modelValue.value[1] = currentDate.toISOString()
}



function convertIsoToDisplayTime(isoString: string, gap = 0) {
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

function convertDisplayToIso(display: string) {
    const times = display.split(':')
    const newHour = Number(times[0])
    const newMinutes = Number(times[1])
    let newDate: Date = new Date()
    const dateString = String(modelValue.value[0])
    newDate = new Date(dateString)
    newDate.setHours(newHour)
    newDate.setMinutes(newMinutes)
    return newDate.toISOString()
}

function setHours() {
    for (let hour = 0; hour < 24; hour++) {
        minutes.value.forEach((minute: string) => {
            const hourString = String(hour).padStart(2, '0')
            const minuteString = minute
            times.value.push(`${hourString}:${minuteString}`)
        })
    }
}

onMounted(() => {
    setHours()
    setDiaplyTime()
})
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