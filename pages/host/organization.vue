<template>
    <div>
        <el-row class="userTemplate" :gutter="20">
            <el-col :span="repoUI.isMedium ? 16 : 24">
                <el-card class="user__card vekoz-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="vekoz-card-header">
                            <div class="header__btnGroup">
                                <el-button :icon="FolderOpened" :disabled="isLoading" @click="orgListVisible = true">
                                    打開組織
                                </el-button>
                                <!-- <el-button   :icon="Postcard"
                                    @click="organizationDialogVisible = true">
                                    變更資料
                                </el-button> -->
                                <el-button :disabled="isLoading" :icon="User" @click="editOrganizationMemberDialog">
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
                    <FormPublicInfoTemplate v-model="currentPublicInfo" :disabled="editingDisabled" :isDesigning="true"
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

        <AtomVekozDialog v-model="orgListVisible">
            <!-- <template #header>
                <el-text size="large">
                    開啟組織
                </el-text>
            </template> -->
            <FormOrganizationList v-if="orgListVisible" :modelValue="currentMembership"
                @update:modelValue="openOrganization($event)" @create="createOrganization()">
            </FormOrganizationList>
        </AtomVekozDialog>

        <AtomVekozDialog v-model="organizationDialogVisible">
            <!-- <template #header>
                <el-text size="large">
                    組織資料
                </el-text>
            </template> -->
            <FormOrganization :modelValue="currentPublicInfo"></FormOrganization>
        </AtomVekozDialog>

        <AtomVekozDialog v-model="memberListVisible" :showClose="true">
            <!-- <template #header>
                <el-avatar :src="currentPublicInfo.image"></el-avatar>
                <el-text size="large">
                    {{ currentPublicInfo.name }}
                </el-text>
            </template> -->
            <!-- <template #headerUI>
                <el-button :icon="Close" text @click="memberListVisible = false">
                </el-button>
            </template> -->
            <FormOrganizationMember v-if="memberListVisible" :modelValue="currentMembership">
            </FormOrganizationMember>
        </AtomVekozDialog>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
import { ElMessageBox } from 'element-plus'
import type { IUser } from '~/types/user'
import { View, FolderOpened, User, Close, } from '@element-plus/icons-vue'
import useRepoOrganization from '~/composables/useRepoOrganization'
import type { IPublicInfoCard } from '~/types/ui'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const isLoading = ref<boolean>(true) // 預設true避免閃動阻擋操作
const repoOrganization = useRepoOrganization()
const repoOrganizationMember = useRepoOrganizationMember()

const membershipList = ref<IOrganization[]>([])
const currentMembership = ref<IOrganizationMember>({})
const currentPublicInfo = ref<IPublicInfoCard>({
    id: '',
})
const editingDisabled = computed(() => {
    if (currentMembership.value.allowMethods?.includes('PATCH')) {
        return false
    } else {
        return true
    }
})

const orgListVisible = ref<boolean>(false)
const memberListVisible = ref<boolean>(false)
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
    const response = await repoOrganizationMember.getMemberOrganizationList({
        pageSize: 50,
        currentPage: 1,
    })
    if (!response) {
        return
    }
    membershipList.value = response.items
    const latestOrganization = response.items[0]
    if (latestOrganization) {
        currentMembership.value = latestOrganization
        const organizationId = latestOrganization.organizationId
        const organization = await repoOrganization.getOrganization(String(organizationId))
        currentPublicInfo.value = convertPublicInfo(organization)
    }
    isLoading.value = false
}

async function createOrganization() {
    const newOrganization = {
        name: `${repoUser.userInfo.name}的新組織`,
    }
    const createdOrganization = await repoOrganization.postOrganization(newOrganization)
    currentPublicInfo.value = convertPublicInfo(createdOrganization)
    orgListVisible.value = false
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
    currentMembership.value = membership
    if (membership.organizationId) {
        const result = await repoOrganization.getOrganization(membership.organizationId)
        currentPublicInfo.value = convertPublicInfo(result)
        orgListVisible.value = false
    }
}

async function patchOrganization() {
    const hasAuth = currentMembership.value.allowMethods?.includes('PATCH')
    if (currentPublicInfo.value.id && hasAuth) {
        isLoading.value = true
        await repoOrganization.patchOrganization(currentPublicInfo.value)
        isLoading.value = false
    }
}

function editOrganizationMemberDialog(item: IOrganization) {
    memberListVisible.value = true
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
