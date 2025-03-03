<template>
    <el-form>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="搜尋用戶">
                    <el-input placeholder="請輸入用戶Email">
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
                    <el-button :icon="Plus">
                        邀請
                    </el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-table :data="tableList" style="width: 100%">
        <el-table-column prop="name" label="名稱" />
        <el-table-column prop="view" label="檢視">
            <template #default="{ row }">
                <el-checkbox></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="edit" label="修改">
            <template #default="{ row }">
                <el-checkbox></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="delete" label="刪除">
            <template #default="{ row }">
                <el-checkbox></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="email" label="電子信箱" />
        <el-table-column fixed="right" label="功能">
            <template #default="{ row }">
                <el-button link type="danger" size="small" :icon="Delete" @click="deleteOrganizationMember(row)">
                    刪除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
import type { IOrganizationMember } from '~/types/organization'
import {
    Search,
    Delete,
    Plus,
} from '@element-plus/icons-vue'
const repoOrganizationMember = useRepoOrganizationMember()

const organizationId = defineModel<string>('modelValue', {
    default: '',
})

// const props = defineProps({
//     modelValue: {
//         type: Object,
//         default: () => { }
//     }
// })

const tableList = ref([])

onMounted(() => {
    getOrganizationMemberList()
})

async function deleteOrganizationMember(item: IOrganizationMember) {

}

async function getOrganizationMemberList() {
    if (organizationId.value) {
        const result = await repoOrganizationMember.getOrganizationMemberList(organizationId.value)
        tableList.value = result
    }
}

</script>