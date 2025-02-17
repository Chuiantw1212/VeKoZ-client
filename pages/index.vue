<template>
    <div class="index">
        <el-form ref="formRef" class="index__form" :class="{ 'margin--header': repoUI.isLarge }" :model="form"
            label-width="auto">
            <el-row :gutter="20" align="middle" justify="space-between">
                <el-col :span="20">
                    <el-form-item label="搜尋">
                        <el-input v-model="form.keywords" :prefix-icon="Search" placeholder="清輸入關鍵字" :maxlength="30"
                            @change="getEventList()"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button :icon="Filter" text>

                        </el-button>
                    </el-form-item>
                </el-col>
                <el-row align="middle" justify="space-between">
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
                            <el-select placeholder="請選擇" :clearable="true" :multiple="true">
                                <el-option v-for="(item, index) in periodOptions" :key="index" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地點">
                            城市網址參數
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-row>
        </el-form>
        <el-row :gutter="20" class="index__eventList" :class="{ 'mt--120': !repoUI.isMedium }">
            <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                <MoleculeVenoniaCard class="index__card">
                    <template #default>
                        <NuxtLink :to="`/event/${item.id}`">
                            <img :src="item.image" style="width: 100%" />
                        </NuxtLink>
                    </template>
                    <template #footer>
                        <span>
                            台北市
                        </span>
                        <span>
                            {{ item.name }}
                        </span>
                        <span class="footer__offer">
                            NTD 250
                        </span>
                    </template>
                </MoleculeVenoniaCard>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { Filter, Search, } from '@element-plus/icons-vue'
import type { IEvent } from '~/types/event';
const id = ref<string>(crypto.randomUUID())
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const eventList = ref<IEvent[]>([])
const dateRange = ref([])
const startDate = new Date()
const currentMonth = new Date().getMonth()
const endDate = new Date()
endDate.setMonth(currentMonth + 1)
const formRef = ref()
const form = ref({
    keywords: '',
    startDate: startDate,
    endDate: endDate,
})
const columnSpan = ref<number>(8)
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

const locationTypeOptions = ref([
    {
        label: '線上',
        value: 'online'
    },
    {
        label: "線下",
        value: 'offline'
    }
])

// Hooks
onMounted(() => {
    getEventList()
    window.addEventListener('resize', setColumnSpan)
    setColumnSpan()

    window.addEventListener('resize', setSearchFormSpan)
    setSearchFormSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setColumnSpan)
    window.removeEventListener('resize', setSearchFormSpan)
})

// Methods
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

function setColumnSpan() {
    repoUI.debounce(`${id.value}-col`, () => {
        columnSpan.value = 24
        if (repoUI.isSmall) {
            columnSpan.value = 12
        }
        if (repoUI.isXLarge) {
            columnSpan.value = 8
        }
        if (repoUI.isXXLarge) {
            columnSpan.value = 6
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


</script>

<style lang="scss" scoped>
.index__eventList {
    margin-top: 60px; // form height;
}

.index__form {
    position: fixed;
    top: 0px;
    left: 50%;
    transform: translate(-50%);
    width: calc(100vw - 40px); // -padding x2
    z-index: 1;
    // background-color: rgba(255, 255, 255, 0.5);
    background-color: white;
    padding: 20px;
    padding-bottom: 0px;
    // box-shadow: 0 4px 2px -2px gray;
    border-bottom: 1px solid lightgrey;
    // border: 1px solid lightgray;
    // max-width: 720px;
}

.margin--header {
    margin-top: 60px;
}

.mt--120 {
    margin-top: 120px;
}

.index__row {
    margin-bottom: 20px;
}

.footer__offer {
    white-space: nowrap;
}
</style>