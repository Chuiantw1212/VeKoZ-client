<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-input-number v-model="customDesign.mutable.value" :placeholder="placeholder"></el-input-number>
        </el-form-item>
    </template>
    <!-- 編輯用 -->
    <template v-else-if="customDesign.mutable">
        <MoleculeCustomToolbar @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')">
            <template v-slot:label>
                <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
            </template>
            <template v-slot:default>
                <el-input-number :placeholder="placeholder" v-model="customDesign.mutable.value"></el-input-number>
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';

const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'number',
                mutable: {
                    label: '數字',
                    value: 1000
                }
            }
        }
    },
    isDesigning: {
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
    if (newValue.mutable) {
        return
    }
    const defaultValue = {
        type: 'number',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

}, { immediate: true })
</script>
