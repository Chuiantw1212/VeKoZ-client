<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" @dragstart="emit('dragstart')">
        <div class="avatar__wrapper">
            <AtomAvatarUploader v-if="customDesign" v-model="customDesign.value" :disabled="true"></AtomAvatarUploader>
        </div>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-if="showLabel" v-model="customDesign.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <div class="avatar__wrapper">
                <AtomAvatarUploader v-model="customDesign.value"></AtomAvatarUploader>
            </div>
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
        type: 'input',
        label: '任意文字'
    }
})

const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
    },
    size: {
        type: String as any, // 'large' | 'default' | 'small'
        default: 'default',
    },
    maxlength: {
        type: Number,
        default: 8,
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
    label: {
        type: String,
        default: '任意文字'
    },
    placeholder: {
        type: String,
        default: '請輸入任意文字'
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
    formField: {
        type: String,
        default: '',
    },
    showLabel: {
        type: Boolean,
        default: true,
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
    if (customDesign.value.hasOwnProperty('value')) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'input',
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
<style lang="scss" scoped>
.avatar__wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>