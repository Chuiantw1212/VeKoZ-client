<template>
    <div class="eventTemplate">
        <h1>活動套版管理</h1>
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card>
                    <template #header>
                        自定義欄位
                    </template>
                    <el-form>
                        <div class="preview__template"
                            :class="{ 'preview__template--outline': template.isDragging }">
                            <el-form-item label="請拖曳至此">

                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <template #header>
                        請拖曳以下選項 到 自定義欄位
                    </template>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="input"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="純文字">
                                    <el-input :model-value="'請輸入文字'" :readonly="true"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="number"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="數字">
                                    <el-input-number v-model="demo.number"></el-input-number>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="singleSelect"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="單選">
                                    <el-select v-model="demo.singleSelect">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="multiSelect"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="多選">
                                    <el-select v-model="demo.multiSelect" :filterable="true" :multiple="true"
                                        :allow-create="true">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="datetimerange"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="時間日期">
                                    <el-date-picker v-model="demo.datetimerange" type="datetimerange" />
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="url"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="超連結">
                                    <el-input :model-value="'請輸入連結'" :readonly="true"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="checkbox"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="核取方塊">
                                    <el-checkbox v-model="demo.checkbox" label="Option 1" />
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="divider"
                                @mouseenter="setTemplateName($event)">
                                <el-form-item label="分隔線">
                                    <el-divider></el-divider>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>

        <br />
        <el-row>
            <el-col :span="16">
                <el-card>
                    <template #header>
                        已存必填寫欄位
                    </template>
                    <FormEventTemplate v-model="templateForm"></FormEventTemplate>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import useRepoEvent from '~/composables/useRepoEvent'
const repoEvent = useRepoEvent()

const dialogVisible = ref(false)

// 拖曳中的模板資料
const template = reactive({
    name: '',
    isDragging: false,
})

// const isDragging = ref<boolean>(false)
// const template = ref<string>('')

const templateForm = reactive({
    description: '',
})

const demo = reactive({
    input: '',
    number: 0,
    singleSelect: 'Option1',
    multiSelect: ['Option1', 'Option2'],
    datetimerange: [new Date().toISOString(), new Date().toISOString()],
    checkbox: false,
})

const options = [
    {
        value: 'Option1',
        label: 'Option1',
    },
    {
        value: 'Option2',
        label: 'Option2',
    },
    {
        value: 'Option3',
        label: 'Option3',
    },
    {
        value: 'Option4',
        label: 'Option4',
    },
    {
        value: 'Option5',
        label: 'Option5',
    },
]

const form = reactive({
    name: '',
    locationName: '',
    locationAddress: '',
    virtualLocationUrl: '',
    description: '', // html
    startDate: '',
    endDate: '',
})

// methods
function setTemplateName(ev: any) {
    template.isDragging = true
    template.name = ev.target.dataset.name
}

async function putEventTemplate() {
    await repoEvent.putEventTemplate(templateForm)
    dialogVisible.value = false
}

async function editEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(templateForm, result)
    dialogVisible.value = true
}

async function getEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(form, result)
}

onMounted(() => {
    // getEventTemplate()
})
</script>
<style lang="scss" scoped>
.eventTemplate {
    .eventTemplate__draggable {
        &:hover {
            outline: 1px dashed red;
        }
    }
}
</style>