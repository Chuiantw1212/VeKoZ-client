<template>
    <el-form :model="form" label-width="auto">
        <el-form-item label="名稱">
            <el-input v-model="form.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="主辦單位">
            <el-select v-model="form.organizer" placeholder="請選擇現有組織">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <slot name="eventActor"></slot>
        <el-row>
            <el-col :span="24">
                <el-form-item label="時間日期">
                    <el-date-picker v-model="eventDates" type="datetimerange" placeholder="請選擇日期與時間"
                        start-placeholder="先選日期再選時間" end-placeholder="先選日期再選時間" @change="setEventDate()" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="線下地址">
            <!-- 這邊只是選擇，送出資料時並不會連結原本的資料 -->
            <el-select v-model="form.locationName" @change="setLocationAddress($event)" placeholder="請選擇">
                <el-option v-for="item in accommodationList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
        </el-form-item>
        <el-form-item label=" ">
            <el-input :model-value="form.locationAddress" placeholder="請選擇線下地址" :disabled="true" />
        </el-form-item>
        <el-form-item label="線上連結">
            <el-input v-model="form.virtualLocationUrl" placeholder="請輸入" />
        </el-form-item>
        <el-divider>活動描述</el-divider>
        <el-form-item label="">
            <AtomVenoniaEditor v-model="form.description">
            </AtomVenoniaEditor>
        </el-form-item>
        <slot name="eventTodos"></slot>
    </el-form>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
import type { IAccommodation } from '~/types/accommodation'
const emit = defineEmits(['update:modelValue'])
const repoOrganization = useRepoOrganization()
const repoAccommodation = useRepoAccommodation()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => { }
    }
})
const form = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})


const eventDates = ref<string[]>([])
const accommodationList = ref<IAccommodation[]>([])
const organizationList = ref<IOrganization[]>([])


// Hooks
watch(() => form.value, (newValue) => {
    eventDates.value[0] = newValue.startDate
    eventDates.value[1] = newValue.endDate
}, { immediate: true })
onMounted(() => {
    getOrganizationList()
    getAccommodationList()
})

// methods
function setEventDate() {
    form.value.startDate = eventDates.value[0]
    form.value.endDate = eventDates.value[1]
}

function setLocationAddress(locationName: string) {
    if (locationName) {
        const selectedItem = accommodationList.value.find(item => {
            return item.name === locationName
        })
        if (selectedItem) {
            form.value.locationAddress = selectedItem.address
        }
    }
}

async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}

async function getAccommodationList() {
    const result = await repoAccommodation.getAccommodationList()
    accommodationList.value = result
}
</script>