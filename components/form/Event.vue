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
            <el-col :span="12">
                <el-form-item label="開始時間">
                    <el-date-picker v-model="form.startDate" type="datetime" placeholder="請選擇日期與時間" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="結束時間">
                    <el-date-picker v-model="form.endDate" type="datetime" placeholder="請選擇日期與時間" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="線下地址">
            <!-- 這邊只是選擇，送出資料時並不會連結原本的資料 -->
            <el-select v-model="form.locationName" @change="setLocationAddress($event)" placeholder="請選擇">
                <el-option v-for="item in tableData" :key="item.uid" :label="item.name" :value="item.name" />
            </el-select>
        </el-form-item>
        <el-form-item label=" ">
            <el-input :model-value="form.locationAddress" placeholder="請選擇線下地址" :disabled="true" />
        </el-form-item>
        <el-form-item label="線上連結">
            <el-input v-model="form.virtualLocationUrl" placeholder="請輸入" />
        </el-form-item>
        <el-divider>
            活動描述
        </el-divider>
        <el-form-item label="">
            <AtomVenoniaEditor v-model="form.description">
            </AtomVenoniaEditor>
        </el-form-item>
        <slot name="eventTodos"></slot>
    </el-form>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
const emit = defineEmits(['update:modelValue'])
const repoOrganization = useRepoOrganization()
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

const tableData = [
    {
        uid: '1',
        name: '齊文藝 2F-Q 安靜區大桌座位',
        address: '台北車站南陽街32號',
        description: '預定須知',
    },
    {
        uid: '2',
        name: 'TCCC台灣文創訓練中心',
        address: '台灣台北市中山區長安東路一段27號2樓',
        description: '預定須知',
    },
]

const organizationList = ref<IOrganization[]>([])

// methods
function setLocationAddress(locationName: string) {
    if (locationName) {
        const selectedItem = tableData.find(item => {
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

onMounted(() => {
    getOrganizationList()
})
</script>