<template>
    <el-form label-width="auto" class="card">
        <el-row justify="center">
            <el-col :span="6">
                <el-form-item>
                    <img class="card__avatar" src="@/assets/mock/user.jpg">
                </el-form-item>
            </el-col>
        </el-row>
        <el-row justify="space-between" :gutter="20">
            <el-col :span="24">
                <el-form-item label="註冊Email">
                    <el-input v-model="userForm.email" placeholder="請輸入Email" :disabled="true">
                        <template #suffix>
                            (僅主辦方可見)
                        </template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="暱稱/姓名">
                    <el-input v-model="userForm.name" placeholder="請輸入暱稱或姓名" :maxlength="30" :show-word-limit="true">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="名片頁網址">
                    <el-input v-model="seoName" :maxlength="30" placeholder="例：en-chu" :show-word-limit="true"
                        @change="patchSeoName">
                        <template #prefix>
                            https://venonia.com/
                        </template>
                        <template #suffix>
                            <el-icon v-if="isSeoNameValid" color="#67c23a" v-loading="isSeoNameLoading">
                                <CircleCheck></CircleCheck>
                            </el-icon>
                            <el-icon v-else color="#f56c6c" v-loading="isSeoNameLoading">
                                <CircleClose></CircleClose>
                            </el-icon>
                        </template>
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
        <el-row>
            <el-col :span="24">
                <el-form-item label="描述">
                    <el-input v-model="userForm.description" type="textarea" :rows="3" :maxlength="150"
                        placeholder="請輸入簡介" :show-word-limit="true" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script setup lang="ts">
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import type { IUser } from '~/types/user';
const isSeoNameLoading = ref<boolean>(false)
const repoUser = useRepoUser()
const seoName = ref<string>('')
const isSeoNameValid = ref<boolean>(false)
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
watch(() => userForm.value, (newValue) => {
    isSeoNameLoading.value = true
    seoName.value = String(newValue.seoName)
})

// Methods
async function patchSeoName() {
    isSeoNameLoading.value = true
    repoUI.debounce('patchUserSeoName', async () => {
        const result = await repoUser.patchUserSeoName({
            seoName: seoName.value,
            id: userForm.value.id
        })
        isSeoNameValid.value = result.status === 200
        isSeoNameLoading.value = false
    })
}
</script>
<style lang="scss" scoped>
.card {

    .card__avatar {
        display: block;
        width: 118px;
        height: 118px;
        border-radius: 50%;
        margin: auto;
    }

    .card__editor {
        margin-top: 20px;
    }

    .item__body {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;

        >:first-child {
            width: 100%;
        }
    }
}
</style>