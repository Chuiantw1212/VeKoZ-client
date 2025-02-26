<template>
    <el-form label-width="auto" class="card">
        <!-- <el-row justify="center">
            <el-col :span="6">
                <el-form-item>
                    <img class="card__avatar" src="@/assets/mock/user.jpg">
                </el-form-item>
            </el-col>
        </el-row> -->
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
                <el-form-item label="別名/姓名">
                    <el-input v-model="userForm.name" placeholder="請輸入別名或姓名" :maxlength="30" :show-word-limit="true"
                        :disabled="disabled">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-divider>願意主動提供給主辦方的資料</el-divider>
        <el-alert type="info" show-icon :closable="false">
            TODO：將會包含年齡、性別、職業，便於主辦方舉行特定活動，例：Womens Talk, Mens Talk。
        </el-alert>
    </el-form>
</template>
<script setup lang="ts">
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import type { IUser } from '~/types/user';
const isSeoNameLoading = ref<boolean>(false)
const repoUser = useRepoUser()
const seoName = ref<string>('')
const isSeoNameValid = ref<boolean>(true)
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
const props = defineProps({
    disabled: {
        type: Boolean,
        defualt: false,
    }
})

watch(() => userForm.value, (newValue) => {
    seoName.value = String(newValue.seoName)
}, { deep: true, immediate: true, })

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