<template>
    <div class="index">
        <el-form class="index__form" :model="form" label-width="auto">
            <el-row align="middle">
                <el-col :span="4">
                    <el-form-item label="">
                        <img style="width: 34px" src="@/assets/logo.png" alt="Element logo" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="">
                        <el-input :prefix-icon="Search" placeholder="搜尋"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  :gutter="20">
                <el-col :span="12">
                    <el-form-item label="日期">
                        <el-date-picker v-model="dateRange" type="date" placeholder="開始日" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="~">
                        <el-date-picker v-model="dateRange" type="date" placeholder="結束日" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="時段">
                        <el-select placeholder="請選擇" :clearable="true" :multiple="true">
                            <el-option v-for="(item, index) in periodOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="地點">
                        <el-select placeholder="請選擇" :clearable="true" :multiple="true">
                            <el-option v-for="(item, index) in locationTypeOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col> -->
            </el-row>
        </el-form>
        <el-row :gutter="20">
            <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                <MoleculeVenoniaCard class="index__card">
                    <template #default>
                        <img src="https://storage.googleapis.com/public.venonia.com/eventDesign/imKB1tyxFBlthb4fBbaG/banner.png"
                            style="width: 100%" />
                    </template>
                    <template #footer>
                        <span>
                            {{ item.name }}
                        </span>
                        <span class="footer__offer">
                            NTD 250
                        </span>
                    </template>
                </MoleculeVenoniaCard>
            </el-col>
            <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                <MoleculeVenoniaCard class="index__card">
                    <template #default>
                        <img src="https://storage.googleapis.com/public.venonia.com/eventDesign/imKB1tyxFBlthb4fBbaG/banner.png"
                            style="width: 100%" />
                    </template>
                    <template #footer>
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
import { Search, } from '@element-plus/icons-vue'
import type { IEvent } from '~/types/event';
const id = ref<string>(crypto.randomUUID())
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const eventList = ref<IEvent[]>([])
const dateRange = ref([])
const form = ref<IEvent>({
    startDate: new Date(),
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
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)
    form.value.startDate = startOfTheMonth
    getEventList()
    window.addEventListener('resize', setColumnSpan)
    setColumnSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setColumnSpan)
})

// Methods
function setColumnSpan() {
    repoUI.debounce(id.value, () => {
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
    const result = await repoEvent.getEventList({
        ...form.value,
        isPublic: true,
    })
    eventList.value = result
}


</script>

<style lang="scss" scoped>
.index__form {
    position: fixed;
    top: 0px;
    left: 0px;
    width: calc(100vw - 40px); // -padding x2
    z-index: 1;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 2px -2px gray;
}

.index__row {
    margin-bottom: 20px;
}

.footer__offer {
    white-space: nowrap;
}
</style>