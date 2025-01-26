<template>
    <div class="organization">
        <div class="organization__header">
            <h1>權限&組織管理</h1>
            <ElButton @click="dialogVisible = true">新增</ElButton>
        </div>

        <el-table :data="organizationList">
            <el-table-column prop="name" label="名稱" />
            <el-table-column prop="logo" label="Logo" />
            <el-table-column prop="description" label="描述" />
            <el-table-column fixed="right" label="功能" min-width="120">
                <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="openDialog(row)">編輯</el-button>
                    <el-button link type="danger" size="small" @click="deleteOrganization()">
                        刪除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" title="組織設定" class="event__template">
            <FormOrganization v-if="dialogVisible" v-model="organization"></FormOrganization>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="postOrganization()">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import VenoniaUploader from '~/components/atom/VenoniaUploader.vue';
import useRepoOrganization from '~/composables/useRepoOrganization'
// import { FormOrganization } from '#components';

const repoOrganization = useRepoOrganization()
const dialogVisible = ref(true)

const organization = reactive({
    name: '',
    description: '',
    logo: '',
})

const organizationList = ref([])

async function postOrganization() {
    const response = await repoOrganization.postOrganization(organization)
}

function openDialog(item: any) {
    Object.assign(organization, item)
    nextTick(() => {
        dialogVisible.value = true
    })
}

async function deleteOrganization() {

}

async function getOrganizationList() {
    const response = await repoOrganization.getOrganizationList()
    organizationList.value = response
}

onMounted(() => {
    getOrganizationList()
})
</script>
<style lang="scss" scoped>
.organization {
    .organization__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>
