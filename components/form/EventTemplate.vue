<template>
    <el-form class="form">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-form-item label="活動名稱">
                    <el-input v-model="eventTemplate.name" placeholder="請輸入"></el-input>
                </el-form-item>
                <el-form-item label="主辦單位">
                    <el-select v-model="eventTemplate.organizer" placeholder="請選擇現有組織">
                        <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="時間日期">
                    <el-date-picker v-model="eventTemplate.dates" type="datetimerange"
                        placeholder="請輸入"></el-date-picker>
                </el-form-item>
                <el-form-item label="線下地址">
                    <!-- 這邊只是選擇，送出資料時並不會連結原本的資料 -->
                    <el-select placeholder="請選擇">
                        <el-option v-for="item in accommodationList" :key="item.id" :label="item.name"
                            :value="item.name" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-divider>活動描述</el-divider>
        <el-form-item label="">
            <AtomVenoniaEditor v-model="eventTemplate.description"></AtomVenoniaEditor>
        </el-form-item>
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
        default: () => {
            return {}
        }
    }
})

const eventTemplate = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

const organizationList = ref<IOrganization[]>([])
const accommodationList = ref<IAccommodation[]>([])

// methods
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}

async function getAccommodationList() {
    const result = await repoAccommodation.getAccommodationList()
    accommodationList.value = result
}

onMounted(() => {
    getAccommodationList()
    getOrganizationList()
})
</script>
<style lang="scss" scoped>
.form {
    .form__item {
        width: 100%;
    }
}
</style>