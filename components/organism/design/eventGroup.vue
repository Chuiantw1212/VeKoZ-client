<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label">
        <el-input v-model="customDesign.mutable.value" :placeholder="placeholder" :disabled="disabled"></el-input>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')"
        @mouseenter="emit('mouseenter')" @mouseout="emit('mouseout')">
        <template v-slot:label>
            <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <el-input :placeholder="placeholder" v-model="customDesign.mutable.value" :disabled="disabled"></el-input>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart', 'mouseenter', 'mouseout'])
const isLoading = ref(false)
const repoUI = useRepoUI()
interface IModel {
    type: 'eventGroup',
    mutable: {
        label: string,
        value: string,
    }
}

const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'eventGroup',
        mutable: {
            label: '活動群組'
        }
    }
})

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
        default: true
    },
    placeholder: {
        type: String,
        default: '例：EN的理財八堂課，統一曝光'
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
        return
    }
    const defaultValue = {
        type: 'eventGroup',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
</script>
