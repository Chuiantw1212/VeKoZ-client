<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" class="formItem"
        :class="{ 'formItem--center': customDesign.alignment === 'center' }" :label="customDesign.label"
        :required="required" :prop="customDesign.formField" @dragstart="emit('dragstart')">
        <el-input v-if="customDesign" v-model="customDesign.value" type="textarea" :rows="3" :maxlength="90"
            :show-word-limit="true" :placeholder="placeholder" :disabled="disabled" />
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" class="formItem"
        :class="{ 'formItem--center': customDesign.alignment === 'center' }" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-if="props.showLabel" v-model="customDesign.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <el-input v-model="customDesign.value" type="textarea" :rows="3" :maxlength="90" :show-word-limit="true"
                :placeholder="placeholder" :disabled="disabled" />
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const isLoading = ref(false)
const repoUI = useRepoUI()
const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'textarea',
        label: '描述'
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
        default: '請輸入描述'
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
    formField: {
        type: String,
        default: '',
    },
    // alignment: {
    //     type: String,
    //     defualt: 'left'
    // },
    showLabel: {
        type: Boolean,
        default: true,
    }
})

// Hooks
onMounted(() => {
    setDefaultValue()
})
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
        type: 'textarea',
        label: '描述',
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
<style lang="scss" scoped>
.formItem--center {
    :deep(.el-textarea__inner) {
        text-align: center;
    }
}
</style>