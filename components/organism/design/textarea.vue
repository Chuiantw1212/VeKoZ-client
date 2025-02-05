<template>
    <!-- 檢視用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" :required="!allowDelete">
        <el-mention v-model="customDesign.mutable.value" type="textarea" :maxlength="150" :show-word-limit="true"
            :placeholder="placeholder" :disabled="disabled" />
    </el-form-item>
    <!-- 編輯用 -->
    <MoleculeCustomToolbar v-else-if="customDesign.mutable" :loading="isLoading" :allowDelete="allowDelete"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
        </template>
        <template v-slot:default>
            <el-mention v-model="customDesign.mutable.value" type="textarea" :maxlength="150" :show-word-limit="true"
                :placeholder="placeholder" :disabled="disabled" />
        </template>
    </MoleculeCustomToolbar>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()
interface IModel {
    type: 'textarea',
    mutable: {
        label: string,
        value: string,
    }
}

const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'textarea',
        mutable: {
            label: '多行文字'
        }
    }
})

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'textarea',
                mutable: {
                    label: '多行文字'
                }
            }
        }
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    allowDelete: {
        type: Boolean,
        default: true
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

watch(() => customDesign.value, (newValue) => {
    // 觸發更新
    handleChange(newValue)

    // 附加預設值
    if (newValue?.mutable) {
        return
    }
    const defaultValue = {
        type: 'textarea',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
})

// Methods
async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    const id = templateDesign.id ?? crypto.randomUUID()
    debouncePatchEventTemplateDesign(id, templateDesign)
}

const debouncePatchEventTemplateDesign = repoUI.debounce(async (templateDesign: any) => {
    await props.onchange(templateDesign)
    isLoading.value = false
})
</script>
