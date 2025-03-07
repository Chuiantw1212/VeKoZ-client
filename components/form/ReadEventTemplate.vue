<template>
    <div>
        <!-- <el-form :model="form">
            <el-form-item label="選擇組織">
                <el-select v-model="form.organizationId" placeholder="請選擇">
                    <el-option v-for="(item, index) in membershipList" :key="index" :label="`${item.organizationName}`"
                        :value="String(item.organizationId)" />
                </el-select>
            </el-form-item>
        </el-form>
        <el-divider>組織所屬模板</el-divider> -->
        <el-table v-if="templateList.length" :data="templateList" style="width: 100%">
            <el-table-column prop="lastmod" label="上次修改">
                <template #default="{ row }">
                    <template v-if="row.lastmod">
                        {{ new Date(row.lastmod).toLocaleString('zh-TW') }}
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
    </div>
</template>
<script setup lang="ts">
// import type { IEventSingle, } from '~/types/eventTemplate';
import defaultTemplateDesigns from '~/assets/defaultTemplateDesigns.json'
import type { IEventSingle } from '~/types/event';
import type { ITemplateDesign } from '~/types/eventTemplate';
import type { IOrganization, IOrganizationMember } from '~/types/organization';

const emit = defineEmits(['update:modelValue'])
const repoEventTemplate = useRepoEventTemplate()
const repoOrganizationMember = useRepoOrganizationMember()
const isLoading = ref<boolean>(false)

const form = ref({
    organizationId: '',
})

const eventTemplate = defineModel<IEventSingle>('modelValue', {
    type: Object,
    default: {
        id: '',
        designs: []
    }
})

const membershipList = ref<IOrganizationMember[]>([])
const templateList = ref<IEventSingle[]>([])

// Hooks
onMounted(() => {
    getEventTemplateList()
    // getOrganizationMemberships()
})

// Methods
// async function getOrganizationMemberships() {
//     const response = await repoOrganizationMember.getMemberOrganizatoinList({
//         pageSize: 50,
//         currentPage: 1,
//     })
//     membershipList.value = response.items
// }

async function selectTemplate(template: IEventSingle) {
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
    const newTemplate: IEventSingle = {
        id: '',
        designs: defaultTemplateDesigns as ITemplateDesign[],
    }
    const result = await repoEventTemplate.postEventTemplate(newTemplate)
    eventTemplate.value = result
}

async function getEventTemplateList() {
    isLoading.value = true
    const result: IEventSingle[] = await repoEventTemplate.getEventTemplateList()
    templateList.value = result
    if (!templateList.value.length) {
        await selectDefaultTemplate()
    }
    // if (templateList.value.length === 1) {
    //     const templateId: string = String(templateList.value[0]?.id)
    //     const template = await repoEventTemplate.getEventTemplate(templateId)
    //     if (template) {
    //         selectTemplate(template)
    //     }
    // }
    isLoading.value = false
}
</script>