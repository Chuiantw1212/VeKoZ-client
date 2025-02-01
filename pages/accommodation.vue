<template>
  <div class="venonia-header">
    <h1>空間&地點管理</h1>
    <ElButton @click="openNewDialog()">新增空間</ElButton>
  </div>
  <br />
  <el-table :data="tableItems" style="width: 100%">
    <el-table-column prop="name" label="空間名稱" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="description" label="描述" />
    <el-table-column fixed="right" label="功能">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="editAccommodationDialog(row)">編輯空間</el-button>
        <el-button link type="danger" size="small" @click="deleteAccommodation(row)">
          刪除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="accommodationDialog.visibility" title="空間設定" class="event__template">
    <FormAccommodation v-if="accommodationDialog.visibility" v-model="form" :mode="accommodationDialog.mode">
    </FormAccommodation>
    <template #footer>
      <el-button @click="accommodationDialog.visibility = false">取消</el-button>
      <el-button type="primary" @click="hanelDialogConfirm()">
        確認
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { IAccommodation } from '~/types/accommodation'

// Data
const repoAccommodation = useRepoAccommodation()

const tableItems = ref([])

const form = reactive<IAccommodation>({
  name: '',
  address: '',
  description: '',
})

const accommodationDialog = reactive({
  visibility: false,
  mode: '',
})

// Hooks
onMounted(() => {
  getAccommodationList()
})

// methods
function openNewDialog() {
  accommodationDialog.visibility = true
  accommodationDialog.mode = 'ADD'
}

function editAccommodationDialog(item: IAccommodation) {
  Object.assign(form, item)
  accommodationDialog.visibility = true
  accommodationDialog.mode = 'EDIT'
}

async function hanelDialogConfirm() {
  if (accommodationDialog.mode === 'ADD') {
    postAccommodation()
  }
  if (accommodationDialog.mode === 'EDIT') {
    putAccommodation()
  }
}

async function postAccommodation() {
  await repoAccommodation.postAccommodation(form)
  getAccommodationList()
  accommodationDialog.visibility = false
}

async function putAccommodation() {
  await repoAccommodation.putAccommodation(form)
  getAccommodationList()
  accommodationDialog.visibility = false
}

async function getAccommodationList() {
  tableItems.value = await repoAccommodation.getAccommodationList()
}

async function deleteAccommodation(row: IAccommodation) {
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
    await repoAccommodation.deleteAccommodation(row.id)
    getAccommodationList()
  }
}
</script>