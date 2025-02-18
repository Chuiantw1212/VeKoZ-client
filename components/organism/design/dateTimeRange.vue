<template>
    <!-- 檢視與編輯用 -->
    <!-- customDesign: {{ customDesign }} -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" :required="required"
        :prop="customDesign.formField">
        <div class="dateTimeRange">
            <el-date-picker class="dateTimeRange__date" :placeholder="placeholder" v-model="date"
                :disabled="disabled"></el-date-picker>
            <AtomVenoniaTimePicker v-if="customDesign.mutable" class="dateTimeRange__time"
                v-model="customDesign.mutable.value" :placeholder="placeholder" :disabled="disabled">
            </AtomVenoniaTimePicker>
        </div>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" @dragstart="emit('dragstart')"
        @remove="emit('remove')" @moveUp="emit('moveUp')" :required="required" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <div class="dateTimeRange">
                <el-date-picker class="dateTimeRange__date" :placeholder="placeholder" v-model="date"></el-date-picker>
                <AtomVenoniaTimePicker class="dateTimeRange__time" v-model="customDesign.mutable.value">
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
const date = ref<Date>(new Date())
const customDesign = defineModel<ITemplateDesign>('modelValue', {
    type: Object,
    default: () => {
        return {
            type: 'dateTimeRange',
            mutable: {
                label: '時間日期',
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
    if (customDesign.value?.mutable) {
        // 防止無限迴圈
        return
    }
    delete customDesign.value.mutable // IMPORTANT: 刪掉會有不明的錯誤
    const defaultValue = {
        type: 'dateTimeRange',
        mutable: {
            label: '',
            value: [new Date(), new Date()]
        }
    }
    date.value = new Date()
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    if (!mergedItem.mutable) {
        alert('元件初始化失敗！') // 偵測不明的錯誤
    }
    customDesign.value = mergedItem
}

function setDefaultTime() {
    if (!customDesign.value.mutable) {
        return
    }
    // // get current
    // const newYear = date.value.getFullYear()
    // const newMonth = date.value.getMonth()
    // const newDate = date.value.getDate()

    // let newStartDate: Date = new Date()
    // let newEndDate: Date = new Date()
    // const dates: string[] = customDesign.value.mutable.value
    // if (!dates) {
    //     newStartDate.setHours(0)
    //     newStartDate.setMinutes(0)
    //     newStartDate.setSeconds(0)

    //     newEndDate.setHours(23)
    //     newEndDate.setMinutes(0)
    //     newEndDate.setSeconds(0)
    //     customDesign.value.mutable.value = [newStartDate, newEndDate]
    //     return
    // }

    // // set startDate
    // if (dates[0]) {
    //     const oldStartDate = dates[0] as any
    //     if (oldStartDate instanceof Date) {
    //         newStartDate = oldStartDate
    //     } else {
    //         newStartDate = new Date(dates[0])
    //     }
    // }
    // newStartDate.setFullYear(newYear)
    // newStartDate.setFullYear(newMonth)
    // newStartDate.setDate(newDate)

    // // set endDate
    // if (dates[1]) {
    //     const oldEndDate = dates[1] as any
    //     if (oldEndDate instanceof Date) {
    //         newEndDate = oldEndDate
    //     } else {
    //         newEndDate = new Date(dates[1])
    //     }
    // }
    // newEndDate.setFullYear(newYear)
    // newEndDate.setFullYear(newMonth)
    // newEndDate.setDate(newDate)

    // // set dates
    // customDesign.value.mutable.value = [newStartDate, newEndDate]
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