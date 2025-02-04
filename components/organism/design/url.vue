<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-input v-model="customDesign.mutable.name" placeholder="微課室" :disabled="disabled"></el-input>
            <el-input class="design__mt" v-model="customDesign.mutable.url" placeholder="https://venonia.com"
                :disabled="disabled"></el-input>
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
                <el-input v-model="customDesign.mutable.name" placeholder="微課室" :disabled="disabled"></el-input>
                <el-input class="design__mt" v-model="customDesign.mutable.url" placeholder="https://venonia.com"
                    :disabled="disabled"></el-input>
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
                name: 'url',
                mutable: {
                    label: '超連結'
                }
            }
        }
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '連結與文字僅在編輯時類似，在參加者看來會有所不同'
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
        name: 'url',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

}, { immediate: true })
</script>
<style lang="scss" scoped>
.design__mt {
    margin-top: 12px;
}
</style>