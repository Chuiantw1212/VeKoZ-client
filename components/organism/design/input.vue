<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-input v-model="customDesign.mutable.value" :placeholder="placeholder" :disabled="disabled"></el-input>
        </el-form-item>
    </template>
    <!-- 編輯用 -->
    <template v-else-if="customDesign.mutable">
        <MoleculeCustomToolbar :allowDelete="allowDelete" @dragstart="emit('dragstart')" @remove="emit('remove')"
            @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
            <template v-slot:label>
                <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
            </template>
            <template v-slot:default>
                <el-input :placeholder="placeholder" v-model="customDesign.mutable.value"
                    :disabled="disabled"></el-input>
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
interface IModel {
    type: 'input',
    mutable: {
        label: string,
        value: string,
    }
}
const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'input',
        mutable: {
            label: '任意文字'
        }
    }
})
const props = defineProps({
    isDesigning: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    allowDelete: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: '請輸入'
    }
})
watch(() => customDesign.value, (newValue) => {
    if (newValue?.mutable) {
        return
    }
    const defaultValue = {
        type: 'input',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
}, { immediate: true })
</script>
