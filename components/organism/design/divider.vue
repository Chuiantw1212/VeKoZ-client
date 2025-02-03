<template>
    <div class="design">
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
                        <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
                    </el-divider>
                </template>
            </MoleculeCustomToolbar>
        </template>
    </div>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';

const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'divider',
                mutable: {
                    label: ''
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
        type: 'divider',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

}, { immediate: true })
</script>
<style lang="scss" scoped>
.design {
    .design__item {
        display: flex;

        .item__label {
            display: flex;
            padding-right: 12px;

            .label__input {
                outline: none;
            }
        }
    }
}
</style>