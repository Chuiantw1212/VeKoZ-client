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
        <el-table-column label="選擇">
            <template #default="{ row }">
                <template v-if="checkOrganizationOnUse(row)">
                    <el-button :disabled="true">
                        使用中
                    </el-button>
                </template>
                <template v-else-if="['default', 'blank'].includes(row.id)">
                    <el-button v-if="maximumReached" :disabled="true" @click="selectMembership(row)">
                        達上限=2
                    </el-button>
                    <el-button v-else :icon="FolderAdd" @click="selectMembership(row)">
                        新組織
                    </el-button>
                </template>
                <template v-else>
                    <el-button :icon="Folder" @click="selectMembership(row)">
                        可開啟
                    </el-button>
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
            <template #default="{ row }">
                <template v-if="!['default', 'blank'].includes(row.id)">
                    <el-button v-if="!row.isFounder" :disabled="row.isFounder" @click="deleteMembership(row)">
                        <el-icon class="rotate--90">
                            <Upload />
                        </el-icon>
                        退出組織
                    </el-button>
                    <el-button v-else :icon="Delete" @click="">
                        刪除組織
                    </el-button>
                </template>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="tablePagination.currentPage" v-model:page-size="tablePagination.pageSize"
        @change="getOrganizationMemberships()" layout="prev, pager, next" :total="tableTotal" />
</template>
<script setup lang="ts">
import { Folder, FolderAdd, Upload, Delete } from '@element-plus/icons-vue';
import type { IOrganization } from '~/types/organization';
import type { IOrganizationMember } from '~/types/organization';
import type { IPagination } from '~/types/ui';
const emit = defineEmits(['update:modelValue', 'create'])
const maximumReached = ref<boolean>(false)
const repoOrganization = useRepoOrganization()
const repoUser = useRepoUser()
const repoOrganizationMember = useRepoOrganizationMember()

const membershipList = ref<IOrganization[]>([])
const tableTotal = ref<number>(0)

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
const tablePagination = ref<IPagination>({
    pageSize: 5,
    currentPage: 1,
})


// Hooks
onMounted(() => {
    getOrganizationMemberships()
})

// Methods
function checkOrganizationOnUse(row: IOrganizationMember) {
    return currentMembership.value.organizationId && row.organizationId === currentMembership.value.organizationId
}

async function getOrganizationMemberships() {
    isLoading.value = true
    const response = await repoOrganizationMember.getMemberOrganizatoinList({
        pageSize: 5,
        currentPage: 1,
    })
    membershipList.value = [
        {
            id: 'blank',
            organizationName: `${repoUser.userInfo.name}的新組織`,
        },
        ...response.items,
    ]
    tableTotal.value = response.total
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
    isLoading.value = true
    await repoOrganizationMember.deleteOrganizationMember(member)
    getOrganizationMemberships()
    isLoading.value = false
}
</script>
<style lang="scss" scoped>
.rotate--90 {
    transform: rotate(90deg);
}

.btn__icon {
    width: 1em;
    height: 1em;
}
</style>