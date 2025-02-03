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
        <el-button link type="primary" size="small" @click="editPlaceDialog(row)">編輯空間</el-button>
        <el-button link type="danger" size="small" @click="deletePlace(row)">
          刪除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="placeDialog.visibility" title="空間設定" class="event__template">
    <FormPlace v-if="placeDialog.visibility" v-model="form" :mode="placeDialog.mode">
    </FormPlace>
    <template #footer>
      <el-button @click="placeDialog.visibility = false">取消</el-button>
      <el-button type="primary" @click="hanelDialogConfirm()">
        確認
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { IPlace } from '~/types/place'

// Data
const repoPlace = useRepoPlace()

const tableItems = ref([])

const form = reactive<IPlace>({
  name: '',
  address: '',
  description: '',
})

const placeDialog = reactive({
  visibility: false,
  mode: '',
})

// Hooks
onMounted(() => {
  getPlaceList()
})

// methods
function openNewDialog() {
  form.value = {}
  placeDialog.visibility = true
  placeDialog.mode = 'ADD'
}

function editPlaceDialog(item: IPlace) {
  Object.assign(form, item)
  placeDialog.visibility = true
  placeDialog.mode = 'EDIT'
}

async function hanelDialogConfirm() {
  if (placeDialog.mode === 'ADD') {
    postPlace()
  }
  if (placeDialog.mode === 'EDIT') {
    putPlace()
  }
}

async function postPlace() {
  await repoPlace.postPlace(form)
  getPlaceList()
  placeDialog.visibility = false
}

async function putPlace() {
  await repoPlace.putPlace(form)
  getPlaceList()
  placeDialog.visibility = false
}

async function getPlaceList() {
  tableItems.value = await repoPlace.getPlaceList()
}

async function deletePlace(row: IPlace) {
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
    await repoPlace.deletePlace(row.id)
    getPlaceList()
  }
}
</script>