<template>
    <div v-loading="isLoading" class="place">
        <div class="place__headerGroup">
            <h2>已連動地點</h2>
            <ElButton :icon="Connection" @click="openConnectDialog()">連動既有地點</ElButton>
        </div>
        <el-table :key="id" class="mt-20" :data="syncTableItems">
            <el-table-column prop="addressRegion" label="縣市">
                <template #default="{ row }">
                    {{ getRegionLabel(row.addressRegion) }}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="name" label="地點名稱" />
            <el-table-column prop="organizationName" label="來源組織">
                <template #default="{ row }">
                    <div class="place__fr">
                        <el-avatar :src="row.organizationLogo"></el-avatar>
                        {{ row.organizationName }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="功能">
                <template #default="{ row }">
                    <el-button v-if="checkEditDisabled(row)" :icon="View" plain circle
                        @click="viewPlaceDialog(row)"></el-button>
                    <el-button v-else :icon="Edit" plain circle :disabled="checkEditDisabled(row)"
                        @click="editPlaceDialog(row)"></el-button>
                    <el-button :icon="Delete" plain circle type="danger" @click="deletePlace(row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="place__headerGroup">
            <h2>已新增地點</h2>
            <ElButton :icon="AddLocation" @click="openNewDialog()">自行新增地點</ElButton>
        </div>
        <el-table :key="id" class="mt-20" :data="controlledTableItems">
            <el-table-column prop="addressRegion" label="縣市">
                <template #default="{ row }">
                    {{ getRegionLabel(row.addressRegion) }}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="name" label="地點名稱" />
            <el-table-column prop="organizationName" label="來源組織">
                <template #default="{ row }">
                    <div class="place__fr">
                        <el-avatar v-if="row.organizationLogo" :src="row.organizationLogo"></el-avatar>
                        <template v-if="row.organizationId === 'public'">
                            無歸屬組織
                        </template>
                        <template v-else>
                            {{ row.organizationName }}
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="功能">
                <template #default="{ row }">
                    <el-button :icon="Edit" plain circle :disabled="checkEditDisabled(row)"
                        @click="editPlaceDialog(row)"></el-button>
                    <el-button :icon="Delete" plain circle type="danger" :disabled="checkPlaceDeletable(row)"
                        @click="deletePlace(row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <VenoniaDialog v-model="addPlaceDialogVisible" class="event__template">
        <template #header>
            地點編輯
        </template>
        <FormPlaceAdding v-if="addPlaceDialogVisible" v-model="placeForm">
        </FormPlaceAdding>
        <template #footer>
            <el-button @click="addPlaceDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="hanelDialogConfirm()">
                確認
            </el-button>
        </template>
    </VenoniaDialog>

    <VenoniaDialog v-model="viewPlaceDialogVisible" class="event__template">
        <template #header>
            地點檢視
        </template>
        <FormPlaceAdding v-if="viewPlaceDialogVisible" :model-value="placeForm" :disabled="true">
        </FormPlaceAdding>
        <template #footer>
            <el-button type="primary" @click="viewPlaceDialogVisible = false">
                確認
            </el-button>
        </template>
    </VenoniaDialog>

    <VenoniaDialog v-model="connectPlaceDialogVisible" class="event__template">
        <template #header>
            地點連動
        </template>
        <FormPlaceConnecting v-if="connectPlaceDialogVisible" v-model="placeForm">
        </FormPlaceConnecting>
        <template #footer>
            <el-button @click="connectPlaceDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="postPlace()">
                確認
            </el-button>
        </template>
    </VenoniaDialog>
</template>

<script lang="ts" setup>
import VenoniaDialog from '~/components/atom/VekozDialog.vue'
import type { IOrganizationMember } from '~/types/organization'
import type { IPlace } from '~/types/place'
import { View, Edit, Delete, AddLocation, Connection } from '@element-plus/icons-vue'
import { FormPlaceAdding } from '#components'
import type { ISelectOption } from '~/types/meta'

// Data
const id = ref<string>(crypto.randomUUID())
const isLoading = ref<boolean>(true)
const repoPlace = useRepoPlace()
const repoOrganizationMember = useRepoOrganizationMember()
const repoUser = useRepoUser()
const repoUI = useRepoUI()
const repoMeta = useRepoMeta()

const taiwanRegions = ref<ISelectOption[]>([])
const syncTableItems = ref<IPlace[]>([])
const controlledTableItems = ref<IPlace[]>([])
const membershipList = ref<IOrganizationMember[]>([])

const placeForm = ref<IPlace>({
    name: '',
    address: '',
    description: '',
    organizationId: 'public',
    organizationName: '無歸屬組織',
})
const addPlaceDialogVisible = ref<boolean>(false)
const viewPlaceDialogVisible = ref<boolean>(false)
const connectPlaceDialogVisible = ref<boolean>(false)

// Hooks
onMounted(() => {
    getMetaSelectById()
})
watch(() => repoUser.userInfo, async () => {
    isLoading.value = true
    repoUI.debounce(id.value, async () => {
        await getMemberOrganizationList()
        await getSyncPlaces()
        await getPlaceList()
        isLoading.value = false
        id.value = crypto.randomUUID()
    }, 1000)
}, { immediate: true })

// Methods
async function getSyncPlaces() {
    syncTableItems.value = await repoPlace.getPlaceList({
        email: repoUser.userInfo.email,
    })
}

function getRegionLabel(region: string) {
    const matchedRegion = taiwanRegions.value.find(item => {
        return item.value === region
    })
    return matchedRegion?.label
}

async function getMetaSelectById() {
    const result = await repoMeta.getMetaSelectById('taiwan')
    taiwanRegions.value = result
}

function checkPlaceDeletable(place: IPlace) {
    const placeOrganization = membershipList.value.find(member => {
        return member.organizationId === place.organizationId
    })
    return !placeOrganization?.allowMethods?.includes('DELETE')
}

function checkEditDisabled(place: IPlace) {
    const placeOrganization = membershipList.value.find(member => {
        return member.organizationId === place.organizationId
    })
    const allowPatch = placeOrganization?.allowMethods?.includes('PATCH')
    const isPublic = place.organizationId === 'public'
    return !(allowPatch || isPublic)
}

async function getMemberOrganizationList() {
    const result = await repoOrganizationMember.getMemberOrganizationList({
        allowMethods: ['GET'],
    })
    if (result) {
        membershipList.value = result.items
    }
}

async function getPlaceList() {
    const organizationIds = membershipList.value.map(member => {
        return member.organizationId ?? ''
    })
    if (organizationIds) {
        controlledTableItems.value = await repoPlace.getPlaceList({
            organizationIds: [...organizationIds, 'public'],
        })
    }
}

function openNewDialog() {
    placeForm.value = {
        organizationId: 'public',
        organizationName: '無歸屬組織',
    }
    addPlaceDialogVisible.value = true
}

function viewPlaceDialog(item: IPlace) {
    placeForm.value = {
        organizationId: 'public',
        organizationName: '無歸屬組織',
    }
    Object.assign(placeForm.value, item)
    viewPlaceDialogVisible.value = true
}

function editPlaceDialog(item: IPlace) {
    placeForm.value = {
        organizationId: 'public',
        organizationName: '無歸屬組織',
    }
    Object.assign(placeForm.value, item)
    addPlaceDialogVisible.value = true
}

function openConnectDialog() {
    connectPlaceDialogVisible.value = true
}

async function hanelDialogConfirm() {
    if (placeForm.value.id) {
        patchPlace()
    } else {
        postPlace()
    }
}

/**
 * 新增或是連動
 */
async function postPlace() {
    await repoPlace.postPlace(placeForm.value)
    getPlaceList()
    addPlaceDialogVisible.value = false
}

async function patchPlace() {
    await repoPlace.patchPlace(placeForm.value)
    getPlaceList()
    addPlaceDialogVisible.value = false
}

async function deletePlace(row: IPlace) {
    if (!row.id) {
        return
    }
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
        await repoPlace.deletePlace({
            id: row.id,
            organizationId: row.organizationId,
        })
        getPlaceList()
    }
}
</script>
<style lang="scss" scoped>
.place__headerGroup {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.place__fr {
    display: flex;
    align-items: center;
    gap: 8px;
}

.place__ui {
    display: flex;
    justify-content: flex-end;
}

.mt-20 {
    margin-top: 20px;
}
</style>