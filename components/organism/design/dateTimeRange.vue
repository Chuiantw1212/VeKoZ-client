<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" :required="required"
        :prop="customDesign.formField">
        <!-- <el-date-picker v-if="customDesign.mutable" v-model="customDesign.mutable.value" :placeholder="placeholder"
            type="datetimerange" :disabled="disabled"></el-date-picker> -->
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" @dragstart="emit('dragstart')"
        @remove="emit('remove')" @moveUp="emit('moveUp')" :required="required" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            {{ customDesign.mutable.value }}
            <el-date-picker :placeholder="placeholder" v-model="date" @change="setDefaultTime()"></el-date-picker>
            <el-time-picker v-model="customDesign.mutable.value" :placeholder="placeholder" is-range></el-time-picker>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()
const date = ref<Date>(new Date())
const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: () => {
        const startDate = new Date()
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        const currentHour = startDate.getHours()
        const endDate = new Date()
        endDate.setHours(currentHour + 1)
        endDate.setMinutes(0)
        endDate.setSeconds(0)
        return {
            type: 'dateTimeRange',
            mutable: {
                label: '時間日期',
                value: [startDate, endDate]
            }
        }
    }
},)

const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})

// 附加預設值
onMounted(() => {
    if (customDesign.value?.mutable) {
        return
    }
    const defaultValue = {
        type: 'dateTimeRange',
        mutable: {
            label: '',
            value: [new Date(), new Date()]
        }
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    handleChange(newValue)
}, { deep: true })

// methods
function setDefaultTime() {
    if (!customDesign.value.mutable) {
        return
    }
    // get current
    const newYear = date.value.getFullYear()
    const newMonth = date.value.getMonth()
    const newDate = date.value.getDate()
    const newHour = date.value.getHours()

    let newStartDate: Date = new Date()
    newStartDate.setMinutes(0)
    newStartDate.setSeconds(0)
    let newEndDate: Date = new Date()
    const dates: string[] = customDesign.value.mutable.value
    if (!dates) {
        newEndDate.setHours(newHour + 1)
        customDesign.value.mutable.value = [newStartDate, newEndDate]
        return
    }

    // set startDate
    if (dates[0]) {
        newStartDate = new Date(dates[0])
    }
    newStartDate.setFullYear(newYear)
    newStartDate.setFullYear(newMonth)
    newStartDate.setDate(newDate)

    // set endDate
    if (dates[1]) {
        newEndDate = new Date(dates[1])
    }
    newEndDate.setFullYear(newYear)
    newEndDate.setFullYear(newMonth)
    newEndDate.setDate(newDate)

    customDesign.value.mutable.value = [newStartDate, newEndDate]
    // console.log({
    //     dates
    // })
    // const startDate = dates[0]
    // console.log(startDate instanceof Date)
    // return
    // const endDate = dates[1]
    // if (!dates[0] && !dates[1]) {
    //     const startDate = date.value
    //     const currentHour = startDate.getHours()
    //     const endDate = new Date()
    //     endDate.setHours(currentHour + 1)
    //     customDesign.value.mutable.value = [startDate, endDate]
    //     return
    // }

    // if (dates[0]) {
    //     customDesign.value.mutable.value[0].setFullYear(newYear)
    //     customDesign.value.mutable.value[0].setMonth(newMonth)
    //     customDesign.value.mutable.value[0].setDate(newDate)
    // }
    // if (dates[1]) {
    //     customDesign.value.mutable.value[1].setFullYear(newYear)
    //     customDesign.value.mutable.value[1].setMonth(newMonth)
    //     customDesign.value.mutable.value[1].setDate(newDate)
    // }
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
</script>
<style lang="scss" scoped>
.design {
    .design__item {
        display: flex;

        .item__label {
            display: flex;
            padding-right: 12px;

            .label__input {
                outline: none;
            }
        }
    }
}
</style>