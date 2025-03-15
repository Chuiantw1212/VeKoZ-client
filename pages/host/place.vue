<template>
    <div class="venonia-header">
        <h1>地點管理</h1>
        <ElButton @click="openNewDialog()">新增地點</ElButton>
    </div>
    <el-alert type="info" show-icon :closable="false">
        TODO: 等待後臺開發，再行推廣空間的畫面。
    </el-alert>

    <el-table class="mt-20" :data="tableItems" style="width: 100%">
        <el-table-column prop="name" label="地點名稱" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="description" label="描述" />
        <el-table-column fixed="right" label="功能">
            <template #default="{ row }">
                <el-button link type="primary" size="small" @click="editPlaceDialog(row)">編輯空間</el-button>
                <el-button link type="danger" size="small" @click="deletePlace(row)">
                    刪除
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <VenoniaDialog v-model="placeDialog.visibility" class="event__template">
        <template #header>
            地點設定
        </template>
        <FormPlace v-if="placeDialog.visibility" v-model="form" :mode="placeDialog.mode">
        </FormPlace>
        <template #footer>
            <el-button @click="placeDialog.visibility = false">取消</el-button>
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

// Data
const repoPlace = useRepoPlace()
const repoOrganizationMember = useRepoOrganizationMember()

const tableItems = ref([])
const membershipList = ref<IOrganizationMember[]>([])

const form = ref<IPlace>({
    name: '',
    address: '',
    description: '',
    organizationId: 'public',
    organizationName: '無歸屬組織',
})

const placeDialog = reactive({
    visibility: false,
    mode: '',
})

// Hooks
onMounted(async () => {
    await getMemberOrganizationList()
    getPlaceList()
})

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
            organizationIds: [...organizationIds, 'public'],
        })
    }
}

function openNewDialog() {
    form.value = {
        organizationId: 'public',
        organizationName: '無歸屬組織',
    }
    placeDialog.visibility = true
    placeDialog.mode = 'ADD'
}

function editPlaceDialog(item: IPlace) {
    form.value = {
        organizationId: 'public',
        organizationName: '無歸屬組織',
    }
    Object.assign(form.value, item)
    placeDialog.visibility = true
    placeDialog.mode = 'EDIT'
}

async function hanelDialogConfirm() {
    if (placeDialog.mode === 'ADD') {
        postPlace()
    }
    if (placeDialog.mode === 'EDIT') {
        patchPlace()
    }
}

async function postPlace() {
    await repoPlace.postPlace(form.value)
    getPlaceList()
    placeDialog.visibility = false
}

async function patchPlace() {
    await repoPlace.patchPlace(form.value)
    getPlaceList()
    placeDialog.visibility = false
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
.mt-20 {
    margin-top: 20px;
}
</style>