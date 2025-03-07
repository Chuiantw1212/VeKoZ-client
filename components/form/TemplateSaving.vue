<template>
    <el-form ref="saveTemplateRef" :model="form" :rules="formRules">
        <el-form-item label="模板隸屬組織" prop="organizationId">
            <el-select v-model="form.organizationId" placeholder="請選擇" @change="setOrganization($event)">
                <el-option v-for="(item, index) in membershipList" :key="index" :label="`${item.organizationName}`"
                    :value="String(item.organizationId)" />
            </el-select>
        </el-form-item>
        <el-form-item label="模板名稱" prop="name">
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
        organizationName: '',
        organizatoinLogo: '',
    }
})

const membershipList = ref<IOrganizationMember[]>([])
const formRules = {
    organizationId: { required: true, message: '模板隸屬組織必填' },
    name: { required: true, message: '模板名稱必填' },
}

// Hooks
onMounted(() => {
    getMemberOganizationList()
})

// Methods
function setOrganization(organizationId: string) {
    const selectedMembership = membershipList.value.find(member => {
        return member.organizationId === organizationId
    })
    if (selectedMembership) {
        form.value.organizationName = selectedMembership.organizationName ?? ''
        form.value.organizatoinLogo = selectedMembership.organizationLogo ?? ''
    }
}
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