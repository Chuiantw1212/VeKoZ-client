<template>
    <div class="organization">
        <div class="organization__header">
            <h1>權限&組織管理</h1>
            <ElButton @click="dialogVisible = true">新增</ElButton>
        </div>

        <el-table :data="organizationList">
            <el-table-column prop="name" label="名稱" />
            <el-table-column prop="logo" label="Logo" />
            <el-table-column prop="description" label="描述" />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default>
                    <el-button link type="primary" size="small" @click="deleteOrganization()">
                        Detail
                    </el-button>
                    <el-button link type="primary" size="small" @click="openEditDialog()">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- <table class="table">
            <thead>
                <tr>
                    <td>
                        名稱
                    </td>
                    <td>
                        角色
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    學校學不到的事
                </tr>
                <tr>講者</tr>
            </tbody>
        </table> -->

        <!-- <table>
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>email</th>
                    <th>權限(下拉選單)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>EN Chu</th>
                    <th>chuinatw1212@gmail.com</th>
                    <th>創建事件</th>
                </tr>
            </tbody>
        </table> -->

        <el-dialog v-model="dialogVisible" title="組織設定" class="event__template">
            <el-form>
                {{ organization }}
                <el-form-item label="單位名稱">
                    <ElInput v-model="organization.name" placeholder="請輸入"></ElInput>
                </el-form-item>
                <el-form-item label="Logo">
                    <AtomAvatarUploader v-model="organization.logo" accept="image/*"></AtomAvatarUploader>
                </el-form-item>
                <el-divider>
                    成員管理
                </el-divider>
                <p>先案右下確認後，再於主畫面新增/管理成員。</p>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="postOrganization()">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import VenoniaUploader from '~/components/atom/VenoniaUploader.vue';
import useRepoOrganization from '~/composables/useRepoOrganization'

const repoOrganization = useRepoOrganization()
const dialogVisible = ref(true)

const organization = reactive({
    name: '學校學不到的事',
    description: '',
    logo: '',
})

const organizationList = ref([])

async function postOrganization() {
    const response = await repoOrganization.postOrganization(organization)
}

async function deleteOrganization(){
    
}

async function getOrganizationList() {
    const response = await repoOrganization.getOrganizationList()
    console.log({
        response
    })
    organizationList.value = response
}

onMounted(() => {
    getOrganizationList()
})
</script>
<style lang="scss" scoped>
.organization {
    .organization__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>
