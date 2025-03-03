<template>
    <el-alert type="info" show-icon :closable="false">
        <p>
            有關Google 日曆連動的中文教學，請參考<a target="_blank"
                href="https://support.google.com/a/answer/1626902?hl=zh-Hant">建立及共用群組日曆</a>
        </p>
    </el-alert>
    <el-form class="organization__form" label-width="auto">
        <el-row>
            <el-col :span="24">
                <el-form-item label="Google 日曆">
                    <ElInput v-model="organization.googleCalendarId" :maxlength="120" :show-word-limit="true"
                        placeholder="請輸入你為這個組織建立的 Google 日曆 ID">
                    </ElInput>
                </el-form-item>
            </el-col>
        </el-row>
        <template v-if="mode === 'ADD'">
            <el-divider>
                成員管理
            </el-divider>
            <p>先確認後，再於組織列表"編輯成員"。</p>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
const emits = defineEmits(['update:modelValue'])
const organization = defineModel<IOrganization>({
    default: {
        name: '',
        logo: '',
        description: ''
    }
})
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {
                name: '',
                logo: '',
                description: ''
            }
        },
        required: true,
    },
    mode: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false,
    }
})

// const organization = computed({
//     get() {
//         return props.modelValue
//     },
//     set(newValue) {
//         emits('update:modelValue', newValue)
//     }
// })
</script>
<style lang="scss" scoped>
.organization__form {
    margin-top: 20px;
}
</style>