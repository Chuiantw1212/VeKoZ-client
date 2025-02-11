<template>
    <el-table :data="tableList" style="width: 100%">
        <el-table-column prop="name" label="名稱" />
        <el-table-column prop="view" label="檢視" >
            <template #default="{ row }">
               <el-checkbox></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="edit" label="修改" >
            <template #default="{ row }">
                <el-checkbox></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="delete" label="刪除" >
            <template #default="{ row }">
                <el-checkbox></el-checkbox>
            </template>
        </el-table-column>
        <el-table-column prop="email" label="電子信箱"/>
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
    Delete,
} from '@element-plus/icons-vue'
const repoOrganization = useRepoOrganization()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => { }
    }
})

const tableList = ref([])

async function deleteOrganizationMember(item: IOrganizationMember) {

}

async function getOrganizationMemberList() {
    const result = await repoOrganization.getOrganizationMemberList(props.modelValue.id)
    tableList.value = result
}

onMounted(() => {
    getOrganizationMemberList()
})
</script>