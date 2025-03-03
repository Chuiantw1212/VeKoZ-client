<template>
    <div>
        <el-row class="userTemplate" :gutter="20">
            <el-col :span="repoUI.isMedium ? 16 : 24">
                <el-card class="user__card vekoz-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="vekoz-card-header">
                            <div class="header__btnGroup">
                                <el-button v-loading="isLoading" size="small" :icon="FolderOpened"
                                    @click="organizationListDialog.visibility = true">
                                    開啓組織
                                </el-button>
                                <el-button v-loading="isLoading" size="small" :icon="Postcard"
                                    @click="organizationDialogVisible = true">
                                    變更資料
                                </el-button>
                                <!-- <el-button v-loading="isLoading" size="small" :icon="User"
                                    @click="editOrganizationMemberDialog">
                                    管理成員
                                </el-button> -->
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
                    <FormPublicInfoTemplate v-model="currentPublicInfo" :disabled="true" :isDesigning="true"
                        type="organization" :onchange="patchOrganization">
                    </FormPublicInfoTemplate>
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

        <AtomVekozDialog v-model="organizationListDialog.visibility">
            <template #header>
                <el-text size="large">
                    開啟組織
                </el-text>
            </template>
            <FormOrganizationList :modelValue="currentPublicInfo.id" @update:modelValue="openOrganization($event)"
                @create="createOrganization()">
            </FormOrganizationList>
        </AtomVekozDialog>

        <AtomVekozDialog v-model="organizationDialogVisible">
            <template #header>
                <el-text size="large">
                    組織資料
                </el-text>
            </template>
            <FormOrganization :modelValue="currentPublicInfo"></FormOrganization>
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
import { View, FolderOpened, User, Close, Postcard } from '@element-plus/icons-vue'
import useRepoOrganization from '~/composables/useRepoOrganization'
import type { IPublicInfoCard } from '~/types/ui'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const isLoading = ref<boolean>(false)
const repoOrganization = useRepoOrganization()

const organizationList = ref<IOrganization[]>([])
const currentPublicInfo = ref<IPublicInfoCard>({})

const organizationListDialog = reactive({
    visibility: false,
    mode: ''
})

const organizationMemberDialog = reactive({
    visibility: false,
    mode: '',
})

const organizationDialogVisible = ref<boolean>(false)

// Hooks
onMounted(() => {
    getOrganizationList()
})


// Methods
function getPersonalLink() {
    const openInLineExternal = `openExternalBrowser=1`
    return `${currentPublicInfo.value.urlPath}?${openInLineExternal}`
}

async function getOrganizationList() {
    const response: IOrganization[] = await repoOrganization.getOrganizationList()
    response.sort((a, b) => {
        const timeA = new Date(String(a.lastmod)).getTime()
        const timeB = new Date(String(b.lastmod)).getTime()
        return timeB - timeA
    })
    organizationList.value = response
    if (response[0]) {
        // 開啟上一次編輯的組織    
        currentPublicInfo.value = getOrganizationPublicInfo(response[0])
    } else {
        // 或是新增組織
        createOrganization()
    }
}

async function createOrganization() {
    const newOrganization = {
        name: `${repoUser.userInfo.name}的組織`,
    }
    const createdOrganization = await repoOrganization.postOrganization(newOrganization)
    currentPublicInfo.value = getOrganizationPublicInfo(createdOrganization)
    organizationListDialog.visibility = false
}

function getOrganizationPublicInfo(item: IOrganization): IPublicInfoCard {
    return {
        id: item.id,
        banner: item.banner,
        image: item.logo,
        name: item.name,
        description: item.description,
        sameAs: item.sameAs,
        urlPath: `o/${item.seoName || item.id}`
    }
}

async function openOrganization(organizationId: string) {
    const result = await repoOrganization.getOrganization(organizationId)
    currentPublicInfo.value = getOrganizationPublicInfo(result)
    organizationListDialog.visibility = false
}

// async function hanelDialogConfirm() {
//     isDialogLoading.value = true
//     if (organizationListDialog.mode === 'ADD') {
//         // await postOrganization()
//     }
//     if (organizationListDialog.mode === 'EDIT') {
//         await patchOrganization()
//     }
//     isDialogLoading.value = false
// }

// async function postOrganization() {
//     await repoOrganization.postOrganization(organization.value)
//     getOrganizationList()
//     organizationListDialog.visibility = false
// }

async function patchOrganization() {
    isLoading.value = true
    await repoOrganization.patchOrganization(currentPublicInfo.value)
    isLoading.value = false
}

// function openNewDialog() {
//     organization.value = {} as any
//     organizationListDialog.visibility = true
//     organizationListDialog.mode = 'ADD'
// }

function editOrganizationDialog(item: IOrganization) {
    // Object.assign(organization.value, item)
    organizationListDialog.visibility = true
    organizationListDialog.mode = 'EDIT'
}

function editOrganizationMemberDialog(item: IOrganization) {
    // Object.assign(organization.value, item)
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
            // isLoading.value = true
            // await repoOrganization.deleteOrganization(item.id)
            // await getOrganizationList()
            // isLoading.value = false
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
