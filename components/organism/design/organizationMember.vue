<template>
    <!-- 檢視與編輯用 -->
    <!-- organizationId{{organizationId}} -->
    <!-- 至少選擇自己作為講者，這樣才可以看到講師SEO頁面的效果 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" :required="required"
        :prop="customDesign.formField" @dragstart="emit('dragstart')">
        <el-select v-if="customDesign" v-model="customDesign.memberIds" :placeholder="editPlaceHolder"
            :filterable="true" :multiple="true" :allow-create="true" :reserve-keyword="false" :clearable="true"
            :disabled="disabled || !props.organizationId" @change="setMemberNames()">
            <el-option v-for="(item, index) in organizationMemberList" :key="index" :label="item.name"
                :value="String(item.id)" />
        </el-select>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.label" :maxlength="8" :show-word-limit="true" placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <el-select v-model="customDesign.memberIds" placeholder="請選擇現有組織成員" :filterable="true" :multiple="true"
                :allow-create="true" :reserve-keyword="false" :clearable="true" :disabled="disabled"
                @change="setMemberNames()">
                <el-option v-for="(item, index) in organizationMemberList" :key="index" :label="item.name"
                    :value="String(item.id)" />
            </el-select>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { IOrganizationMember } from '~/types/organization'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const repoOrganizationMember = useRepoOrganization()
const isLoading = ref(false)
const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'organizationMember',
        label: '組織成員', // 純瀏覽時使用
        memberIds: [],
        memberNames: [],
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
    },
    formField: {
        type: String,
        default: '',
    },
})

const organizationMemberList = ref<IOrganizationMember[]>([])

// Hooks
onMounted(() => {
    setDefaultValue()
})

watch(() => props.organizationId, (newValue) => {
    getOrganizationMemberList(newValue)
}, { immediate: true, deep: true, })

watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

const editPlaceHolder = computed(() => {
    return props.organizationId ? '請選擇現有組織成員' : '請先選擇組織'
})

// methods
function setDefaultValue() {
    if (customDesign.value.memberIds) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'organizationMember',
        label: '組織成員',
        memberIds: [],
        memberNames: [],
    }
    if (props.formField) {
        defaultValue.formField = props.formField
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
}

function setMemberNames() {
    const names = customDesign.value.memberIds?.map(id => {
        const selectedItem = organizationMemberList.value.find(member => {
            return member.id === id
        })
        return selectedItem?.name ?? ''
    })
    if (customDesign.value) {
        customDesign.value.memberNames = names
    }
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
        organizationMemberList.value = result
    }
}
</script>
