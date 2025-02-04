<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <!-- 至少選擇自己作為講者，這樣才可以看到講師SEO頁面的效果 -->
        <el-form-item :label="customDesign.mutable?.label" :required="!allowDelete">
            <el-select v-model="customDesign.mutable.value" placeholder="請選擇現有組織成員" :filterable="true" :multiple="true"
                :allow-create="true" :reserve-keyword="false" :clearable="true" :disabled="disabled">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                    :value="String(item.id)" />
            </el-select>
        </el-form-item>
    </template>
    <!-- 編輯用 -->
    <template v-else-if="customDesign.mutable">
        <MoleculeCustomToolbar :allowDelete="allowDelete" @dragstart="emit('dragstart')" @remove="emit('remove')"
            @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
            <template v-slot:label>
                <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
            </template>
            <template v-slot:default>
                <el-select v-model="customDesign.mutable.value" placeholder="請選擇現有組織成員" :filterable="true"
                    :multiple="true" :allow-create="true" :reserve-keyword="false" :clearable="true"
                    :disabled="disabled">
                    <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                        :value="String(item.id)" />
                </el-select>
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
import type { IOrganizationMember } from '~/types/organization'
const repoOrganizationMember = useRepoOrganization()
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
interface IModel {
    type: 'organizationMember',
    mutable: {
        label: string,
        value: string,
    }
}
const customDesign = defineModel<IModel>('modelValue', {
    required: true,
    default: {
        type: 'organizationMember',
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
        default: '請輸入'
    },
    organizationId: {
        type: String,
        default: ""
    }
})


const organizationList = ref<IOrganizationMember[]>([])

// Hooks
watch(() => customDesign.value, (newValue) => {
    if (newValue.mutable) {
        return
    }
    const defaultValue = {
        type: 'organizationMember',
        mutable: {
            label: '組織成員',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
}, { immediate: true })
watch(() => props.organizationId, (newValue) => {
    getOrganizationMemberList(newValue)
}, { immediate: true })

// Methods
async function getOrganizationMemberList(organizationId: string) {
    if (organizationId) {
        const result = await repoOrganizationMember.getOrganizationMemberList(organizationId)
        organizationList.value = result
    }
}

</script>
