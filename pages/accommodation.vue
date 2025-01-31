<template>
  <div class="venonia-header">
    <h1>空間管理</h1>
    <ElButton @click="openNewDialog()">新增空間</ElButton>
  </div>
  <p>這邊只是簡單的，設定地址方便帶入，很久後的未來才會延展成空間管理系統。</p>
  <br />
  <el-table :data="tableItems" style="width: 100%">
    <el-table-column prop="name" label="空間名稱" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="description" label="描述" />
  </el-table>

  <el-dialog v-model="accommodationDialog.visibility" title="空間設定" class="event__template">
    <FormOrganizationMember v-if="accommodationDialog.visibility" v-model="form" :mode="accommodationDialog.mode">
    </FormOrganizationMember>
    <template #footer>
      <el-button @click="accommodationDialog.visibility = false">取消</el-button>
      <el-button type="primary" @click="hanelDialogConfirm()">
        確認
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

const repoAccommodation = useRepoAccommodation()
/**
 * Accomodation
 * https://schema.org/Accommodation
 */
const tableItems = ref([])
// const tableItems = [
//   {
//     name: '齊文藝 2F-Q 安靜區大桌座位',
//     address: '台北車站南陽街32號',
//     description: '預定須知',
//   },
//   {
//     name: 'TCCC台灣文創訓練中心',
//     address: '台灣台北市中山區長安東路一段27號2樓',
//     description: '預定須知',
//   },
// ]

const form = reactive({})

const accommodationDialog = reactive({
  visibility: false,
  mode: ''
})

// methods
function openNewDialog() {
  accommodationDialog.visibility = true
  accommodationDialog.mode = 'ADD'
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

onMounted(() => {
  getAccommodationList()
})
</script>