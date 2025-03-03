<template>
    <div>


        <el-row class="userTemplate" :gutter="20">
            <el-col :span="repoUI.isMedium ? 16 : 24">
                <el-card class="user__card vekoz-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="vekoz-card-header">
                            <!-- <div>{{ currentPublicInfo.name }}</div> -->
                            <!-- <el-form-item>
                            <el-input placeholder="請輸入組織名稱" size="large" :maxlength="30" :show-word-limit="true">
                            </el-input>
                        </el-form-item> -->
                            <div class="header__btnGroup">
                                <el-button size="small" :icon="FolderOpened">
                                    開啓組織
                                </el-button>
                                <el-button size="small" :icon="User" @click="editOrganizationMemberDialog">
                                    管理成員
                                </el-button>
                            </div>
                            <div>
                                <div class="header__ui">
                                    <NuxtLink :to="getPersonalLink()" target="_blank">
                                        <el-button v-loading="isLoading" :icon="View" size="small">
                                            瀏覽
                                        </el-button>
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </template>
                    <FormPublicInfoTemplate v-model="currentPublicInfo" :isDesigning="true"></FormPublicInfoTemplate>
                </el-card>
            </el-col>
            <el-col v-if="repoUI.isMedium" :span="8">
                <el-card class="vekoz-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="vekoz-card-header">
                            請拖曳以下元件 到 指定位置
                        </div>
                    </template>
                    尚未完成的功能，敬請期待。
                    <!-- <FormDesignDragging type="attendee" @dragstart="setTemplateItem($event)"
                    @mouseenter="setTemplateItem($event)" @mouseout="cancelDragging()"></FormDesignDragging> -->
                </el-card>
            </el-col>
        </el-row>
        <!-- 月曆 -->
        <!-- <el-row class="organizationTemplate" :gutter="20">
        
     </el-row> -->
        <!-- <div class="organization">
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
</div> -->

        <AtomVekozDialog v-loading="isDialogLoading" v-model="organizationDialog.visibility" class="event__template">
            <template #header>
                <el-text size="large">
                    組織設定
                </el-text>
            </template>
            TODO：搜尋已註冊的組織並聯動資料。
            <FormOrganization v-if="organizationDialog.visibility" v-model="organization"
                :mode="organizationDialog.mode">
            </FormOrganization>
            <template #footer>
                <el-button @click="organizationDialog.visibility = false">取消</el-button>
                <el-button type="primary" @click="hanelDialogConfirm()">
                    確認
                </el-button>
            </template>
        </AtomVekozDialog>

        <AtomVekozDialog v-model="organizationMemberDialog.visibility" :showClose="false">
            <template #header>
                <el-text size="large">
                    成員設定
                </el-text>
            </template>
            <template #headerUI>
                <el-button :icon="Close" text @click="organizationMemberDialog.visibility = false">
                </el-button>
            </template>
            <el-alert>
                連動已註冊的成員，才不會出BUG。
            </el-alert>
            <FormOrganizationMember v-if="organizationMemberDialog.visibility" v-model="currentPublicInfo.id"
                :mode="organizationMemberDialog.mode">
            </FormOrganizationMember>
        </AtomVekozDialog>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
import { ElMessageBox } from 'element-plus'
import { View, FolderOpened, User, Close } from '@element-plus/icons-vue'
import useRepoOrganization from '~/composables/useRepoOrganization'
import type { IPublicInfoCard } from '~/types/ui'
const repoUI = useRepoUI()
const isLoading = ref<boolean>(false)
const isDialogLoading = ref<boolean>(false)
const repoOrganization = useRepoOrganization()

const organizationList = ref<IOrganization[]>([])
const publicInfoList = ref<IPublicInfoCard[]>([])
const currentPublicInfo = ref<IPublicInfoCard>({})

const organizationDialog = reactive({
    visibility: false,
    mode: ''
})

const organization = ref<IOrganization>({
    name: '',
    description: '',
    logo: '',
    id: '',
})

const organizationMemberDialog = reactive({
    visibility: false,
    mode: '',
})

// Hooks
onMounted(() => {
    getOrganizationList()
})


// Methods
function getPersonalLink() {
    const openInLineExternal = `openExternalBrowser=1`
    return `${currentPublicInfo.value.seoName}?${openInLineExternal}`
}

async function getOrganizationList() {
    const response: IOrganization[] = await repoOrganization.getOrganizationList()
    response.sort((a, b) => {
        const timeA = new Date(String(a.lastmod)).getTime()
        const timeB = new Date(String(b.lastmod)).getTime()
        return timeB - timeA
    })
    organizationList.value = response
    publicInfoList.value = response.map(item => {
        return {
            id: item.id,
            banner: item.banner,
            seoName: item.seoName || item.id,
            image: item.logo,
            name: item.name,
            description: item.description,
            sameAs: item.sameAs,
        }
    })
    if (publicInfoList.value[0]) {
        currentPublicInfo.value = publicInfoList.value[0]
    }
}

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
    await repoOrganization.postOrganization(organization.value)
    getOrganizationList()
    organizationDialog.visibility = false
}

async function putOrganization() {
    await repoOrganization.putOrganization(organization.value)
    getOrganizationList()
    organizationDialog.visibility = false
}

function openNewDialog() {
    organization.value = {} as any
    organizationDialog.visibility = true
    organizationDialog.mode = 'ADD'
}

function editOrganizationDialog(item: IOrganization) {
    Object.assign(organization.value, item)
    organizationDialog.visibility = true
    organizationDialog.mode = 'EDIT'
}

function editOrganizationMemberDialog(item: IOrganization) {
    Object.assign(organization.value, item)
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
</script>
<style lang="scss" scoped>
.organization {
    .organization__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>
