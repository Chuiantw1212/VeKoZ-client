<template>
    <div>
        <el-table :data="templateList" style="width: 100%">
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
            <el-table-column prop="name" label="標題" />
            <el-table-column prop="" label="選擇">
                <template #default="{ row }">
                    <el-button size="small" @click="selectTemplate(row)">
                        套用
                    </el-button>
                    <el-button v-if="row.id !== 'default'" size="small" :icon="Delete" @click="deleteTemplate(row)">
                    </el-button>
                </template>
                <!-- <template #default="{ row }">
                </template> -->
            </el-table-column>
            <!-- <el-table-column prop="" label="刪除">
            </el-table-column> -->
        </el-table>
    </div>
</template>
<script setup lang="ts">
import type { IEvent } from '~/types/event';
import type { IEventTemplate, } from '~/types/eventTemplate';
import {
    Delete,
} from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue'])
const repoEventTemplate = useRepoEventTemplate()
const eventTemplate = defineModel<IEventTemplate>('modelValue', {
    default: {
        id: '',
        designs: []
    }
})

const templateList = ref<IEvent[]>([])

// Hooks
onMounted(() => {
    getEventTemplateList()
})

// Methods
function selectTemplate(template: IEventTemplate) {
    if (template.id === 'default') {
        // 刪除模板Id，觸發父層的Reset
        eventTemplate.value.id = ''
        // emit('update:modelValue', eventTemplate.value)
    }
    emit('update:modelValue', eventTemplate.value)
}

async function deleteTemplate(template: IEventTemplate) {
    if (!template.id) {
        return
    }
    await repoEventTemplate.deleteEventTemplate(template.id)
    getEventTemplateList()
}

async function getEventTemplateList() {
    const result = await repoEventTemplate.getEventTemplateList()
    templateList.value = [
        {
            id: 'default',
            name: '系統預設模板',
        },
        ...result
    ]
    if (templateList.value.length === 1) {
        // 只剩下預設可選，刪除模板Id，觸發父層的Reset
        eventTemplate.value.id = ''
        emit('update:modelValue', eventTemplate.value)
    }
}
</script>