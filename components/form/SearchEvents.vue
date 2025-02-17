<template>
    <el-form ref="formRef" class="index__form" :class="{ 'margin--header': repoUI.isLarge }" :model="form"
        label-width="auto">
        <el-row align="middle" justify="space-between">
            <el-col :span="20">
                <el-form-item label="搜尋">
                    <el-input v-model="form.keywords" :prefix-icon="Search" placeholder="清輸入關鍵字" :maxlength="30"
                        @change="getEventList()"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <!-- <el-form-item> -->
                <div>
                    <el-button :icon="Filter" text @click="openAdvanced = !openAdvanced">

                    </el-button>
                </div>
                <!-- </el-form-item> -->
            </el-col>
            <el-row v-if="openAdvanced" align="middle" justify="space-between">
                <el-col :span="12">
                    <el-form-item label="開始" :required="true" prop="startDate">
                        <el-date-picker v-model="form.startDate" type="date" placeholder="開始日" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="結束" prop="endDate">
                        <el-date-picker v-model="form.endDate" type="date" placeholder="結束日" :clearable="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="時段">
                        <el-select v-model="form.timeFrame" placeholder="請選擇" :clearable="true">
                            <el-option v-for="(item, index) in periodOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地點">
                        <el-select v-model="form.location" placeholder="請選擇">
                            <el-option v-for="(item, index) in taiwanPlaces" :key="index" :label="`${item.label}`"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-row>
    </el-form>
</template>
<script setup lang="ts">
import { Filter, Search, } from '@element-plus/icons-vue'
import type { IEvent } from '~/types/event';
const emit = defineEmits(['change'])
const id = ref<string>(crypto.randomUUID())
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const repoMeta = useRepoMeta()
const openAdvanced = ref<boolean>(false)

// Data
const eventList = ref<IEvent[]>([])
const startDate = new Date()
const currentMonth = new Date().getMonth()
const endDate = new Date()
endDate.setMonth(currentMonth + 1)
const formRef = ref()
const form = ref({
    keywords: '',
    startDate: startDate,
    endDate: endDate,
    timeFrame: '',
    location: '',
})

// Search form data
const taiwanPlaces = ref<any[]>([])
const periodOptions = ref([
    {
        label: '上午',
        value: 'isMorning'
    },
    {
        label: '下午',
        value: 'isAfternoon',
    },
    {
        label: '晚上',
        value: 'isEvening'
    }
])

// Hooks
onMounted(() => {
    getEventList()
    getMetaSelectById()
    window.addEventListener('resize', setSearchFormSpan)
    setSearchFormSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setSearchFormSpan)
})

// Methods
async function getMetaSelectById() {
    const result = await repoMeta.getMetaSelectById('taiwan')
    taiwanPlaces.value = result
}

const searchSpan = ref<number>(24)
const whereFieldSpan = ref<number>(12)
function setSearchFormSpan() {
    repoUI.debounce(`${id.value}-form`, () => {
        searchSpan.value = 24
        whereFieldSpan.value = 24
        if (repoUI.isSmall) {
            searchSpan.value = 9
            whereFieldSpan.value = 7
        }
    })
}

async function getEventList() {
    const isValid = await formRef.value.validate()
    if (!isValid) {
        return
    }

    repoUI.debounce(`${id.value}-search`, async () => {
        const result = await repoEvent.getEventList({
            ...form.value,
            isPublic: true,
        })
        eventList.value = result
    }, 500)

}

async function validate() {
    return await formRef.value.validate()
}

defineExpose({
    validate
})
</script>