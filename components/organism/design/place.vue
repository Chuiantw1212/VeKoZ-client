<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label">
        <el-select v-if="customDesign.mutable" v-model="customDesign.mutable.locationName" :placeholder="placeholder"
            :clearable="true" :disabled="disabled" @change="setLocationAddress($event)">
            <el-option v-for="(item, index) in placeList" :key="index" :label="item.name" :value="String(item.name)" />
        </el-select>
        <el-input v-if="customDesign.mutable" class="design__mt" placeholder="地址"
            :model-value="customDesign.mutable.locationAddress" :disabled="true"></el-input>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" @dragstart="emit('dragstart')"
        @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
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
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { IPlace } from '~/types/place'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const repoPlace = useRepoPlace()
const isLoading = ref(false)
const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'place',
        mutable: {
            label: '空間地點',
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
    setDefaultValue()
    getPlaceList()
})
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
        type: 'place',
        mutable: {
            label: '空間地點',
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

function setLocationAddress(locationName: string) {
    if (locationName) {
        const selectedItem = placeList.value.find(item => {
            return item.name === locationName
        })
        if (selectedItem) {
            if (customDesign.value.mutable) {
                customDesign.value.mutable.locationAddress = selectedItem.address
                customDesign.value.mutable.locatoinRegion = selectedItem.addressRegion
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
    margin-top: 4px;
}
</style>