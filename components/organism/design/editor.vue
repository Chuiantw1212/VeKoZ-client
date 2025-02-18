<template>
    <div>
        <!-- 檢視與編輯用 -->
        <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label">
            <AtomVenoniaEditor v-if="customDesign.mutable" v-model="customDesign.mutable.value"
                :placeholder="placeholder" :disabled="disabled">
            </AtomVenoniaEditor>
        </el-form-item>
        <!-- 樣板編輯專用 -->
        <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" :required="required"
            @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')" @mouseenter="emit('mouseenter')" @mouseout="emit('mouseout')">
            <template v-slot:default>
                <AtomVenoniaEditor v-model="customDesign.mutable.value" :disabled="disabled" :placeholder="placeholder">
                </AtomVenoniaEditor>
            </template>
        </MoleculeDesignToolbar>
    </div>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart', 'mouseenter', 'mouseout'])
const isLoading = ref(false)
const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'editor',
        mutable: {
            label: ''
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
        default: false
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
    noMargin: {
        type: Boolean,
        default: false
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
        type: 'editor',
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
