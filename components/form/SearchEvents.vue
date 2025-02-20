<template>
    <el-form ref="formRef" class="index__form" :class="{ 'margin--header': repoUI.isLarge }" :model="form"
        :rules="searchFormRules" label-width="auto">
        <!-- {{repoUI.isLarge}} -->
        <el-row align="middle" justify="space-between">
            <el-col :span="repoUI.isLarge ? 24 : 20">
                <el-form-item label="搜尋" :class="{ 'mb-0': !showAdvanced }">
                    <el-input v-model="form.keywords" :prefix-icon="Search" placeholder="清輸入關鍵字" :maxlength="30"
                        :clearable="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col v-if="!repoUI.isLarge" :span="4">
                <div class="form__btnWrap" :class="{ 'mb-0': !showAdvanced }">
                    <el-button :icon="Filter" text @click="showAdvanced = !showAdvanced">

                    </el-button>
                </div>
            </el-col>
            <!-- <el-row v-if="showAdvanced" align="middle" justify="space-between"> -->
            <template v-if="showAdvanced">
                <el-col :span="whereFieldSpan">
                    <el-form-item label="起始日" prop="startDate">
                        <el-date-picker v-model="form.startDate" type="date" placeholder="開始日" />
                    </el-form-item>
                </el-col>
                <el-col :span="whereFieldSpan">
                    <el-form-item label="結束日" prop="endDate">
                        <el-date-picker v-model="form.endDate" type="date" placeholder="結束日" :clearable="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="whereFieldSpan">
                    <el-form-item label="開始時間">
                        <el-select v-model="form.startHour" placeholder="請選擇" :clearable="true">
                            <el-option v-for="(item, index) in periodOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="whereFieldSpan">
                    <el-form-item label="城市">
                        <el-select v-model="form.locationAddressRegion" placeholder="請選擇" :clearable="true">
                            <el-option v-for="(item, index) in taiwanPlaces" :key="index" :label="`${item.label}`"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="whereFieldSpan">
                    <el-form-item class="mb-0" label="線上活動">
                        <!-- <el-select v-model="form.addressRegion" placeholder="請選擇">
                            <el-option v-for="(item, index) in taiwanPlaces" :key="index" :label="`${item.label}`"
                                :value="item.value" />
                        </el-select> -->
                        <el-switch v-model="form.hasVirtualLocation" inline-prompt active-text="包含"
                            inactive-text="排除" />
                    </el-form-item>
                </el-col>
            </template>
            <!-- </el-row> -->
        </el-row>
    </el-form>
</template>
<script setup lang="ts">
import { Filter, Search, } from '@element-plus/icons-vue'
const emit = defineEmits(['change'])
const id = ref<string>(crypto.randomUUID())
const repoUI = useRepoUI()
const repoMeta = useRepoMeta()
const showAdvanced = ref<boolean>(false)

// Data
const formRef = ref()
const form = defineModel('modelValue', {
    type: Object,
    required: true,
})

// Search form data
const taiwanPlaces = ref<any[]>([])
const periodOptions = ref([
    {
        label: '上午',
        value: 6
    },
    {
        label: '下午',
        value: 12,
    },
    {
        label: '晚上',
        value: 18
    }
])

const searchFormRules = {
    startDate: { required: true, message: '開始為必填' }
}

// Hooks
onMounted(() => {
    getMetaSelectById()
    window.addEventListener('resize', setSearchFormSpan)
    setSearchFormSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setSearchFormSpan)
})
watch(() => form.value, () => {
    emit('change')
}, { deep: true })
watch(() => repoUI.isLarge, (newValue) => {
    if (newValue) {
        showAdvanced.value = true
    } else {
        showAdvanced.value = false
    }
}, { immediate: true })

// Methods
async function getMetaSelectById() {
    const result = await repoMeta.getMetaSelectById('taiwan')
    taiwanPlaces.value = result
}

// const searchSpan = ref<number>(24)
const whereFieldSpan = ref<number>(12)
function setSearchFormSpan() {
    repoUI.debounce(`${id.value}-form`, () => {
        // searchSpan.value = 24
        whereFieldSpan.value = 24
        if (repoUI.isSmall) {
            whereFieldSpan.value = 12
        }
        if (repoUI.isMedium) {
            whereFieldSpan.value = 12
        }
        if (repoUI.isLarge) {
            whereFieldSpan.value = 24
        }
    })
}

async function validate() {
    return await formRef.value.validate()
}

defineExpose({
    validate
})
</script>
<style lang="scss" scoped>
.index__form {
    width: 100%;
}

.form__btnWrap {
    margin-bottom: 18px;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
}

.mb-0 {
    margin-bottom: 0px;
}
</style>