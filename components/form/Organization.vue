<template>
    <el-form label-width="auto">
        <el-row>
            <el-col :span="14">
                <el-form-item label="單位名稱">
                    <ElInput v-model="organization.name" :maxlength="30" :show-word-limit="true" placeholder="請輸入">
                    </ElInput>
                </el-form-item>
                <el-form-item label="Email">
                    <el-input v-model="organization.lineId" :maxlength="8" :show-word-limit="true"
                        placeholder="請輸入"></el-input>
                </el-form-item>
                <el-form-item label="LineID">
                    <el-input v-model="organization.lineId" :maxlength="8" :show-word-limit="true"
                        placeholder="請輸入"></el-input>
                </el-form-item>
                <!-- <el-form-item label="統一編號">
                    <el-input v-model="organization.taxID" :maxlength="8" :show-word-limit="true"
                        placeholder="請輸入"></el-input>
                </el-form-item> -->
            </el-col>
            <el-col :span="10">
                <el-form-item label="商標">
                    <ClientOnly>
                        <AtomAvatarUploader v-if="organization.logo" v-model="organization.logo" accept="image/*">
                        </AtomAvatarUploader>
                    </ClientOnly>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <!-- <el-col :span="24">
                <el-form-item label="LineID">
                    <el-input v-model="organization.lineId" :maxlength="8" :show-word-limit="true"
                        placeholder="請輸入"></el-input>
                </el-form-item>
            </el-col> -->
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="描述">
                    <el-input v-model="organization.description" :maxlength="120" :rows="3" type="textarea"
                        :show-word-limit="true" placeholder="請輸入"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <OrganismDesignBanner v-model="organization.banner"></OrganismDesignBanner>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="Google 日曆">
                    <ElInput v-model="organization.googleCalendarId" :maxlength="120" :show-word-limit="true"
                        placeholder="請輸入你為這個組織建立的 Google 日曆 ID">
                    </ElInput>
                </el-form-item>
            </el-col>
        </el-row>
        <el-alert type="info" show-icon :closable="false">
            <p>
                有關Google 日曆連動的中文教學，請參考<a target="_blank"
                    href="https://support.google.com/a/answer/1626902?hl=zh-Hant">建立及共用群組日曆</a>
            </p>
        </el-alert>
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