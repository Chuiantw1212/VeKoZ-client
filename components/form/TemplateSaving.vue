<template>
    <el-form ref="saveTemplateRef" :model="form">
        <el-form-item label="模板名稱" :required="true" prop="name">
            <el-input v-model="form.name" placeholder="請輸入另存的模板名稱"></el-input>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus';
const saveTemplateRef = ref<FormInstance>()
const form = defineModel('modelValue', {
    default: {
        name: ''
    }
})

async function validate() {
    const result = await saveTemplateRef.value?.validate()
    return result
}

defineExpose({
    validate,
})
</script>