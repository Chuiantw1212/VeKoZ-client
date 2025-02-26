<template>
    <!-- <el-alert type="info" show-icon :closable="false">
        名片頁網址，檢核通過後會立即更新。
    </el-alert>
    <br /> -->
    <el-form label-width="auto">
        <el-row>
            <el-col :span="24">
                <el-form-item label="名片頁網址">
                    <el-input v-model="userForm.seoName" :maxlength="30" placeholder="en-chu" :show-word-limit="true">
                        <template #prefix>
                            https://vekoz.org/
                        </template>
                        <!-- <template #suffix>
                            <el-icon v-if="isSeoNameValid" color="#67c23a" v-loading="isSeoNameLoading">
                                <CircleCheck></CircleCheck>
                            </el-icon>
                            <el-icon v-else color="#f56c6c" v-loading="isSeoNameLoading">
                                <CircleClose></CircleClose>
                            </el-icon>
                        </template> -->
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="名片頁標題">
                    <el-input v-model="userForm.seoTitle" :maxlength="30" placeholder="例：EN Chu，一個善於理財的工程師"
                        :show-word-limit="true" />
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="24">
                <el-form-item label="名片頁描述">
                    <el-input v-model="userForm.description" :maxlength="150" :show-word-limit="true" :disabled="true">
                        <template #prefix>
                            請到樣板編輯修改文字~~
                        </template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row> -->
        <el-alert type="info" show-icon :closable="false">
            文字描述請到樣板編輯修改。
        </el-alert>

        <el-divider>Google 搜尋預覽</el-divider>
        <div class="gooogleCard">
            <div class="card__header">
                <!-- <div> -->
                <img class="header__avatar" src="@/assets/logo/160_160.png">
                <!-- </div> -->
                <div>
                    <div class="header__name">VeKoZ 微課室</div>
                    <div class="header__uirl">https://vekoz.org › {{ userForm.seoName }}</div>
                </div>
            </div>
            <div class="card__title">{{ userForm.seoTitle }}</div>
            <div class="card__desc">{{ userForm.description }}</div>
        </div>
        <el-divider>Line App Share</el-divider>
    </el-form>
</template>
<script setup lang="ts">
import type { IUser } from '~/types/user'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'

const isSeoNameLoading = ref<boolean>(false)
const repoUser = useRepoUser()
// const isSeoNameValid = ref<boolean>(true)
const repoUI = useRepoUI()
const userForm = defineModel<IUser>('modelValue', {
    type: Object,
    default: {
        id: '',
        name: '',
        description: '',
        seoName: '',
        seoTitle: '',
    }
})
/**
 * https://developers.google.com/search/docs/appearance/favicon-in-search
 */
// const seoName = ref<string>('')

// watch(() => userForm.value, (newValue) => {
//     seoName.value = String(newValue.seoName)
// }, { deep: true, immediate: true, })

// // Methods
// async function patchSeoName() {
//     isSeoNameLoading.value = true
//     repoUI.debounce('patchUserSeoName', async () => {
//         const result = await repoUser.patchUserSeoName({
//             seoName: seoName.value,
//             id: userForm.value.id
//         })
//         // isSeoNameValid.value = result.status === 200
//         isSeoNameLoading.value = false
//     })
// }
</script>
<style lang="scss" scoped>
.card__header {
    display: flex;
    align-items: center;
    width: 100%;

    .header__avatar {
        display: block;
        width: 28px;
        height: 28px;
        margin-right: 12px;
    }

    .header__name {
        // color: #dadce0;
        font-size: 14px;
        display: block;
        line-height: 20px;
        white-space: nowrap;
    }

    .header__uirl {
        font-size: 12px;
        line-height: 18px;
    }

}

.card__title {
    font-family: Arial, sans-serif;
    font-size: 20px;
    font-weight: 400;
    margin-top: 18px;
}

.card__desc {
    max-width: 600px;
}
</style>