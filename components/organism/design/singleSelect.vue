<template>
    <!-- 檢視與編輯用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-input :placeholder="placeholder"></el-input>
        </el-form-item>
    </template>
    <!-- 樣板編輯專用 -->
    <template v-else-if="customDesign.mutable" :loading="isLoading">
        <MoleculeDesignToolbar @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')" @mouseenter="emit('mouseenter')" @mouseout="emit('mouseout')">
            <div class="design__item">
                <label class="item__label">
                    <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                        placeholder="欄位名稱"></el-input>
                </label>
                <!-- <el-select v-model="customDesign.mutable.value" :placeholder="placeholder" :clearable="true"
                    :allow-create="true">
                    <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id" />
                </el-select> -->
            </div>
        </MoleculeDesignToolbar>
    </template>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart', 'mouseenter', 'mouseout'])
const isLoading = ref(false)
const repoUI = useRepoUI()
const customDesign = defineModel('modelValue', {
    type: Object,
    default: function () {
        return {
            type: 'singleSelect',
            mutable: {
                label: ''
            }
        }
    }
})
const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
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
        default: () => {
            return []
        }
    },
    labelKey: {
        type: String,
        default: 'label',
    },
    valueKey: {
        type: String,
        default: 'value',
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})

// Hooks
onMounted(() => {
    setDefaultValue()
    getSelectOptions()
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

// methods
function setDefaultValue() {
    if (customDesign.value?.mutable) {
        return
    }
    const defaultValue = {
        type: 'singleSelect',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}

async function getSelectOptions() {
    // const result = await repoOrganization.getOrganizationList()
    // organizationList.value = result
}
</script>
