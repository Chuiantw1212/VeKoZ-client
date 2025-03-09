<template>
    <div class="organizationMember">
        <!-- {{currentMember}} -->
        <el-alert type="info" show-icon :closable="false">
            <ol>
                <li>檢視：成員會看見創辦人建立的模板、組織、票券等，為標準權限。</li>
                <li>部分新增操作，系統會判定為修改。例："新增"社群連結。</li>
            </ol>
        </el-alert>
        <el-form class="mt-20" ref="formRef" :rules="formRules" :model="searchForm">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="新增成員" prop="email">
                        <el-input v-model="searchForm.email" placeholder="請輸入邀請對象Email">
                            <template #prefix>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item>
                        <el-button v-loading="isLoading" :icon="Message" @click="postOrganizationMember">
                            送出邀請信
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="memberList" style="width: 100%">
            <el-table-column prop="email" label="電子信箱" />
            <el-table-column prop="name" label="成員名稱" />
            <el-table-column prop="allowMethods" label="通用授權">
                <template #default="{ row }">
                    <el-checkbox-group v-model="row.allowMethods"
                        :disabled="row.isFounder || checkIsSelf(row) || !canEditMember" @change="setMember(row)">
                        <el-checkbox v-for="auth in authOptions" :disabled="auth.disabled" :key="auth.value"
                            :label="auth.label" :value="auth.value">
                            {{ auth.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>
            <el-table-column prop="allowEntities" label="特例授權">
                <template #default="{ row }">
                    <el-checkbox-group v-model="row.allowEntities"
                        :disabled="row.isFounder || checkIsSelf(row) || !canEditMember" @change="setMember(row)">
                        <el-checkbox value="organizationMember">成員異動</el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="{ row }">
                    <template v-if="!row.isFounder">
                        <el-button v-if="!canEditMember" :icon="WarnTriangleFilled" size="small" :disabled="true">
                            無權限
                        </el-button>
                        <template v-else>
                            <template v-if="checkIsSelf(row)">
                                不可異動自身權限
                            </template>
                            <el-button v-if="!checkIsSelf(row)" v-loading="isLoading" size="small" :icon="Delete"
                                @click="deleteOrganizationMember(row)">
                                刪除成員
                            </el-button>
                        </template>
                    </template>
                    <template v-if="row.isFounder">
                        <el-button :icon="WarnTriangleFilled" size="small" :disabled="true">
                            創辦人
                        </el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-row justify="space-between">
            <el-col>
                <el-pagination v-model:current-page="tablePagination.currentPage"
                    v-model:page-size="tablePagination.pageSize" @change="getOrganizationMemberList()"
                    layout="prev, pager, next" :total="tableTotal" />
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import type { IOrganizationMember } from '~/types/organization'
import {
    Search,
    Delete,
    Message,
    WarnTriangleFilled
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { IPagination } from '~/types/ui'

const repoOrganizationMember = useRepoOrganizationMember()
const repoUI = useRepoUI()
const repoUser = useRepoUser()

const isLoading = ref<boolean>(false)
const currentMember = defineModel<IOrganizationMember>('modelValue', {
    default: '',
})

const test = ref()

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

const formRef = ref<FormInstance>()

const searchForm = ref({
    email: '',
})

const formRules = {
    email: [
        {
            required: true,
            message: 'Email為必填',
        }
    ]
}

const memberList = ref<IOrganizationMember[]>([])
const tableTotal = ref<number>(0)
const tablePagination = ref<IPagination>({
    pageSize: 5,
    currentPage: 1,
})
const canEditMember = computed(() => {
    return currentMember.value.allowEntities?.includes('organizationMember')
})

onMounted(() => {
    getOrganizationMemberList()
})

// Methods
function checkIsSelf(member: IOrganizationMember) {
    const isSelfMember = repoUser.userInfo.email === member.email
    return isSelfMember
}

async function setMember(item: IOrganizationMember) {
    repoUI.debounce('setMember', () => {
        repoOrganizationMember.patchMember(item)
    })
}

async function deleteOrganizationMember(item: IOrganizationMember) {
    isLoading.value = true
    await repoOrganizationMember.deleteOrganizationMember(item)
    getOrganizationMemberList()
    isLoading.value = false
}

async function getOrganizationMemberList() {
    if (currentMember.value.organizationId) {
        isLoading.value = true
        const organizationId = currentMember.value.organizationId
        const result = await repoOrganizationMember.getOrganizationMemberList(organizationId, tablePagination.value)
        memberList.value = result.items
        tableTotal.value = result.total
        isLoading.value = false
    }
}

async function postOrganizationMember() {
    const isValid = formRef.value?.validate()
    if (!isValid) {
        return
    }
    isLoading.value = true
    const newMember = await repoOrganizationMember.postNewMember({
        organizationId: currentMember.value.organizationId,
        email: searchForm.value.email,
    })
    memberList.value.unshift(newMember)
    formRef.value?.resetFields()
    isLoading.value = false
}

</script>
<style lang="scss" scoped>
.mt-20 {
    margin-top: 20px;
}
</style>