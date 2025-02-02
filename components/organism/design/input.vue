<template>
    <div>
        <!-- 檢視用 -->
        <template v-if="props.readonly">
            <el-form-item :label="customDesign.controllable?.label">
                <el-input :readonly="readonly" :placeholder="placeholder"></el-input>
            </el-form-item>
        </template>
        <!-- 編輯用 -->
        <template v-else>
            <MoleculeCustomToolbar @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
                <el-form-item :label="customDesign.controllable?.label">
                    <el-input :readonly="readonly" :placeholder="placeholder"></el-input>
                </el-form-item>
            </MoleculeCustomToolbar>
        </template>
    </div>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';

const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                name: 'input',
            }
        }
    },
    readonly: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '請輸入'
    }
})

const customDesign = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
watch(() => customDesign.value, (newValue) => {
    if (newValue.controllable) {
        return
    }
    const defaultValue = {
        name: 'input',
        controllable: {
            label: '欄位名稱',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

}, { immediate: true })
</script>