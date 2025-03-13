<template>
    <div class="dateTimeRange">
        <!-- typeof date {{ typeof date }} -->
        <!-- date instanceOf Date {{ date instanceof Date }} -->
        <el-date-picker class="dateTimeRange__date" :placeholder="props.placeholder" v-model="date"
            :disabled-date="disablePastDays" :disabled="props.disabledDate" @blur="onDateChanged()"
            @clear="checkClearDate()"></el-date-picker>
        <!-- {{ endDate }} -->
        <AtomVekozTimePickerNew class="dateTimeRange__time" v-model:startDate="startDate" v-model:endDate="endDate"
            :minDate="minDate" :maxDate="maxDate">
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
        type: Date,
    },
    maxDate: {
        type: Date,
    },
})

// Hooks
onMounted(() => {
    setDefaultValue()
})

// Methods
function setDefaultValue() {
    if (startDate.value) {
        date.value = new Date(startDate.value)
    } else {
        date.value = new Date()
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
    if (!startDate.value || !endDate.value || !date.value) {
        return
    }
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