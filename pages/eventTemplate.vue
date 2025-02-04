<template>
    <div class="eventTemplate">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card class="venonia-card" body-class="card__body card__body--200">
                    <template #header>
                        <div class="venonia-card-header">
                            活動套版
                            <div class="header__btnGroup">
                                <el-button size="small">
                                    套用預設模板
                                </el-button>
                            </div>
                        </div>
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
                <el-card class="venonia-card" body-class="card__body card__body--200">
                    <template #header>
                        <div class="venonia-card-header">
                            請拖曳以下選項 到 自定義欄位
                        </div>
                    </template>
                    <el-form label-width="auto">
                        <div class="eventTemplate__draggable" draggable="true" data-type="input"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignInput :disabled="true" :isDesigning="false"></OrganismDesignInput>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="number"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignNumber :disabled="true" :isDesigning="false"></OrganismDesignNumber>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="dateTimeRange"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignDateTimeRange :disabled="true" :isDesigning="false">
                            </OrganismDesignDateTimeRange>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="url"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignUrl :disabled="true" :isDesigning="false">
                            </OrganismDesignUrl>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="textarea"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignTextarea :disabled="true" :isDesigning="false">
                            </OrganismDesignTextarea>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="divider"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignDivider :disabled="true" :isDesigning="false">
                            </OrganismDesignDivider>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="editor"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <AtomVenoniaEditor isDesigning="false" :disabled="true"></AtomVenoniaEditor>
                        </div>
                        <el-divider content-position="left">高階欄位</el-divider>
                        <div class="eventTemplate__draggable" draggable="true" data-type="organization"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignOrganization :disabled="true" :isDesigning="false">
                            </OrganismDesignOrganization>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="offer"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignOffer :disabled="true" :isDesigning="false">
                            </OrganismDesignOffer>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="organizationMember"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <el-form-item label="組織成員">
                                <el-select v-model="demo.members" placeholder="請選擇對應組織的成員"
                                    :disabled="!demo.organizationId">
                                    <el-option v-for="(item, index) in organizationMemberList" :key="index"
                                        :label="item.name" :value="String(item.id)" />
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="place"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <el-form-item label="空間地點">
                                <el-select v-model="demo.members" placeholder="請選擇空間地點"
                                    :disabled="!demo.organizationId">
                                    <el-option v-for="(item, index) in organizationMemberList" :key="index"
                                        :label="item.name" :value="String(item.id)" />
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember } from '~/types/organization'
import type { IPlace } from '~/types/place'
import type { ITemplateDesign, ITemplateDragSouce } from '~/types/eventTemplate'
import useRepoEvent from '~/composables/useRepoEvent'
const repoEvent = useRepoEvent()
const repoOrganization = useRepoOrganization()
const repoPlace = useRepoPlace()
const dialogVisible = ref(false)
const isLoading = ref(false)

// 拖曳中的模板資料
const templateTemp = reactive({
    type: '',
    isDragging: false,
    sourceIndex: -1,
})

const eventTemplate = reactive({
    id: '',
    designs: [] as ITemplateDesign[]
})

const designOrganization = ref<ITemplateDesign>({
    type: 'organization',
    // mutable: {
    //     label: '',
    //     value: ''
    // }
})

// deprecated
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
const placeList = ref<IPlace[]>([])

// Hooks
onMounted(async () => {
    addOnDropListener(true)
    await getPlaceList()
    await getOrganizationList()
    // getEventTemplate()

})
onBeforeUnmount(() => {
    addOnDropListener(false)
})

// methods
async function addOnDropListener(isOn: boolean) {
    if (isOn) {
        document.addEventListener('dragend', clearOnDrop)
    } else {
        document.removeEventListener('dragend', clearOnDrop)
    }
}
async function clearOnDrop() {
    templateTemp.isDragging = false
}

async function getPlaceList() {
    const result = await repoPlace.getPlaceList()
    placeList.value = result
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
    templateTemp.type = data.type
}
function insertTemplate(ev: Event, destinationIndex = 0) {
    ev.preventDefault();
    eventTemplate.designs.splice(destinationIndex, 0, {
        type: templateTemp.type,
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
function setTemplateType(ev: any) {
    templateTemp.isDragging = true
    templateTemp.type = ev.target.dataset.type
}
function cancelDragging() {
    templateTemp.isDragging = false
}

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
        max-width: 100%;
        min-height: 8px;
        line-height: 44px;
        font-size: 20px;
        text-align: center;
        margin: 2px 0px;
    }

    .eventTemplate__designItem--outline {
        outline: 1px dashed red;
    }
}

.footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
