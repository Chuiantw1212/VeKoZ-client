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
        <el-alert type="info" show-icon :closable="false">
            縮圖、文字請從樣板設計更新。
        </el-alert>
        <el-divider>Line 分享
        </el-divider>
        <div class="lintCard">
            <div class="card__header">https://vekoz.org/{{ userForm.seoName }}?openExternalBrowser=1</div>
            <div class="card__body">
                <div class="body__textGroup">
                    <div class="textGroup__title">
                        {{ userForm.seoTitle }}
                    </div>
                    <div class="textGroup__desc">
                        {{ userForm.description }}
                    </div>
                </div>
                <img class="body__image" :src="userForm.avatar">
            </div>
        </div>
        <el-divider>Google 搜尋預覽</el-divider>
        <!-- {{ userForm }} -->
        <div class="googleCard">
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
.lintCard {
    width: 360px;
    padding: 8px 12px;
    background-color: rgb(195, 246, 157);
    border-radius: 17.5px;
    margin-left: auto;

    .card__header {
        color: #0000FF;
    }

    .card__body {
        display: flex;
        margin-top: 13px;
        align-items: center;

        .body__textGroup {
            font-size: 16px;
            display: flex;
            flex-direction: column;
            border-left: 1px solid lightgray;
            padding-left: 10px;
            width: 235px;
            // overflow: hidden;
            // text-overflow: ellipsis;

            .textGroup__title {
                font-size: 14px;
            }

            .textGroup__desc {
                font-size: 13px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .body__image {
            height: 45px;
            margin-left: 12px;
        }
    }
}

.googleCard {


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
}
</style>