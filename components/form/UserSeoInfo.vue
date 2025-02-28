<template>
    <el-form label-width="auto" ref="formRef" :model="userForm" :rules="formRules">
        <el-form-item label="名片頁網址" prop="seoName">
            <el-input v-model="userForm.seoName" :maxlength="30" placeholder="en-chu" :show-word-limit="true">
                <template #prefix>
                    {{ urlPrefix }}
                </template>
            </el-input>
        </el-form-item>
        <el-row>
            <el-col :span="24">
            </el-col>
        </el-row>
        <el-divider>Line App Share</el-divider>

        <el-divider>Google 搜尋預覽</el-divider>
        <!-- {{ userForm }} -->
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
    </el-form>
</template>
<script setup lang="ts">
import type { IUser } from '~/types/user'
import type { FormInstance } from 'element-plus'
import isURL from 'validator/lib/isURL'
const formRef = ref<FormInstance>()
const urlPrefix = ref<string>('https://vekoz.org/')
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

const formRules = {
    seoName: [
        {
            required: true,
            message: '網址為必填',
        },
        {
            message: '網址不合規',
            validator(rule: any, value: string) {
                const urlWithPrefix = `${urlPrefix.value}${value}`
                const isValidUrl = isURL(urlWithPrefix)
                return isValidUrl;
            },
        }
    ]
}
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
//     repoUI.debounce('patchUserSeo', async () => {
//         const result = await repoUser.patchUserSeo({
//             seoName: seoName.value,
//             id: userForm.value.id
//         })
//         // isSeoNameValid.value = result.status === 200
//         isSeoNameLoading.value = false
//     })
// }
async function validate() {
    return formRef.value?.validate()
}

defineExpose({
    validate
})
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