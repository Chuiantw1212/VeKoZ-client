<template>
    <div class="design">
        <!-- 檢視用 -->
        <template v-if="!props.isDesigning">
            <el-form-item :label="customDesign.mutable?.label">
                <el-input :placeholder="placeholder"></el-input>
            </el-form-item>
        </template>
        <!-- 編輯用 -->
        <template v-else-if="customDesign.mutable">
            <MoleculeCustomToolbar @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
                @moveDown="emit('moveDown')">
                <div class="design__item">
                    <label class="item__label">
                        <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
                    </label>
                    <el-select v-model="customDesign.mutable.value" :placeholder="placeholder" :clearable="true"
                        :allow-create="true">
                        <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id" />
                    </el-select>
                </div>
            </MoleculeCustomToolbar>
        </template>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
import { computed, watch } from 'vue';
const repoOrganization = useRepoOrganization()
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'singleSelect',
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
        default: '請輸入'
    },
    options: {
        type: Array,
        default: () => []
    },
})


const organizationList = ref<IOrganization[]>([])

// Hooks
onMounted(() => {
    getSelectOptions()
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
        type: 'singleSelect',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem

}, { immediate: true })

// Methods
async function getSelectOptions() {
    // const result = await repoOrganization.getOrganizationList()
    // organizationList.value = result
}

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