<template>
    <div class="dateTimeRange">
        <el-date-picker class="dateTimeRange__date" :placeholder="placeholder" v-model="date"
            :disabled-date="disablePastDays" :disabled="disabledDate" @blur="setDate()" @change="setDate()"
            @clear="checkClearDate()"></el-date-picker>
        <AtomVekozTimePickerNew class="dateTimeRange__time" v-model:startDate="startDate" v-model:endDate="endDate">
        </AtomVekozTimePickerNew>
    </div>
</template>
<script setup lang="ts">
const date = ref<Date>()
const startDate = defineModel<Date | null>('startDate', {
    default: new Date()
})
const endDate = defineModel<Date | null>('endDate', {
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
    }
})

// Methods
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
function setDate() {
    if (!startDate.value || !endDate.value || !date.value) {
        return
    }
    const newYear = date.value.getFullYear()
    const newMonth = date.value.getMonth()
    const newDate = date.value.getDate()
    const defaultTime = getDefaultTime()
    const newStartDate: Date = new Date(newYear, newMonth, newDate, defaultTime.hour, defaultTime.minute)
    const newEndDate: Date = new Date(newYear, newMonth, newDate, defaultTime.hour + 1, defaultTime.minute)
    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
        return
    }
    startDate.value = newStartDate
    endDate.value = newEndDate
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
</script>
<style lang="scss" scoped>
.dateTimeRange {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;

    .dateTimeRange__date {
        flex: 1;
    }

    .dateTimeRange__time {
        flex: 1;
    }
}
</style>