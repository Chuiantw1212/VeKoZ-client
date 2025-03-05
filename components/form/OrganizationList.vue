<template>
    <el-table v-loading="isLoading" :data="organizationList" style="width: 100%">
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
        <el-table-column prop="auth" label="資料權限">
            TODO
        </el-table-column>
        <el-table-column prop="" label="選擇">
            <template #default="{ row }">
                <template v-if="row.id === currentOrganizaiotnId">
                    <el-button size="small" :disabled="true">
                        使用中
                    </el-button>
                </template>
                <template v-else-if="['default', 'blank'].includes(row.id)">
                    <el-button v-if="maximumReached" :disabled="true" size="small" @click="selectOrganization(row)">
                        達上限=2
                    </el-button>
                    <el-button v-else size="small" @click="selectOrganization(row)">
                        新組織
                    </el-button>
                </template>
                <template v-else>
                    <el-button size="small" @click="selectOrganization(row)">
                        可開啟
                    </el-button>
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="" label="刪除">
            <template #default="{ row }">
                <el-button v-if="!['default', 'blank'].includes(row.id)" size="small" :icon="Delete"
                    :disabled="row.id === currentOrganizaiotnId" @click="deleteOrganization(row)">
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization';
import { Delete } from '@element-plus/icons-vue';
const emit = defineEmits(['update:modelValue', 'create'])
const maximumReached = ref<boolean>(false)
const repoOrganization = useRepoOrganization()
const repoUser = useRepoUser()
const organizationList = ref<IOrganization[]>([])
const isLoading = ref<boolean>(false)
const currentOrganizaiotnId = defineModel<string>('modelValue', {
    type: String,
    default: '',
})

// Hooks
onMounted(() => {
    // getOrganizationMemberList()
})

// Methods
// async function getOrganizationList() {
//     isLoading.value = true
//     const response: IOrganization[] = await repoOrganization.getOrganizationList()
//     response.sort((a, b) => {
//         const timeA = new Date(String(a.lastmod)).getTime()
//         const timeB = new Date(String(b.lastmod)).getTime()
//         return timeB - timeA
//     })
//     if (response.length >= 2) {
//         maximumReached.value = true
//     }
//     organizationList.value = [
//         {
//             id: 'blank',
//             name: `${repoUser.userInfo.name}的新組織`,
//         },
//         ...response,
//     ]
//     isLoading.value = false
// }
async function selectOrganization(organization: IOrganization) {
    if (!organization.id) {
        return
    }
    switch (organization.id) {
        case 'blank': {
            emit('create')
            break;
        }
        default: {
            emit('update:modelValue', organization.id)
            break;
        }
    }
}
async function deleteOrganization(organization: IOrganization) {
    try {
        const result = await ElMessageBox.confirm(
            `永久刪除"${organization.name}"？刪除後無法還原。`,
            {
                title: '警告',
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        if (result === 'confirm') {
            isLoading.value = true
            await repoOrganization.deleteOrganization(String(organization.id))
            getOrganizationList()
            isLoading.value = false
        }
    } catch (error: any) {
        // Do nothing
    }
}
</script>