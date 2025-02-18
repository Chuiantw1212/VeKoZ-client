<template>
    <div class="timeRangePicker">
        <el-icon color="#a8abb2" size="14px">
            <Clock />
        </el-icon>
        <select v-model="displayStart" class="timeRangePicker__select">
            <option v-for="time in times">{{ time }}</option>
        </select>
        -
        <select v-model="displayEnd" class="timeRangePicker__select">
            <option v-for="time in times">{{ time }}</option>
        </select>
    </div>
</template>
<script setup lang="ts">
import { Clock } from '@element-plus/icons-vue'
const times = ref<string[]>([])
const minutes = ref<string[]>(['00', '15', '30', '45',])
const displayStart = ref<string>('')
const displayEnd = ref<string>('')

const modelValue = defineModel('modelValue', {
    type: Array,
    required: true,
    default: []
})

function setDefaultTime() {
    if (!modelValue[0]) {
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
    }
    if (!modelValue[1]) {
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
    }
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
    setDefaultTime()
})
</script>
<style lang="scss" scoped>
.timeRangePicker {
    display: flex;
    align-items: center;
    height: 30px;
    border: 1px solid lightgray;
    border-radius: 4px;
    gap: 4px;
    width: fit-content;
    padding: 0 10px;

    .timeRangePicker__select {
        border: 0px;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
        padding: 0 10px;

        &:focus {
            outline: none;
        }
    }
}
</style>