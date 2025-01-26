<template>
    <div class="organization">
        <div class="organization__header">
            <h1>權限&組織管理</h1>
            <ElButton @click="openNewDialog()">新增組織</ElButton>
        </div>

        <el-table :data="organizationList">
            <el-table-column prop="logo" label="Logo">
                <template #default="{ row }">
                    <img width="40px" :src="row.logo">
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名稱" />
            <el-table-column prop="description" label="描述" />
            <el-table-column fixed="right" label="功能">
                <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="openEditDialog(row)">編輯組織</el-button>
                    <el-button link type="primary" size="small" @click="openEditDialog(row)">編輯成員</el-button>
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
                <el-button type="primary" @click="hanelDialogConfirm()">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import useRepoOrganization from '~/composables/useRepoOrganization'
const repoOrganization = useRepoOrganization()

const dialogVisible = ref(false)
const dialogMode = ref()

const organization = reactive({
    name: '',
    description: '',
    logo: '',
})

const organizationList = ref([])

// Methods
async function hanelDialogConfirm() {
    if (dialogMode.value === 'ADD') {
        postOrganization()
    }
    if (dialogMode.value === 'EDIT') {
        putOrganization()
    }
}

async function postOrganization() {
    await repoOrganization.postOrganization(organization)
    getOrganizationList()
    dialogVisible.value = false
}

async function putOrganization() {
    await repoOrganization.putOrganization(organization)
    getOrganizationList()
    dialogVisible.value = false
}

function openNewDialog() {
    dialogVisible.value = true
    dialogMode.value = 'ADD'
}

function openEditDialog(item: any) {
    Object.assign(organization, item)
    dialogVisible.value = true
    dialogMode.value = 'EDIT'
}

async function deleteOrganization() {
    const result = await ElMessageBox.confirm(
        '是否永久刪除資料？刪除後無法還原。',
        {
            title: '警告',
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    if (result === 'confirm') {
        await repoOrganization.deleteOrganization()
        getOrganizationList()
    }
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
