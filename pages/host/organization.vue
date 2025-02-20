<template>
    <div class="organization">
        <div class="organization__header">
            <h1>組織管理</h1>
            <ElButton @click="openNewDialog()">新增組織</ElButton>
        </div>

        <el-table v-loading="isLoading" :data="organizationList">
            <el-table-column prop="logo" label="商標" width="80em">
                <template #default="{ row }">
                    <img width="40px" :src="row.logo">
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名稱" width="200em" />
            <el-table-column prop="description" label="描述" :width="repoUI.isXLarge ? undefined : '600em'" />
            <el-table-column prop="lastmod" label="上次更新" width="100em">
                <template #default="{ row }">
                    {{ new Date(row.lastmod).toLocaleDateString('zh-TW') }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="功能" width="200em">
                <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="editOrganizationDialog(row)">編輯組織</el-button>
                    <el-button link type="primary" size="small"
                        @click="editOrganizationMemberDialog(row)">編輯成員</el-button>
                    <el-button link type="danger" size="small" @click="deleteOrganization(row)">
                        刪除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <AtomVenoniaDialog v-loading="isDialogLoading" v-model="organizationDialog.visibility" class="event__template">
            <template #header>
                <el-text size="large">
                    組織設定
                </el-text>
            </template>
            <FormOrganization v-model="organization"
                :mode="organizationDialog.mode">
            </FormOrganization>
            <template #footer>
                <el-button @click="organizationDialog.visibility = false">取消</el-button>
                <el-button type="primary" @click="hanelDialogConfirm()">
                    確認
                </el-button>
            </template>
        </AtomVenoniaDialog>

        <AtomVenoniaDialog v-model="organizationMemberDialog.visibility">
            <template #header>
                <el-text size="large">
                    成員設定
                </el-text>
            </template>
            <template #headerUI>
                <el-button :icon="Close" text>
                </el-button>
            </template>
            <FormOrganizationMember v-if="organizationMemberDialog.visibility" v-model="organization"
                :mode="organizationMemberDialog.mode">
            </FormOrganizationMember>
            <!-- <template #footer>
                <el-button @click="organizationMemberDialog.visibility = false">取消</el-button>
                <el-button type="primary" @click="hanelDialogConfirm()">
                    確認
                </el-button>
            </template> -->
        </AtomVenoniaDialog>
        <!-- <el-dialog v-model="organizationMemberDialog.visibility" title="成員設定" class="event__template">
        </el-dialog> -->
    </div>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
import { Delete, Close, } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus'
import useRepoOrganization from '~/composables/useRepoOrganization'
const repoUI = useRepoUI()

const isLoading = ref<boolean>(false)
const isDialogLoading = ref<boolean>(false)
const repoOrganization = useRepoOrganization()

const organizationList = ref<IOrganization[]>([])

const organizationDialog = reactive({
    visibility: false,
    mode: ''
})

const organization = reactive<IOrganization>({
    name: '',
    description: '',
    logo: '',
    id: '',
})

const organizationMemberDialog = reactive({
    visibility: false,
    mode: '',
})


// Methods
async function hanelDialogConfirm() {
    isDialogLoading.value = true
    if (organizationDialog.mode === 'ADD') {
        await postOrganization()
    }
    if (organizationDialog.mode === 'EDIT') {
        await putOrganization()
    }
    isDialogLoading.value = false
}

async function postOrganization() {
    await repoOrganization.postOrganization(organization)
    getOrganizationList()
    organizationDialog.visibility = false
}

async function putOrganization() {
    await repoOrganization.putOrganization(organization)
    getOrganizationList()
    organizationDialog.visibility = false
}

function openNewDialog() {
    organizationDialog.visibility = true
    organizationDialog.mode = 'ADD'
}

function editOrganizationDialog(item: IOrganization) {
    Object.assign(organization, item)
    organizationDialog.visibility = true
    organizationDialog.mode = 'EDIT'
}

function editOrganizationMemberDialog(item: IOrganization) {
    Object.assign(organization, item)
    organizationMemberDialog.visibility = true
}

async function deleteOrganization(item: IOrganization) {
    try {
        const result = await ElMessageBox.confirm(
            `永久刪除"${item.name}"？刪除後無法還原。`,
            {
                title: '警告',
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        if (result === 'confirm') {
            isLoading.value = true
            await repoOrganization.deleteOrganization(item.id)
            await getOrganizationList()
            isLoading.value = false
        }
    } catch (error: any) {
        // Do nothing
    }
}

async function getOrganizationList() {
    const response: IOrganization[] = await repoOrganization.getOrganizationList()
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
