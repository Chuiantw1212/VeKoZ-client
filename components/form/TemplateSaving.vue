<template>
    <el-form ref="saveTemplateRef" :model="eventTemplate" :rules="formRules">
        <el-form-item label="模板隸屬組織" prop="organizerId">
            <el-select v-model="eventTemplate.organizerId" placeholder="請選擇" @change="setOrganization($event)">
                <el-option v-for="(item, index) in membershipList" :key="index" :label="`${item.organizationName}`"
                    :value="String(item.organizationId)" />
            </el-select>
        </el-form-item>
        <el-form-item label="模板名稱" prop="name">
            <el-input v-model="eventTemplate.name" placeholder="請輸入另存的模板名稱"></el-input>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import type { IEventTemplate } from '~/types/eventTemplate';
import type { IOrganizationMember } from '~/types/organization';
const saveTemplateRef = ref<FormInstance>()
const repoOrganizationMember = useRepoOrganizationMember()
const eventTemplate = defineModel<IEventTemplate>('modelValue', {
    default: {
        name: '',
        organizerId: '',
        organizerName: '',
        organizerLogo: '',
    }
})

const membershipList = ref<IOrganizationMember[]>([])
const formRules = {
    organizerId: { required: true, message: '模板隸屬組織必填' },
    name: { required: true, message: '模板名稱必填' },
}

// Hooks
onMounted(() => {
    getMemberOganizationList()
})

// Methods
function setOrganization(organizerId: string) {
    const selectedMembership = membershipList.value.find(member => {
        return member.organizationId === organizerId
    })
    if (selectedMembership) {
        eventTemplate.value.organizerName = selectedMembership.organizationName ?? ''
        eventTemplate.value.organizerLogo = selectedMembership.organizationLogo ?? ''
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