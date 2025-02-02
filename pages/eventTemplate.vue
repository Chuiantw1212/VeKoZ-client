<template>
    <div class="eventTemplate">
        <h1>活動套版管理</h1>
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card>
                    <template #header>
                        自定義欄位
                    </template>
                    <FormTemplateDesign v-model="eventTemplate.designs" :isDesigning="true"
                        @dragstart="setTemplateTemp($event)">
                        <template #default="defaultProps">
                            <div class="eventTemplate__designItem"
                                :class="{ 'eventTemplate__designItem--outline': templateTemp.isDragging }"
                                @drop="insertTemplate($event, defaultProps.index)" @dragover="allowDrop($event)">
                            </div>
                        </template>
                    </FormTemplateDesign>
                    <div v-if="!eventTemplate.designs.length" class="eventTemplate__designItem"
                        :class="{ 'eventTemplate__designItem--outline': templateTemp.isDragging }"
                        @drop="insertTemplate($event, 0)" @dragover="allowDrop($event)">
                        請拖曳欄位至此
                    </div>
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
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                                <el-form-item label="純文字">
                                    <el-input :model-value="'請輸入文字'" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="number"
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                                <el-form-item label="數字">
                                    <el-input-number v-model="demo.number" :disabled="true"></el-input-number>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="singleSelect"
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                                <el-form-item label="單選">
                                    <el-select v-model="demo.singleSelect" :disabled="true">
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
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                                <el-form-item label="多選">
                                    <el-select v-model="demo.multiSelect" :filterable="true" :multiple="true"
                                        :allow-create="true" :disabled="true">
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
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                                <el-form-item label="時間日期">
                                    <el-date-picker v-model="demo.datetimerange" type="datetimerange"
                                        :disabled="true" />
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="url"
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                                <el-form-item label="超連結">
                                    <el-input :model-value="'請輸入連結'" :disabled="true"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="checkbox"
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                                <el-form-item label="核取方塊">
                                    <el-checkbox v-model="demo.checkbox" label="Option 1" :disabled="true" />
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div class="eventTemplate__draggable" draggable="true" data-name="divider"
                                @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
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
                        已存欄位
                    </template>
                    <FormEventTemplate v-model="eventTemplate"></FormEventTemplate>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import useRepoEvent from '~/composables/useRepoEvent'
const repoEvent = useRepoEvent()

const dialogVisible = ref(false)

interface ITemplateDesign {
    name: string,
    controllable: {
        label: string
    }
}

// 拖曳中的模板資料
const templateTemp = reactive({
    name: '',
    isDragging: false,
    sourceIndex: -1,
})

const eventTemplate = reactive({
    organizationId: '',
    id: '',
    designs: [] as ITemplateDesign[]
})

const demo = reactive({
    input: '',
    number: 1000,
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

// methods
interface ITemplateDragSouce {
    index: number,
    name: string,
}
function setTemplateTemp(data: ITemplateDragSouce) {
    templateTemp.isDragging = true
    templateTemp.sourceIndex = data.index
    templateTemp.name = data.name
}
function insertTemplate(ev: Event, destinationIndex = 0) {
    ev.preventDefault();
    eventTemplate.designs.splice(destinationIndex, 0, {
        name: templateTemp.name,
    })
    // Reset flags
    templateTemp.isDragging = false
    if (templateTemp.sourceIndex >= 0) {
        if (destinationIndex <= templateTemp.sourceIndex) {
            eventTemplate.designs.splice(templateTemp.sourceIndex + 1, 1)
        } else {
            eventTemplate.designs.splice(templateTemp.sourceIndex, 1)
        }
    }
    templateTemp.sourceIndex = -1
}
function allowDrop(ev: any) {
    ev.preventDefault();
}
function setTemplateName(ev: any) {
    templateTemp.isDragging = true
    templateTemp.name = ev.target.dataset.name
}
function cancelDragging() {
    templateTemp.isDragging = false
}
function setDefaultTemplates() {
    if (!eventTemplate.designs.length) {
        const defaultTemplates = [
            {
                name: 'input',
            },
        ]
        eventTemplate.designs.push(...defaultTemplates)
    }
}
// async function putEventTemplate() {
//     await repoEvent.putEventTemplate(templateForm)
//     dialogVisible.value = false
// }

// async function editEventTemplate() {
//     const result = await repoEvent.getEventTemplate()
//     Object.assign(templateForm, result)
//     dialogVisible.value = true
// }

// async function getEventTemplate() {
//     const result = await repoEvent.getEventTemplate()
//     Object.assign(form, result)
// }

onMounted(() => {
    // getEventTemplate()
    // setDefaultTemplates()
})
</script>
<style lang="scss" scoped>
.eventTemplate {
    .eventTemplate__draggable {
        * {
            cursor: grab !important;
        }

        &:hover {
            outline: 1px dashed red;
        }
    }

    .eventTemplate__designItem {
        border: dashed 2px black;
        // background-color: rgba(94, 168, 142, 0.1);
        max-width: 100%;
        min-height: 4px;
        line-height: 44px;
        font-size: 20px;
        text-align: center;
        // margin-bottom: 18px;

        // &:not(:first) {
        //     margin-top: 18px;
        // }
    }

    .eventTemplate__designItem--outline {
        border-color: #d60b00;
    }
}
</style>