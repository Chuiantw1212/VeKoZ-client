<template>
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
</template>
<script setup lang="ts">
import type { IEventTemplate, } from '~/types/eventTemplate';
import defaultTemplateDesigns from '~/assets/defaultTemplateDesigns.json'

const emit = defineEmits(['update:modelValue'])
const repoEventTemplate = useRepoEventTemplate()
const isLoading = ref<boolean>(false)
const eventTemplate = defineModel<IEventTemplate>('modelValue', {
    type: Object,
    default: {
        id: '',
        designs: []
    }
})
const templateList = ref<IEventTemplate[]>([])

// Hooks
onMounted(() => {
    getEventTemplateList()
})

// Methods
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
    const newTemplate: IEventTemplate = {
        id: '',
        designs: defaultTemplateDesigns,
    }
    const result = await repoEventTemplate.postEventTemplate(newTemplate)
    eventTemplate.value = result
}

async function getEventTemplateList() {
    isLoading.value = true
    const result: IEventTemplate[] = await repoEventTemplate.getEventTemplateList()
    templateList.value = result
    if (!templateList.value.length) {
        await selectDefaultTemplate()
    }
    if (templateList.value.length === 1) {
        const templateId: string = String(templateList.value[0]?.id)
        const template = await repoEventTemplate.getEventTemplate(templateId)
        if (template) {
            selectTemplate(template)
        }
    }
    isLoading.value = false
}
</script>