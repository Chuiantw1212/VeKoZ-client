<template>
    <!-- 檢視用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label">
        <AtomVenoniaEditor v-model="customDesign.mutable.value" :placeholder="placeholder">
        </AtomVenoniaEditor>
    </el-form-item>
    <!-- 編輯用 -->
    <MoleculeCustomToolbar v-else-if="customDesign.mutable" :loading="isLoading" :allowDelete="allowDelete"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:default>
            <AtomVenoniaEditor v-model="customDesign.mutable.value" :placeholder="placeholder">
            </AtomVenoniaEditor>
        </template>
    </MoleculeCustomToolbar>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()
interface IModel {
    type: 'editor',
    mutable: {
        label: string,
        value: string,
    }
}

const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'editor',
        mutable: {
            label: ''
        }
    }
})

const props = defineProps({
    isDesigning: {
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
        type: 'editor',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

})
</script>
