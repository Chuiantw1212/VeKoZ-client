<template>
    <el-table v-loading="isLoading" :data="templateList" style="width: 100%">
        <el-table-column prop="organizationLogo">
            <template #default="{ row }">
                <template v-if="row.organizationLogo">
                    <el-avatar :src="row.organizationLogo"></el-avatar>
                </template>
                <template v-else>
                    -
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="模板來源"></el-table-column>
        <el-table-column prop="name" label="模板名稱" />
        <el-table-column prop="" label="選擇">
            <template #default="{ row }">
                <template v-if="row.id === eventTemplate.id">
                    <el-button :icon="EditPen" size="small" :disabled="true">
                        編輯中
                    </el-button>
                </template>
                <template v-else-if="['default', 'blank'].includes(row.id)">
                    <el-button :icon="FolderAdd" size="small" @click="selectTemplate(row)">
                        建新板
                    </el-button>
                </template>
                <template v-else>
                    <el-button :icon="FolderOpened" size="small" @click="selectTemplate(row)">
                        可開啟
                    </el-button>
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="" label="刪除">
            <template #default="{ row }">
                <el-button v-if="!['default', 'blank'].includes(row.id)" size="small" :icon="Delete"
                    :disabled="row.id === eventTemplate.id" @click="deleteTemplate(row)">
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
import { FolderAdd, EditPen, FolderOpened } from '@element-plus/icons-vue';
import type { IEventSingle } from '~/types/event';
import {
    Delete,
} from '@element-plus/icons-vue'
import type { IEventTemplate } from '~/types/eventTemplate';
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
    switch (template.id) {
        case 'default': {
            eventTemplate.value.id = ''
            eventTemplate.value.name = ''
            emit('update:modelValue', eventTemplate.value)
            break;
        }
        case 'blank': {
            eventTemplate.value.id = 'blank'
            eventTemplate.value.name = ''
            eventTemplate.value.designs = []
            emit('update:modelValue', eventTemplate.value)
            break;
        }
        default: {
            isLoading.value = true
            const result = await repoEventTemplate.getEventTemplate(template.id)
            if (result) {
                eventTemplate.value = result
            }
            isLoading.value = false
            break;
        }
    }
}

async function deleteTemplate(template: IEventTemplate) {
    if (template.organizationId && template.id) {
        isLoading.value = true
        await repoEventTemplate.deleteEventTemplate({
            organizationId: template.organizationId,
            id: template.id
        })
        getEventTemplateList()
    }
}

async function getEventTemplateList() {
    isLoading.value = true
    const result = await repoEventTemplate.getEventTemplateList()
    templateList.value = result
    templateList.value.unshift({
        id: 'default',
        name: '預設模板',
        organizationName: '系統',
        designs: [],
    })

    if (templateList.value.length === 1) {
        // 只剩下預設可選，刪除模板Id，觸發父層的Reset
        eventTemplate.value.id = ''
        eventTemplate.value.name = ''
        emit('update:modelValue', eventTemplate.value)
    }
    isLoading.value = false
}
</script>