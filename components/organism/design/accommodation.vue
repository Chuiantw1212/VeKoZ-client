<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <el-select v-model="customDesign.mutable.locationName" :placeholder="placeholder" :clearable="true"
                @change="setLocationAddress($event)">
                <el-option v-for="(item, index) in accommodationList" :key="index" :label="item.name"
                    :value="String(item.name)" />
            </el-select>
            <el-input class="design__mt" :model-value="customDesign.mutable.locationAddress"
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
                    @change="setLocationAddress($event)">
                    <el-option v-for="(item, index) in accommodationList" :key="index" :label="item.name"
                        :value="String(item.name)" />
                </el-select>
                <el-input class="design__mt" :model-value="customDesign.mutable.locationAddress"
                    :disabled="true"></el-input>
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
import type { IAccommodation } from '~/types/accommodation'
import { computed, watch } from 'vue';
const repoAccommodation = useRepoAccommodation()
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'accommodation',
                mutable: {
                    label: '',
                    locationName: '',
                    locationAddress: '',
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
        default: '請選擇空間地點'
    }
})


const accommodationList = ref<IAccommodation[]>([])

// Hooks
onMounted(() => {
    getAccommodationList()
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
        type: 'accommodation',
        mutable: {
            label: '',
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
}, { immediate: true, deep: true })

// Methods
function setLocationAddress(locationName: string) {
    if (locationName) {
        const selectedItem = accommodationList.value.find(item => {
            return item.name === locationName
        })
        console.log({
            selectedItem
        })
        if (selectedItem) {
            customDesign.value.mutable.locationAddress = selectedItem.address
        }
    }
}

async function getAccommodationList() {
    const result = await repoAccommodation.getAccommodationList()
    accommodationList.value = result
}

</script>

<style lang="scss" scoped>
.design__mt {
    margin-top: 12px;
}
</style>