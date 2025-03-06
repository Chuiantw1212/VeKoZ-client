<template>
    <el-table v-loading="isLoading" :data="membershipList" style="width: 100%">
        <el-table-column prop="lastmod" label="上次修改">
            <template #default="{ row }">
                <template v-if="row.lastmod">
                    {{ new Date(row.lastmod).toLocaleDateString('zh-TW') }}
                </template>
                <template v-else>
                    -
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="公司名稱" />
        <el-table-column prop="auth" label="資料權限">
            <template #default="{ row }">
                <el-checkbox-group v-model="row.allowMethods" :disabled="true">
                    <el-checkbox v-for="auth in authOptions" :disabled="auth.disabled" :key="auth.value"
                        :label="auth.label" :value="auth.value">
                        {{ auth.label }}
                    </el-checkbox>
                </el-checkbox-group>
            </template>
        </el-table-column>
        <el-table-column prop="" label="選擇">
            <template #default="{ row }">
                <template v-if="row.organizationId === currentMembership.organizationId">
                    <el-button size="small" :disabled="true">
                        使用中
                    </el-button>
                </template>
                <template v-else-if="['default', 'blank'].includes(row.id)">
                    <el-button v-if="maximumReached" :disabled="true" size="small" @click="selectMembership(row)">
                        達上限=2
                    </el-button>
                    <el-button v-else :icon="FolderAdd" size="small" @click="selectMembership(row)">
                        新組織
                    </el-button>
                </template>
                <template v-else>
                    <el-button :icon="Folder" size="small" @click="selectMembership(row)">
                        可開啟
                    </el-button>
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="" label="刪除">
            <template #default="{ row }">
                <el-button v-if="!['default', 'blank'].includes(row.id)" size="small" :icon="Delete"
                    :disabled="row.organizationId === currentMembership.organizationId" @click="deleteMembership(row)">
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
import { Folder, FolderAdd } from '@element-plus/icons-vue';
import type { IOrganization } from '~/types/organization';
import type { IOrganizationMember } from '~/types/organization';
import { Delete } from '@element-plus/icons-vue';
const emit = defineEmits(['update:modelValue', 'create'])
const maximumReached = ref<boolean>(false)
const repoOrganization = useRepoOrganization()
const repoUser = useRepoUser()
const repoOrganizationMember = useRepoOrganizationMember()

const membershipList = ref<IOrganization[]>([])
const isLoading = ref<boolean>(false)
const currentMembership = defineModel<IOrganizationMember>('modelValue', {
    type: Object,
    default: {},
})

const authOptions = [
    {
        label: '1.檢視',
        value: 'GET',
        disabled: true,
    },
    {
        label: '2.修改',
        value: 'PATCH'
    },
    {
        label: '3.新增',
        value: 'POST',
    },
    {
        label: '4.刪除',
        value: 'DELETE'
    },
]

// Hooks
onMounted(() => {
    getOrganizationMemberships()
})

// Methods
async function getOrganizationMemberships() {
    isLoading.value = true
    const response: IOrganizationMember[] = await repoOrganizationMember.getMemberOrganizatoinList({
        pageSize: 5,
        currentPage: 1,
    })
    membershipList.value = [
        {
            id: 'blank',
            organizationName: `${repoUser.userInfo.name}的新組織`,
        },
        ...response,
    ]
    isLoading.value = false
}
async function selectMembership(member: IOrganizationMember) {
    if (!member.id) {
        return
    }
    switch (member.id) {
        case 'blank': {
            emit('create')
            break;
        }
        default: {
            emit('update:modelValue', member)
            break;
        }
    }
}
async function deleteMembership(member: IOrganizationMember) {
    try {
        const result = await ElMessageBox.confirm(
            `永久刪除"${member.name}"？刪除後無法還原。`,
            {
                title: '警告',
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        if (result === 'confirm') {
            isLoading.value = true
            await repoOrganizationMember.deleteOrganizationMember(String(member.id))
            getOrganizationMemberships()
            isLoading.value = false
        }
    } catch (error: any) {
        // Do nothing
    }
}
</script>