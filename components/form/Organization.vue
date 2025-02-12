<template>
    <el-form>
        <el-row justify="space-between">
            <el-col :span="12">
                <el-form-item label="單位名稱">
                    <ElInput v-model="organization.name" :maxlength="30" :show-word-limit="true" placeholder="請輸入">
                    </ElInput>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="商標">
                    <ClientOnly>
                        <AtomAvatarUploader v-model="organization.logo" accept="image/*"></AtomAvatarUploader>
                    </ClientOnly>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="描述">
                    <el-mention v-model="organization.description" :maxlength="150" type="textarea"
                        :show-word-limit="true" placeholder="請輸入"></el-mention>
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
const emits = defineEmits(['update:modelValue'])
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
    }
})

const organization = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emits('update:modelValue', newValue)
    }
})
</script>