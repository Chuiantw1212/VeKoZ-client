<template>
    <div>
        <el-row class="userTemplate" :gutter="20">
            <el-col :span="repoUI.isMedium ? 16 : 24">
                <el-card class="user__card vekoz-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="vekoz-card-header">
                            <div class="header__btnGroup">
                                <el-button v-loading="isLoading" :icon="FolderOpened" :disabled="isLoading"
                                    @click="organizationListDialog.visibility = true">
                                    開啓組織
                                </el-button>
                                <!-- <el-button v-loading="isLoading"  :icon="Postcard"
                                    @click="organizationDialogVisible = true">
                                    變更資料
                                </el-button> -->
                                <el-button v-loading="isLoading" :disabled="isLoading" :icon="User"
                                    @click="editOrganizationMemberDialog">
                                    管理成員
                                </el-button>
                            </div>
                            <div>
                                <div class="header__ui">
                                    <NuxtLink :to="getPersonalLink()" target="_blank">
                                        <el-button v-loading="isLoading" :icon="View">
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
            <FormOrganizationList :modelValue="currentPublicInfo" @update:modelValue="openOrganization($event)"
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
                    成員與權限設定
                </el-text>
            </template>
            <template #headerUI>
                <el-button :icon="Close" text @click="organizationMemberDialog.visibility = false">
                </el-button>
            </template>
            <FormOrganizationMember v-if="organizationMemberDialog.visibility" v-model="currentPublicInfo.id"
                :mode="organizationMemberDialog.mode">
            </FormOrganizationMember>
        </AtomVekozDialog>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
import { ElMessageBox } from 'element-plus'
import type { IUser } from '~/types/user'
import { View, FolderOpened, User, Close, Postcard } from '@element-plus/icons-vue'
import useRepoOrganization from '~/composables/useRepoOrganization'
import type { IPublicInfoCard } from '~/types/ui'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const isLoading = ref<boolean>(false)
const repoOrganization = useRepoOrganization()
const repoOrganizationMember = useRepoOrganizationMember()

const membershipList = ref<IOrganization[]>([])
const currentPublicInfo = ref<IPublicInfoCard>({
    id: '',
})

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
watch(() => repoUser.userInfo, (newValue: IUser) => {
    if (newValue.id) {
        getOrganizationMemberships()
    }
}, { immediate: true, })

// Methods
function getPersonalLink() {
    const openInLineExternal = `openExternalBrowser=1`
    return `${currentPublicInfo.value.urlPath}?${openInLineExternal}`
}

async function getOrganizationMemberships() {
    const response: IOrganizationMember[] = await repoOrganizationMember.getMemberOrganizatoinList({
        pageSize: 5,
        currentPage: 1,
    })
    membershipList.value = response
    if (response[0]) {
        const organizationId = response[0].organizationId
        const organization = await repoOrganization.getOrganization(String(organizationId))
        currentPublicInfo.value = convertPublicInfo(organization)
    }
    // if (response[0]) {
    //     // 開啟上一次編輯的組織    
    //     currentPublicInfo.value = convertPublicInfo(response[0])
    // } else {
    //     // 或是新增組織
    //     createOrganization()
    // }
}

async function createOrganization() {
    const newOrganization = {
        name: `${repoUser.userInfo.name}的組織`,
    }
    const createdOrganization = await repoOrganization.postOrganization(newOrganization)
    currentPublicInfo.value = convertPublicInfo(createdOrganization)
    organizationListDialog.visibility = false
}

function convertPublicInfo(item: IOrganization): IPublicInfoCard {
    return {
        id: item.id ?? '',
        banner: item.banner,
        image: item.logo,
        name: item.name,
        description: item.description,
        sameAs: item.sameAs,
        urlPath: `o/${item.seoName || item.id}`
    }
}

async function openOrganization(membership: IOrganizationMember) {
    if (membership.organizationId) {
        const result = await repoOrganization.getOrganization(membership.organizationId)
        currentPublicInfo.value = convertPublicInfo(result)
        organizationListDialog.visibility = false
    }
}

async function patchOrganization() {
    if (currentPublicInfo.value.id) {
        isLoading.value = true
        await repoOrganization.patchOrganization(currentPublicInfo.value)
        isLoading.value = false
    }
}

function editOrganizationMemberDialog(item: IOrganization) {
    organizationMemberDialog.visibility = true
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
