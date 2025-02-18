<template>
    <!-- 檢視與編輯用 -->
    <!-- 至少選擇自己作為講者，這樣才可以看到講師SEO頁面的效果 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" :required="required"
        :prop="customDesign.formField">
        <el-select v-if="customDesign.mutable" v-model="customDesign.mutable.value" :placeholder="editPlaceHolder"
            :filterable="true" :multiple="true" :allow-create="true" :reserve-keyword="false" :clearable="true"
            :disabled="disabled || !props.organizationId">
            <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                :value="String(item.id)" />
        </el-select>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <el-select v-model="customDesign.mutable.value" placeholder="請選擇現有組織成員" :filterable="true" :multiple="true"
                :allow-create="true" :reserve-keyword="false" :clearable="true" :disabled="disabled">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                    :value="String(item.id)" />
            </el-select>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { IOrganizationMember } from '~/types/organization'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const repoOrganizationMember = useRepoOrganization()
const isLoading = ref(false)
const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'organizationMember',
        mutable: {
            label: '組織成員', // 純瀏覽時使用
            value: ''
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
    organizationId: {
        type: String,
        default: ""
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})

const organizationList = ref<IOrganizationMember[]>([])

// Hooks
watch(() => props.organizationId, (newValue) => {
    getOrganizationMemberList(newValue)
}, { immediate: true })

watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

const editPlaceHolder = computed(() => {
    return props.organizationId ? '請選擇現有組織成員' : '請先選擇組織'
})

// methods
function setDefaultValue() {
    if (customDesign.value.mutable) {
        return
    }
    const defaultValue = {
        type: 'organizationMember',
        mutable: {
            label: '組織成員',
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
async function getOrganizationMemberList(organizationId: string) {
    if (organizationId) {
        const result = await repoOrganizationMember.getOrganizationMemberList(organizationId)
        organizationList.value = result
    }
}
</script>
