<template>
    <div>
        <el-form :model="membershipForm">
            <el-row>
                <el-col>
                    <el-form-item label="選擇組織">
                        <el-select v-model="membershipForm.organizationId" placeholder="請選擇"
                            @change="getOrganizerTemplateList()">
                            <el-option v-for="(item, index) in membershipList" :key="index"
                                :label="`${item.organizationName}`" :value="String(item.organizationId)" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template v-if="selectedMemberCanPost">
            <el-table v-if="templateList.length" :data="templateList" style="width: 100%">
                <el-table-column prop="organizerLogo" label="組織商標">
                    <template #default="{ row }">
                        <template v-if="row.organizerLogo">
                            <el-avatar :src="row.organizerLogo"></el-avatar>
                        </template>
                        <template v-else>
                            -
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="模板名稱" />
                <el-table-column prop="" label="選擇">
                    <template #default="{ row }">
                        <el-button size="small" @click="selectTemplate(row)">
                            套用
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-empty v-else description="沒有新增權限">

        </el-empty>
    </div>
</template>
<script setup lang="ts">
import type { IEventTemplate } from '~/types/eventTemplate';
import type { IOrganizationMember, IOrganizationMemberQuery } from '~/types/organization';

const emit = defineEmits(['update:modelValue'])
const repoEventTemplate = useRepoEventTemplate()
const repoOrganizationMember = useRepoOrganizationMember()
const repoUser = useRepoUser()
const isLoading = ref<boolean>(false)

const membershipForm = ref<IOrganizationMemberQuery>({
    organizationId: '',
})

const eventTemplate = defineModel<IEventTemplate>('modelValue', {
    type: Object,
    default: {
        id: '',
        designs: []
    }
})

const membershipList = ref<IOrganizationMember[]>([])
const selectedOrganizerLogo = ref<string>('')
const selectedMemberCanPost = ref<boolean>(false)
const templateList = ref<IEventTemplate[]>([])

// Hooks
onMounted(async () => {
    await getOrganizationMemberships()
    setDefaultValue()
})

// Methods
function setDefaultValue() {
    const organizerId = repoUser.userInfo.preference?.event.organizerId
    // console.log('??', organizerId)
    if (organizerId) {
        membershipForm.value.organizationId = organizerId
        getOrganizerTemplateList()
    }
}

async function getOrganizationMemberships() {
    const response = await repoOrganizationMember.getMemberOrganizationList({
        allowMethods: ['GET'], // 先抓到全部組織，再檢視權限
    })
    membershipList.value = response?.items ?? []

    // 給予預設organizerId
    const organizerId = repoUser.userInfo.preference?.event.organizerId
    if (organizerId) {
        membershipForm.value.organizationId = organizerId
    } else {
        membershipForm.value.organizationId = membershipList.value[0]?.organizationId
    }
}

async function selectTemplate(template: IEventTemplate) {
    if (!template.id) {
        return
    }
    isLoading.value = true
    const result = await repoEventTemplate.getEventTemplate(template.id)
    if (result) {
        eventTemplate.value = result
    }
    isLoading.value = false
}

async function selectDefaultTemplate() {
    const defaultTemplate = await repoEventTemplate.getEventTemplateDefault()
    const newTemplate: IEventTemplate = {
        id: '',
        designs: defaultTemplate.designs,
    }
    const result = await repoEventTemplate.postEventTemplate(newTemplate)
    eventTemplate.value = result
}

async function getOrganizerTemplateList() {
    const selectedOrganizer = membershipList.value.find(membership => {
        return membership.organizationId === membershipForm.value.organizationId
    })
    // console.log('??', selectedOrganizer)
    if (!selectedOrganizer) {
        return
    }
    selectedMemberCanPost.value = selectedOrganizer.allowMethods?.includes('POST') ?? false
    if (!selectedMemberCanPost.value) {
        return
    }
    selectedOrganizerLogo.value = selectedOrganizer.organizationLogo ?? ""

    isLoading.value = true
    const result: IEventTemplate[] = await repoEventTemplate.getEventTemplateList({
        organizerId: membershipForm.value.organizationId
    })
    templateList.value = result
    // if (!templateList.value.length) {
    //     await selectDefaultTemplate()
    // }
    // if (templateList.value.length === 1) {
    //     const templateId: string = String(templateList.value[0]?.id)
    //     const template = await repoEventTemplate.getEventTemplate(templateId)
    //     if (template) {
    //         selectTemplate(template)
    //     }
    // }
    repoUser.patchUserPreference('event', {
        organizerId: membershipForm.value.organizationId,
    })
    isLoading.value = false
}
</script>