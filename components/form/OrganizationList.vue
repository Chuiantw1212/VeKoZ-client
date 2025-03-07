<template>
    <el-table v-loading="isLoading" :data="membershipList" :style="{ 'width': '100%' }">
        <el-table-column prop="organizationLogo" label="">
            <template #default="{ row }">
                <el-avatar v-if="row.organizationLogo" :src="row.organizationLogo"></el-avatar>
                <template v-else>
                    -
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="組織名稱" />
        <el-table-column prop="auth" label="我的權限">
            <template #default="{ row }">
                <el-checkbox-group v-model="row.allowMethods" :disabled="true">
                    <el-checkbox v-for="auth in authOptions" :disabled="auth.disabled" :key="auth.value"
                        :label="auth.label" :value="auth.value">
                        {{ auth.label }}
                    </el-checkbox>
                </el-checkbox-group>
            </template>
        </el-table-column>
        <el-table-column label="開啟">
            <template #default="{ row }">
                <template v-if="checkOrganizationOnUse(row)">
                    <el-button size="small" :disabled="true">
                        使用中
                    </el-button>
                </template>
                <template v-else-if="['default', 'blank'].includes(row.id)">
                    <el-button v-if="maximumReached" size="small" :disabled="true" @click="selectMembership(row)">
                        達上限=2
                    </el-button>
                    <el-button v-else :icon="FolderAdd" size="small" @click="selectMembership(row)">
                        新組織
                    </el-button>
                </template>
                <template v-else>
                    <el-button :icon="Folder" size="small" @click="selectMembership(row)">
                        開啟
                    </el-button>
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="" label="刪除/退出">
            <template #default="{ row }">
                <template v-if="!['default', 'blank'].includes(row.id)">
                    <!-- 成員只可以退出 -->
                    <el-button v-if="!row.isFounder" size="small" :disabled="row.isFounder"
                        @click="deleteMembership(row)">
                        <el-icon class="rotate--90">
                            <Upload />
                        </el-icon>
                        退出組織
                    </el-button>
                    <!-- 創辦者只可以刪除或是轉讓(轉讓未開發) -->
                    <template v-if="row.isFounder">
                        <template v-if="isFinalFounder">
                            此為最後的用戶所有組織，
                            不可刪除。
                        </template>
                        <el-button v-else :icon="Delete" size="small" :disabled="checkOrganizationOnUse(row)"
                            @click="deleteOrganization(row)">
                            刪除組織
                        </el-button>
                    </template>
                </template>
            </template>
        </el-table-column>
    </el-table>
    <!-- <el-pagination v-model:current-page="tablePagination.currentPage" v-model:page-size="tablePagination.pageSize"
        @change="getOrganizationMemberships()" layout="prev, pager, next" :total="tableTotal" /> -->
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
const isFinalFounder = ref<boolean>(false)
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

// Hooks
onMounted(() => {
    getOrganizationMemberships()
})

// Methods
async function deleteOrganization(member: IOrganizationMember) {
    isLoading.value = true
    await repoOrganization.deleteOrganization(String(member.organizationId))
    getOrganizationMemberships()
    isLoading.value = true
}

function checkOrganizationOnUse(row: IOrganizationMember): boolean {
    const { organizationId } = currentMembership.value
    return !!(organizationId && row.organizationId === organizationId)
}

async function getOrganizationMemberships() {
    isLoading.value = true
    const response = await repoOrganizationMember.getMemberOrganizatoinList({
        pageSize: 50,
        currentPage: 1,
    })
    const blankMembership: IOrganizationMember = {
        id: 'blank',
        organizationName: `${repoUser.userInfo.name}的新組織`,
        allowMethods: ['GET', 'PATCH', 'POST', 'DELETE'],
    }
    membershipList.value = [
        blankMembership,
        ...response.items,
    ]
    const founded = response.items.filter((member: IOrganizationMember) => {
        return member.isFounder
    })
    isFinalFounder.value = founded.length <= 1 // 最後一個組織不可刪除
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