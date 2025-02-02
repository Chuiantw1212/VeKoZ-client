<template>
    <div class="eventTemplate">
        <h1>活動套版管理</h1>
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card>
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

                    <template #footer>
                        <div class="footer">
                            <el-button v-loading="isLoading" @click="putEventTemplate">保存</el-button>
                        </div>
                    </template>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <template #header>
                        請拖曳以下選項 到 自定義欄位
                    </template>
                    <div class="eventTemplate__draggable" draggable="true" data-name="input"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="純文字">
                            <el-input :model-value="'請輸入文字'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="number"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="數字">
                            <el-input-number v-model="demo.number"></el-input-number>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="singleSelect"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="單選">
                            <el-select v-model="demo.singleSelect">
                                <el-option v-for="item in mockOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="multiSelect"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="多選">
                            <el-select v-model="demo.multiSelect" :filterable="true" :multiple="true"
                                :allow-create="true">
                                <el-option v-for="item in mockOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="dateTimeRange"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="時間日期">
                            <el-date-picker v-model="demo.datetimerange" type="datetimerange" />
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="url"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="超連結">
                            <el-input :model-value="'請輸入連結'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="checkbox"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="核取方塊">
                            <el-checkbox v-model="demo.checkbox" label="Option 1" />
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="divider"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="分隔線">
                            <el-divider></el-divider>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="editor"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="">
                            <el-divider>編輯器</el-divider>
                            <AtomVenoniaEditor></AtomVenoniaEditor>
                        </el-form-item>
                    </div>
                    <el-divider>高階欄位</el-divider>
                    <div class="eventTemplate__draggable" draggable="true" data-name="organization"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="組織">
                            <el-select v-model="demo.organizationId" placeholder="請選擇組織"
                                @change="getOrganizationMemberList()">
                                <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="organizationMember"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="組織成員">
                            <el-select v-model="demo.members" placeholder="請選擇對應組織的成員" :disabled="!demo.organizationId">
                                <el-option v-for="(item, index) in organizationMemberList" :key="index"
                                    :label="item.name" :value="String(item.id)" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="eventTemplate__draggable" draggable="true" data-name="accommodation"
                        @mouseenter="setTemplateName($event)" @mouseleave="cancelDragging()">
                        <el-form-item label="空間地點">
                            <el-select v-model="demo.members" placeholder="請選擇空間地點" :disabled="!demo.organizationId">
                                <el-option v-for="(item, index) in organizationMemberList" :key="index"
                                    :label="item.name" :value="String(item.id)" />
                            </el-select>
                        </el-form-item>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
import type { IAccommodation } from '~/types/accommodation'
import type { ITemplateDesign, ITemplateDragSouce } from '~/types/eventTemplate'
import useRepoEvent from '~/composables/useRepoEvent'
const repoEvent = useRepoEvent()
const repoOrganization = useRepoOrganization()
const repoAccommodation = useRepoAccommodation()
const dialogVisible = ref(false)
const isLoading = ref(false)

// 拖曳中的模板資料
const templateTemp = reactive({
    name: '',
    isDragging: false,
    sourceIndex: -1,
})

const eventTemplate = reactive({
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
    organizationId: '',
    members: [],
})
const mockOptions = [
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

const organizationList = ref<IOrganization[]>([])
const organizationMemberList = ref<IOrganizationMember[]>([])
const accommodationList = ref<IAccommodation[]>([])

// Hooks
onMounted(async () => {
    await getAccommodationList()
    await getOrganizationList()
    getEventTemplate()
})

// methods
async function getAccommodationList() {
    const result = await repoAccommodation.getAccommodationList()
    accommodationList.value = result
}
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}
async function getOrganizationMemberList() {
    const result = await repoOrganization.getOrganizationMemberList(demo.organizationId)
    organizationMemberList.value = result
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
        controllable: {
            label: ''
        }
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
// function setDefaultTemplates() {
//     if (!eventTemplate.designs.length) {
//         const defaultTemplates = [
//             {
//                 name: 'input',
//             },
//         ]
//         eventTemplate.designs.push(...defaultTemplates)
//     }
// }

// <h2>📚 活動內容?：</h2><p>&nbsp;</p><p>&nbsp;</p><h2>📝 本次您將會學習到：</h2><ol><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li></ol><p>&nbsp;</p><p>&nbsp;</p><h2>🙋🏻 誰適合參與？</h2><ol><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li></ol>

async function putEventTemplate() {
    isLoading.value = true
    await repoEvent.putEventTemplate(eventTemplate)
    dialogVisible.value = false
    isLoading.value = false
}

async function getEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(eventTemplate, result)
}
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
        max-width: 100%;
        min-height: 4px;
        line-height: 44px;
        font-size: 20px;
        text-align: center;
    }

    .eventTemplate__designItem--outline {
        border-color: #d60b00;
    }
}

.footer {
    display: flex;
    justify-content: flex-end;
}
</style>
