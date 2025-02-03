<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-select v-model="customDesign.mutable.value" placeholder="請選擇現有組織" :clearable="true">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
    </template>
    <!-- 編輯用 -->
    <template v-else-if="customDesign.mutable">
        <MoleculeCustomToolbar @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')">
            <template v-slot:label>
                <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
            </template>
            <template v-slot:default>
                <el-select v-model="customDesign.mutable.value" placeholder="請選擇現有組織" :clearable="true">
                    <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                        :value="item.id" />
                </el-select>
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
import { computed, watch } from 'vue';
const repoOrganization = useRepoOrganization()
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'organization',
                mutable: {
                    label: '組織名稱'
                }
            }
        }
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '請輸入'
    }
})


const organizationList = ref<IOrganization[]>([])

// Hooks
onMounted(() => {
    getOrganizationList()
})

const customDesign = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
watch(() => customDesign.value, (newValue) => {
    if (newValue.mutable) {
        return
    }
    const defaultValue = {
        type: 'organization',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

}, { immediate: true })

// Methods
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}

</script>
