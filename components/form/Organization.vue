<template>
    <el-form>
        <el-form-item label="單位名稱">
            <ElInput v-model="organization.name" placeholder="請輸入"></ElInput>
        </el-form-item>
        <el-form-item label="Logo">
            <ClientOnly>
                <AtomAvatarUploader v-model="organization.logo" accept="image/*"></AtomAvatarUploader>
            </ClientOnly>
        </el-form-item>
        <el-form-item label="描述">
            <ElInput v-model="organization.description" placeholder="請輸入"></ElInput>
        </el-form-item>
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