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
                    <el-select v-model="customDesign.controllable.value" placeholder="請選擇現有組織成員" :multiple="true"
                        :allow-create="true" :disabled="isDesigning">
                        <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                            :value="String(item.id)" />
                    </el-select>
                </div>
            </MoleculeCustomToolbar>
        </template>
    </div>
</template>
<script setup lang="ts">
import type { IOrganizationMember } from '~/types/organization'
import { computed, watch } from 'vue';
const repoOrganizationMember = useRepoOrganization()
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                name: 'organizationMember',
                controllable: {
                    label: '組織成員'
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


const organizationList = ref<IOrganizationMember[]>([])

// Hooks
onMounted(() => {
    getOrganizationMemberList()
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

// Methods
async function getOrganizationMemberList() {
    const result = await repoOrganizationMember.getOrganizationMemberList()
    organizationList.value = result
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