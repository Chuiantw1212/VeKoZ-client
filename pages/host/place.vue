<template>
    <div v-loading="isLoading" class="place">
        <div class="place__ui">
            <!-- 篩選條件 -->
            <ElButton @click="openNewDialog()">新增地點</ElButton>
        </div>
        <!-- <el-alert type="info" show-icon :closable="false">
        TODO: 等待後臺開發，再行推廣空間的畫面。
    </el-alert> -->
        <el-table :key="id" class="mt-20" :data="tableItems">
            <el-table-column prop="organizationName" label="來源組織">
                <template #default="{ row }">
                    <div class="place__fr">
                        <el-avatar :src="row.organizationLogo"></el-avatar>
                        {{ row.organizationName }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="地點名稱" />
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="description" label="描述" />
            <el-table-column fixed="right" label="功能">
                <template #default="{ row }">
                    <el-button :icon="Edit" plain circle @click="editPlaceDialog(row)"></el-button>
                    <el-button :icon="Delete" plain circle type="danger" @click="deletePlace(row)">

                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <VenoniaDialog v-model="placeDialogVisible" class="event__template">
        <template #header>
            地點設定
        </template>
        <FormPlace v-if="placeDialogVisible" v-model="form">
        </FormPlace>
        <template #footer>
            <el-button @click="placeDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="hanelDialogConfirm()">
                確認
            </el-button>
        </template>
    </VenoniaDialog>
</template>

<script lang="ts" setup>
import VenoniaDialog from '~/components/atom/VekozDialog.vue'
import type { IOrganizationMember } from '~/types/organization'
import type { IPlace } from '~/types/place'
import { Edit, Delete } from '@element-plus/icons-vue'

// Data
const id = ref<string>(crypto.randomUUID())
const isLoading = ref<boolean>(true)
const repoPlace = useRepoPlace()
const repoOrganizationMember = useRepoOrganizationMember()
const repoUser = useRepoUser()
const repoUI = useRepoUI()

const tableItems = ref([])
const membershipList = ref<IOrganizationMember[]>([])

const form = ref<IPlace>({
    name: '',
    address: '',
    description: '',
    organizationId: 'public',
    organizationName: '無歸屬組織',
})

const placeDialogVisible = ref<boolean>(false)

// Hooks
watch(() => repoUser.userInfo, async () => {
    isLoading.value = true
    repoUI.debounce(id.value, async () => {
        await getMemberOrganizationList()
        await getPlaceList()
        isLoading.value = false
        id.value = crypto.randomUUID()
    }, 1000)
}, { immediate: true })
// watch(() => repoUser.preference, async () => {
//     // nextTick(() => {
//     setTimeout(() => {
//         id.value = crypto.randomUUID()

//     }, 1000)
//     // })
// },)

// Methods
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
        tableItems.value = await repoPlace.getPlaceList({
            organizationIds: organizationIds,
        })
    }
}

function openNewDialog() {
    form.value = {
        organizationId: 'public',
        organizationName: '無歸屬組織',
    }
    placeDialogVisible.value = true
}

function editPlaceDialog(item: IPlace) {
    form.value = {
        organizationId: 'public',
        organizationName: '無歸屬組織',
    }
    Object.assign(form.value, item)
    placeDialogVisible.value = true
}

async function hanelDialogConfirm() {
    if (form.value.id) {
        patchPlace()
    } else {
        postPlace()
    }
}

async function postPlace() {
    await repoPlace.postPlace(form.value)
    getPlaceList()
    placeDialogVisible.value = false
}

async function patchPlace() {
    await repoPlace.patchPlace(form.value)
    getPlaceList()
    placeDialogVisible.value = false
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
        })
        getPlaceList()
    }
}
</script>
<style lang="scss" scoped>
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