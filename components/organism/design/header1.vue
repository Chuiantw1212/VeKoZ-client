<template>
    <!-- 檢視用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" :required="!allowDelete">
        <el-input v-model="customDesign.mutable.value" :placeholder="placeholder" :maxlength="30"
            :show-word-limit="true" size="large"></el-input>
    </el-form-item>
    <!-- 編輯用 -->
    <MoleculeCustomToolbar v-else-if="customDesign.mutable" :loading="isLoading" :allowDelete="allowDelete"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
        </template>
        <template v-slot:default>
            <el-input :placeholder="placeholder" v-model="customDesign.mutable.value" :maxlength="30"
                :show-word-limit="true" size="large"></el-input>
        </template>
    </MoleculeCustomToolbar>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()
interface IModel {
    type: 'header1',
    mutable: {
        label: string,
        value: string,
    }
}
const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'header1',
        mutable: {
            label: ''
        }
    },
})

const props = defineProps({
    isDesigning: {
        type: Boolean,
        default: false
    },
    allowDelete: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '請輸入主標題'
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})

watch(customDesign.value, async (newValue) => {
    // 觸發更新
    handleChange(newValue)

    // 附加預設值
    if (newValue?.mutable) {
        return
    }
    const defaultValue = {
        type: 'header1',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
})

// methods
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
