<template>
    <!-- 檢視與編輯用 -->
    <!-- customDesign:{{ customDesign }} -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" :required="required"
        :prop="customDesign.formField" @dragstart="emit('dragstart')" :model="customDesign">
        <div class="dateTimeRange">
            <!-- {{ customDesign }} -->
            <AtomVekozDateTimeRange v-model:start-date="customDesign.startDate" v-model:end-date="customDesign.endDate"
                :disabled="disabled">
            </AtomVekozDateTimeRange>
        </div>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.label" :maxlength="8" :show-word-limit="true" placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <div class="dateTimeRange">
                <!-- {{ customDesign }} -->
                <AtomVekozDateTimeRange v-model:start-date="customDesign.startDate"
                    v-model:end-date="customDesign.endDate" :disabled="disabled">
                </AtomVekozDateTimeRange>
            </div>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['remove', 'moveUp', 'moveDown', 'dragstart', 'mouseenter', 'mouseout'])
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

// Hooks
onMounted(() => {
    setDefaultValue()
})

watch(() => customDesign.value.startDate, (newValue) => {
    handleChange()
}, { deep: true })

watch(() => customDesign.value.endDate, (newValue) => {
    handleChange()
}, { deep: true })

// methods
function setDefaultValue() {
    if (customDesign.value.startDate && customDesign.value.endDate) {
        return
    }
    const currentDateInstance = new Date()
    const currentYear = currentDateInstance.getFullYear()
    const currentMonth = currentDateInstance.getMonth()
    const currentDate = currentDateInstance.getDate()
    const defaultTime = getDefaultTime()

    // 這邊設定最初始的時間
    const defaultValue: ITemplateDesign = {
        type: 'dateTimeRange',
        label: '時間日期',
        startDate: new Date(currentYear, currentMonth, currentDate, defaultTime.hour, defaultTime.minute),
        endDate: new Date(currentYear, currentMonth, currentDate, defaultTime.hour + 1, defaultTime.minute),
    }
    if (props.formField) {
        defaultValue.formField = props.formField
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
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

async function handleChange() {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(customDesign.value)
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