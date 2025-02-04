<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-divider>
            {{ customDesign.mutable.label }}
        </el-divider>
    </template>
    <!-- 編輯用 -->
    <template v-else-if="customDesign.mutable">
        <MoleculeCustomToolbar @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')">
            <template v-slot:default>
                <el-divider>
                    <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱"
                        :disabled="disabled">
                </el-divider>
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
interface IModel {
    type: 'divider',
    mutable: {
        label: string,
        value: string[],
    }
}

const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'divider',
        mutable: {
            label: '分隔線'
        }
    }
})

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'divider',
                mutable: {
                    label: '分隔線'
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

watch(() => customDesign.value, (newValue) => {
    if (newValue?.mutable) {
        return
    }
    const defaultValue = {
        type: 'divider',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

}, { immediate: true })
</script>
