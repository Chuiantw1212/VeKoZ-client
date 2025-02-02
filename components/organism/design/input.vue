<template>
    <div class="design">
        <!-- 檢視用 -->
        <template v-if="!props.isDesigning">
            <el-form-item :label="customDesign.controllable?.label">
                <el-input :placeholder="placeholder"></el-input>
            </el-form-item>
        </template>
        <!-- 編輯用 -->
        <template v-else-if="customDesign.controllable">
            <MoleculeCustomToolbar @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
                @moveDown="emit('moveDown')">
                <div class="design__item">
                    <label class="item__label">
                        <input v-model="customDesign.controllable.label" class="label__input" placeholder="請輸入欄位名稱">
                    </label>
                    <el-input :placeholder="placeholder" v-model="customDesign.controllable.value"
                       ></el-input>
                </div>
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
                name: 'input',
                controllable: {
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