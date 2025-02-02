<template>
    <el-form class="form" label-width="auto">
        <el-form-item label="活動名稱" :required="true">
            <el-input v-model="eventTemplate.name" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="主辦單位" :required="true">
            <el-select v-model="eventTemplate.organizer" placeholder="請選擇現有組織">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="講者/主持" :required="true">
            <el-select v-model="eventTemplate.eventActors" :placeholder="`請選擇組織成員`">
                <el-option v-for="(item, index) in organizationMemberList" :key="index" :label="item.name"
                    :value="String(item.id)" />
            </el-select>
        </el-form-item>
        <el-form-item label="時間日期" :required="true">
            <el-date-picker v-model="eventTemplate.dates" type="datetimerange" placeholder="請輸入"></el-date-picker>
        </el-form-item>
        <el-form-item label="線下地址">
            <el-select placeholder="請選擇現有空間或地點">
                <el-option v-for="item in accommodationList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
        </el-form-item>
        <el-form-item label="線上連結">
            <el-input v-model="eventTemplate.virtualLocationUrl" placeholder="請輸入" />
        </el-form-item>
        <el-divider>活動描述</el-divider>
        <el-form-item label="">
            <AtomVenoniaEditor v-model="eventTemplate.description"></AtomVenoniaEditor>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
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
const organizationMemberList = ref<IOrganizationMember[]>([])

// methods
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}

async function getAccommodationList() {
    const result = await repoAccommodation.getAccommodationList()
    accommodationList.value = result
}


async function getOrganizationMemberList() {
    // const result = await repoOrganization.getOrganizationMemberList()
    // organizationMemberList.value = result
}

onMounted(() => {
    getAccommodationList()
    getOrganizationList()
    getOrganizationMemberList()
})
</script>
<style lang="scss" scoped>
.form {
    .form__item {
        width: 100%;
    }
}
</style>