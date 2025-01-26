<template>
    <el-form>
        <el-form-item label="單位名稱">
            <ElInput v-model="organization.name" placeholder="請輸入"></ElInput>
        </el-form-item>
        <el-form-item label="Logo">
            <AtomAvatarUploader v-model="organization.logo" accept="image/*"></AtomAvatarUploader>
        </el-form-item>
        <el-form-item label="描述">
            <ElInput v-model="organization.description" placeholder="請輸入"></ElInput>
        </el-form-item>
        <el-divider>
            成員管理
        </el-divider>
        <p>先案右下確認後，再於主畫面新增/管理成員。</p>
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