<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" @dragstart="emit('dragstart')">
        <el-input v-if="customDesign" v-model="customDesign.urlName" :placeholder="namePlaceholder"
            :disabled="disabled"></el-input>
        <el-input v-if="customDesign" class="design__mt" v-model="customDesign.urlValue" :placeholder="valuePlaceHolder"
            :disabled="disabled"></el-input>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" @dragstart="emit('dragstart')"
        @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.label" :maxlength="8" :show-word-limit="true" placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <el-input v-model="customDesign.urlName" :placeholder="props.namePlaceholder"
                :disabled="disabled"></el-input>
            <el-input class="design__mt" v-model="customDesign.urlValue" :placeholder="valuePlaceHolder"
                :disabled="disabled"></el-input>
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
        type: 'url',
        label: '網址',
        urlName: '',
        urlValue: '',
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
    placeholder: {
        type: String,
        default: '連結與文字僅在編輯時類似，在參加者看來會有所不同'
    },
    namePlaceholder: {
        type: String,
        default: '微課室',
    },
    valuePlaceHolder: {
        type: String,
        default: 'https://venonia.com',
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
    formField: {
        type: String,
        default: '', // virtualLocation
    },
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
    if (customDesign.value) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'url',
        label: '',
        urlName: '',
        urlValue: '',
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
.design__mt {
    margin-top: 4px;
}
</style>