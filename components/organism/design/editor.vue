<template>
    <div>
        <!-- 檢視與編輯用 -->
        <el-form-item v-if="!props.isDesigning" :label="customDesign.label" @dragstart="emit('dragstart')">
            <AtomVenoniaEditor v-if="customDesign" v-model="customDesign.value" :placeholder="placeholder"
                :alignment="alignment" :disabled="disabled">
            </AtomVenoniaEditor>
        </el-form-item>
        <!-- 樣板編輯專用 -->
        <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
            @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')">
            <template v-slot:default>
                <AtomVenoniaEditor v-model="customDesign.value" :disabled="disabled" :placeholder="placeholder"
                    :alignment="alignment" @dragstart="emit('dragstart')">
                </AtomVenoniaEditor>
            </template>
        </MoleculeDesignToolbar>
    </div>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart', 'mouseout'])
const isLoading = ref(false)
const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'editor',
        label: ''
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
    },
    formField: {
        type: String,
        default: '',
    },
    /**
     * https://ckeditor.com/docs/ckeditor5/latest/features/text-alignment.html#common-api
     */
    alignment: {
        type: String,
        default: 'justify' as 'left' | 'right' | 'center' | 'justify'
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
    if (customDesign.value.hasOwnProperty('value')) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'editor',
        label: '',
        value: '',
    }
    if (props.formField) {
        defaultValue.formField = props.formField
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
