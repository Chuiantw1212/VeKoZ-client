<template>
    <!-- 檢視用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" :required="!allowDelete">
        <el-select v-model="customDesign.mutable.value" placeholder="請選擇現有組織" :clearable="true" :disabled="disabled">
            <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
    </el-form-item>
    <!-- 編輯用 -->
    <MoleculeCustomToolbar v-else-if="customDesign.mutable" :loading="isLoading" :allowDelete="allowDelete"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
        </template>
        <template v-slot:default>
            <el-select v-model="customDesign.mutable.value" placeholder="請選擇現有組織" :clearable="true"
                :disabled="disabled">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
        </template>
    </MoleculeCustomToolbar>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const repoOrganization = useRepoOrganization()
const isLoading = ref(false)
const repoUI = useRepoUI()
interface IModel {
    type: 'organization',
    mutable: {
        label: string,
        value: string,
    }
}

const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'organization',
        mutable: {
            label: '組織', // 純瀏覽時使用
            value: ''
        }
    }
})

const props = defineProps({
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
        default: '請選擇現有組織'
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})
const organizationList = ref<IOrganization[]>([])

// Hooks
onMounted(() => {
    getOrganizationList()
})
watch(() => customDesign.value, (newValue) => {
    if (newValue?.mutable) {
        return
    }

    // 新增時添加預設值
    const defaultValue = {
        type: 'organization',
        mutable: {
            label: '組織',
            value: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
})

// Methods
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}
</script>
