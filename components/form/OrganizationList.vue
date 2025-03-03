<template>
    <el-table :data="organizationList" style="width: 100%">
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
        <el-table-column prop="name" label="公司名稱" />
        <el-table-column prop="auth" label="權限">
            TODO
        </el-table-column>
        <el-table-column prop="" label="選擇">
            <template #default="{ row }">
                <template v-if="row.id === currentOrganizaiotn.id">
                    <el-button size="small" :disabled="true">
                        編輯中
                    </el-button>
                </template>
                <template v-else-if="['default', 'blank'].includes(row.id)">
                    <el-button size="small" @click="selectOrganization(row)">
                        建新板
                    </el-button>
                </template>
                <template v-else>
                    <el-button size="small" @click="selectOrganization(row)">
                        可開啟
                    </el-button>
                </template>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization';

const emit = defineEmits(['update:modelValue', 'reset'])
const repoOrganization = useRepoOrganization()
const organizationList = ref<IOrganization[]>([])
const isLoading = ref<boolean>(false)
const currentOrganizaiotn = defineModel<IOrganization>('modelValue', {
    type: Object,
    default: {
        id: '',
        designs: [],
    }
})

// Hooks
onMounted(() => {
    getOrganizationList()
})

// Methods
async function getOrganizationList() {
    const response: IOrganization[] = await repoOrganization.getOrganizationList()
    response.sort((a, b) => {
        const timeA = new Date(String(a.lastmod)).getTime()
        const timeB = new Date(String(b.lastmod)).getTime()
        return timeB - timeA
    })
    organizationList.value = response
}
async function selectOrganization(organization: IOrganization) {
    if (!organization.id) {
        return
    }
    switch (organization.id) {
        case 'default': {
            currentOrganizaiotn.value.id = ''
            currentOrganizaiotn.value.name = ''
            emit('update:modelValue', currentOrganizaiotn.value)
            break;
        }
        case 'blank': {
            currentOrganizaiotn.value.id = 'blank'
            currentOrganizaiotn.value.name = ''
            currentOrganizaiotn.value.designs = []
            emit('update:modelValue', currentOrganizaiotn.value)
            break;
        }
        default: {
            // isLoading.value = true
            // const result = await repoEventTemplate.getEventTemplate(organization.id)
            // if (result) {
            //     currentOrganizaiotn.value = result
            // }
            // isLoading.value = false
            break;
        }
    }
}
</script>