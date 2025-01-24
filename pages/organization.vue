<template>
    <div class="organization">
        <div class="organization__header">
            <h1>權限&組織管理</h1>
            <ElButton>新增</ElButton>
        </div>

        <table class="table">
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
        </table>

        <table>
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
        </table>

        <el-dialog v-model="dialogVisible" title="樣板設定" class="event__template">
            <el-divider>
                活動描述
            </el-divider>
            <ClientOnly>
                <el-form>

                    <ElInput v-model="organization.name"></ElInput>

                    <VenoniaUploader></VenoniaUploader>

                    <AtomVotionEditor v-model="organization.description">

                    </AtomVotionEditor>
                </el-form>
            </ClientOnly>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import VenoniaUploader from '~/components/atom/VenoniaUploader.vue';
const dialogVisible = ref(false)

const organization = reactive({
    name: '',
    description: '',
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
