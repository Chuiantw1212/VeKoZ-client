<template>
    <!-- 檢視與編輯用 -->
    <!-- customDesign.value: {{ customDesign.value }} -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" :required="required"
        :prop="customDesign.formField" @dragstart="emit('dragstart')">
        <div class="dateTimeRange">
            <el-date-picker class="dateTimeRange__date" :placeholder="placeholder" v-model="date" @blur="setDate()"
                @change="setDate()" :disabled="disabled" @clear="checkClearDate()"></el-date-picker>
            <AtomVenoniaTimePicker v-if="customDesign" class="dateTimeRange__time" v-model="customDesign.value"
                :placeholder="placeholder" :disabled="disabled">
            </AtomVenoniaTimePicker>
        </div>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" @dragstart="emit('dragstart')"
        @remove="emit('remove')" @moveUp="emit('moveUp')" :required="required" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.label" :maxlength="8" :show-word-limit="true" placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <div class="dateTimeRange">
                <el-date-picker class="dateTimeRange__date" :placeholder="placeholder" v-model="date" @blur="setDate()"
                    @change="setDate()" @clear="checkClearDate()"></el-date-picker>
                <AtomVenoniaTimePicker class="dateTimeRange__time" v-model="customDesign.value">
                </AtomVenoniaTimePicker>
            </div>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()
const date = ref<Date>()
const customDesign = defineModel<ITemplateDesign>('modelValue', {
    type: Object,
    default: () => {
        return {
            type: 'dateTimeRange',
            label: '時間日期',
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
    },
    formField: {
        type: String,
        default: '',
    },
})

onMounted(() => {
    setDefaultValue()
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

// methods
function setDefaultValue() {
    if (customDesign.value) {
        // 防止無限迴圈
        if (customDesign.value) {
            date.value = new Date(customDesign.value.value[0])
        } else {
            date.value = new Date()
        }
        return
    }

    const startDate = new Date()
    const endDate = new Date()
    const currentHour = new Date().getHours()
    endDate.setHours(currentHour + 1)
    const defaultValue: ITemplateDesign = {
        type: 'dateTimeRange',
        label: '時間日期',
        value: [startDate, endDate]
    }
    if (props.formField) {
        defaultValue.formField = props.formField
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
}

function setDate() {
    if (!customDesign.value || !date.value) {
        return
    }
    const newYear = date.value.getFullYear()
    const newMonth = date.value.getMonth()
    const newDate = date.value.getDate()
    const defaultTime = getDefaultTime()

    const newStartDate: Date = new Date(newYear, newMonth, newDate, defaultTime.hour, defaultTime.minute)
    const newEndDate: Date = new Date(newYear, newMonth, newDate, defaultTime.hour + 1, defaultTime.minute)
    if (!isNaN(newStartDate.getTime()) || !isNaN(newEndDate.getTime())) {
        return
    }
    const newStartISO = newStartDate.toISOString()
    const newEndISO = newEndDate.toISOString()
    customDesign.value.value = [newStartISO, newEndISO]
}

function checkClearDate() {
    if (customDesign.value) {
        customDesign.value.value = []
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

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
</script>
<style lang="scss" scoped>
.dateTimeRange {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .dateTimeRange__date {
        flex: 1;
    }

    .dateTimeRange__time {
        flex: 1;
    }
}
</style>