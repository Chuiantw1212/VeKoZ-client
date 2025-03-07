<template>
    <el-form ref="saveTemplateRef" :model="form">
        <el-form-item label="隸屬組織">
            <el-select v-model="form.organizationId" placeholder="請選擇">
                <el-option v-for="(item, index) in membershipList" :key="index" :label="`${item.organizationName}`"
                    :value="String(item.organizationId)" />
            </el-select>
        </el-form-item>
        <el-form-item label="模板名稱" :required="true" prop="name">
            <el-input v-model="form.name" placeholder="請輸入另存的模板名稱"></el-input>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import type { IOrganizationMember } from '~/types/organization';
const saveTemplateRef = ref<FormInstance>()
const repoOrganizationMember = useRepoOrganizationMember()
const form = defineModel('modelValue', {
    default: {
        name: '',
        organizationId: '',
    }
})

const membershipList = ref<IOrganizationMember[]>([])
// Hooks
onMounted(() => {
    getMemberOganizationList()
})

// Methods

async function getMemberOganizationList() {
    const result = await repoOrganizationMember.getMemberOrganizatoinList({
        allowMethods: ['POST'],
    })
    membershipList.value = result.items
}

async function validate() {
    const result = await saveTemplateRef.value?.validate()
    return result
}

defineExpose({
    validate,
})
</script>