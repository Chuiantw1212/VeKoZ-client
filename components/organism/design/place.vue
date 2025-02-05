<template>
    <!-- 檢視用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label">
        <el-select v-model="customDesign.mutable.locationName" :placeholder="placeholder" :clearable="true"
            :disabled="disabled" @change="setLocationAddress($event)">
            <el-option v-for="(item, index) in placeList" :key="index" :label="item.name" :value="String(item.name)" />
        </el-select>
        <el-input class="design__mt" placeholder="地址" :model-value="customDesign.mutable.locationAddress"
            :disabled="true"></el-input>
    </el-form-item>
    <!-- 編輯用 -->
    <MoleculeCustomToolbar v-else-if="customDesign.mutable" :loading="isLoading" @dragstart="emit('dragstart')"
        @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
        </template>
        <template v-slot:default>
            <el-select v-model="customDesign.mutable.locationName" :placeholder="placeholder" :clearable="true"
                :disabled="disabled" @change="setLocationAddress($event)">
                <el-option v-for="(item, index) in placeList" :key="index" :label="item.name"
                    :value="String(item.name)" />
            </el-select>
            <el-input class="design__mt" placeholder="地址" :model-value="customDesign.mutable.locationAddress"
                :disabled="true"></el-input>
        </template>
    </MoleculeCustomToolbar>
</template>
<script setup lang="ts">
import type { IPlace } from '~/types/place'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const repoPlace = useRepoPlace()
const isLoading = ref(false)
const repoUI = useRepoUI()
interface IModel {
    type: 'place',
    mutable: {
        label: string,
        locationName: string,
        locationAddress: string,
    }
}
const customDesign = defineModel<IModel>('modelValue', {
    default: {
        type: 'place',
        mutable: {
            label: '空間地點',
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
    placeholder: {
        type: String,
        default: '請選擇空間地點'
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})
const placeList = ref<IPlace[]>([])

// Hooks
onMounted(() => {
    getPlaceList()
})


watch(() => customDesign.value, (newValue: any) => {
    if (newValue?.mutable) {
        return
    }
    const defaultValue = {
        type: 'place',
        mutable: {
            label: '空間地點',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
}, { deep: true })

// Methods
function setLocationAddress(locationName: string) {
    if (locationName) {
        const selectedItem = placeList.value.find(item => {
            return item.name === locationName
        })
        if (selectedItem) {
            if (customDesign.value) {
                customDesign.value.mutable.locationAddress = selectedItem.address
            }
        }
    }
}

async function getPlaceList() {
    const result = await repoPlace.getPlaceList()
    placeList.value = result
}

// methods
async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    const id = templateDesign.id ?? crypto.randomUUID()
    debouncePatchEventTemplateDesign(id, templateDesign)
}

const debouncePatchEventTemplateDesign = repoUI.debounce(async (templateDesign: any) => {
    await props.onchange(templateDesign)
    isLoading.value = false
})
</script>
<style lang="scss" scoped>
.design__mt {
    margin-top: 12px;
}
</style>