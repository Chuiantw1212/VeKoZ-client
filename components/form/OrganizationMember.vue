<template>
    <!-- <el-form label="成員管理"> -->
    <el-table :data="tableList" style="width: 100%">
        <el-table-column prop="name" label="名稱" />
        <el-table-column prop="email" label="電子信箱" />
        <el-table-column prop="description" label="權限" />
        <el-table-column fixed="right" label="功能">
            <template #default="{ row }">
                <el-button link type="danger" size="small" :icon="Delete" @click="deleteOrganizationMember(row)">
                    刪除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- </el-form> -->
</template>
<script setup lang="ts">
import type { IOrganizationMember } from '~/types/organization'
import {
    Delete,
} from '@element-plus/icons-vue'
const repoOrganization = useRepoOrganization()

const tableList = ref([])

async function deleteOrganizationMember(item: IOrganizationMember) {

}

async function getOrganizationMemberList() {
    const result = await repoOrganization.getOrganizationMemberList()
    tableList.value = result
}

onMounted(() => {
    getOrganizationMemberList()
})
</script>