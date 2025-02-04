<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-select v-model="customDesign.mutable.locationName" :placeholder="placeholder" :clearable="true"
                :disabled="disabled" @change="setLocationAddress($event)">
                <el-option v-for="(item, index) in placeList" :key="index" :label="item.name"
                    :value="String(item.name)" />
            </el-select>
            <el-input class="design__mt" placeholder="地址" :model-value="customDesign.mutable.locationAddress"
                :disabled="true"></el-input>
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
</template>
<script setup lang="ts">
import type { IPlace } from '~/types/place'
const repoPlace = useRepoPlace()
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
interface IModel {
    type: 'place',
    mutable: {
        label: string,
        locationName: string,
        locationAddress: string,
    }
}
const customDesign = defineModel<IModel>('modelValue', {
    required: true,
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
}, { immediate: true, deep: true })

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

</script>
<style lang="scss" scoped>
.design__mt {
    margin-top: 12px;
}
</style>