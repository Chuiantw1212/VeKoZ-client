<template>
    <div class="dateTimeRange">
        <el-date-picker class="dateTimeRange__date" :placeholder="placeholder" v-model="date"
            :disabled-date="disablePastDays" :disabled="disabledDate" @blur="setDate()" @change="setDate()"
            @clear="checkClearDate()"></el-date-picker>
        <AtomVekozTimePickerNew class="dateTimeRange__time" v-model:startDate="startDate">
        </AtomVekozTimePickerNew>
    </div>
</template>
<script setup lang="ts">
const date = ref<Date>()

const startDate = defineModel<Date>('startDate', {
    default: new Date()
})

const endDate = defineModel<Date>('endDate', {
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
    // if (customDesign.value) {
    //     customDesign.value.value = []
    // }
}
function setDate() {
    // if (!customDesign.value || !date.value) {
    //     return
    // }
    // const newYear = date.value.getFullYear()
    // const newMonth = date.value.getMonth()
    // const newDate = date.value.getDate()
    // const defaultTime = getDefaultTime()
    // const newStartDate: Date = new Date(newYear, newMonth, newDate, defaultTime.hour, defaultTime.minute)
    // const newEndDate: Date = new Date(newYear, newMonth, newDate, defaultTime.hour + 1, defaultTime.minute)
    // if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
    //     return
    // }
    // const newStartISO = newStartDate
    // const newEndISO = newEndDate
    // customDesign.value.value = [newStartISO, newEndISO]
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