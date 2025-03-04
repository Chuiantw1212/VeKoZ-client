<template>
    <el-form ref="formRef" :rules="formRules" :model="searchForm">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="搜尋用戶" prop="email">
                    <el-input v-model="searchForm.email" placeholder="請輸入用戶Email">
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
                    <el-button :icon="Message" @click="postOrganizationMember">
                        送出邀請信
                    </el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-table :data="tableList" style="width: 100%">
        <el-table-column prop="name" label="名稱" />
        <el-table-column prop="auths" label="權限">
            <template #default="{ row }">
                <!-- <el-checkbox></el-checkbox> 檢視 -->
                <el-checkbox-group v-model="row.auths">
                    <el-checkbox v-for="auth in authOptions" :disabled="auth.disabled" :key="auth.value"
                        :label="auth.label" :value="auth.value">
                        {{ auth.label }}
                    </el-checkbox>
                </el-checkbox-group>
            </template>
        </el-table-column>
        <el-table-column prop="email" label="電子信箱" />
        <el-table-column fixed="right" label="操作">
            <template #default="{ row }">
                <el-button link type="danger" size="small" :icon="Delete" @click="deleteOrganizationMember(row)">
                    刪除此用戶
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-alert class="mt-20" type="info" show-icon :closable="false">
        部分看起來像是新增的操作，系統會判定為修改。例："新增"社群連結。
    </el-alert>
</template>
<script setup lang="ts">
import type { IOrganizationMember } from '~/types/organization'
import {
    Search,
    Delete,
    Message,
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
const repoOrganizationMember = useRepoOrganizationMember()

const organizationId = defineModel<string>('modelValue', {
    default: '',
})

const memberAuths = ref([])

const authOptions = [
    {
        label: '1.檢視',
        value: 'get',
        disabled: true,
    },
    {
        label: '2.修改',
        value: 'patch'
    },
    {
        label: '3.新增',
        value: 'post',
    },
    {
        label: '4.刪除',
        value: 'delete'
    },
]

const formRef = ref<FormInstance>()

const searchForm = ref({
    email: '',
})

const formRules = {
    email: {
        required: true,
        message: 'Email為必填',
    }
}

const tableList = ref([])

onMounted(() => {
    getOrganizationMemberList()
})

// Methods
async function deleteOrganizationMember(item: IOrganizationMember) {

}

async function getOrganizationMemberList() {
    if (organizationId.value) {
        const result = await repoOrganizationMember.getOrganizationMemberList(organizationId.value)
        tableList.value = result
    }
}

async function postOrganizationMember() {
    const isValid = formRef.value?.validate()
    if (!isValid) {
        return
    }
    await repoOrganizationMember.postNewMember({
        organizationId: organizationId.value,
        email: searchForm.value.email,
    })
    formRef.value?.resetFields()
}

</script>
<style lang="scss" scoped>
.mt-20 {
    margin-top: 20px;
}
</style>