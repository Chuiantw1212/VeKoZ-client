<template>
    <div class="eventTemplate">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card v-loading="isLoading" class="venonia-card" body-class="card__body card__body--205">
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
                                :class="{ 'eventTemplate__designItem--outline': templateTemp.type }"
                                @drop="insertTemplate($event, defaultProps.index)" @dragover="allowDrop($event)">
                            </div>
                        </template>
                    </FormTemplateDesign>
                    <div v-if="!eventTemplate.designs.length" class="eventTemplate__designItem"
                        :class="{ 'eventTemplate__designItem--outline': templateTemp.type }"
                        @drop="insertTemplate($event, 0)" @dragover="allowDrop($event)">
                        請拖曳欄位至此
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="venonia-card" body-class="card__body card__body--205">
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
                            <OrganismDesignOrganizationMember :disabled="true" :isDesigning="false">
                            </OrganismDesignOrganizationMember>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="place"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignPlace :disabled="true" :isDesigning="false">
                            </OrganismDesignPlace>
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
import type { IEventTemplate, ITemplateDesign, ITemplateDragSouce } from '~/types/eventTemplate'
import useRepoEvent from '~/composables/useRepoEvent'
const repoEvent = useRepoEvent()
const repoOrganization = useRepoOrganization()
const repoPlace = useRepoPlace()
const dialogVisible = ref<boolean>(false)
const isLoading = ref<boolean>(false)

// 拖曳中的模板資料
const templateTemp = reactive<ITemplateDesign>({
    type: '',
    id: '',
    sourceIndex: -1,
})

const eventTemplate = ref<IEventTemplate>({
    id: '',
    designs: [] as ITemplateDesign[]
})

const organizationList = ref<IOrganization[]>([])
const placeList = ref<IPlace[]>([])

// Hooks
onMounted(async () => {
    isLoading.value = true
    addOnDropListener(true)
    await getPlaceList()
    await getOrganizationList()
    await getEventTemplate()
    if (!eventTemplate.value.id) {
        setDefaultTemplate()
        await postEventTemplate()
    }
    isLoading.value = false
})
onBeforeUnmount(() => {
    addOnDropListener(false)
})

// methods
async function setDefaultTemplate() {
    eventTemplate.value = {
        designs: [
            {
                type: 'header1',
                mutable: {
                    label: '活動名稱'
                }
            },
            {
                type: 'dateTimeRange',
                mutable: {
                    label: '活動時間'
                }
            },
            {
                type: 'organization',
                mutable: {
                    label: '主辦單位'
                }
            },
            {
                type: 'organizationMember',
                mutable: {
                    label: '講者/主持'
                }
            },
            {
                type: 'textarea',
                mutable: {
                    label: '活動摘要'
                }
            },
            {
                type: 'place',
                mutable: {
                    label: '線下空間'
                }
            },
            {
                type: 'url',
                mutable: {
                    label: '線上連結'
                }
            },
            {
                type: 'offer',
                mutable: {
                    label: '公開票組',
                    offers: [
                        {

                        }
                    ]
                }
            },
            {
                type: 'divider',
                mutable: {
                    label: '活動詳細內容'
                }
            },
            {
                type: 'editor',
                mutable: {
                    label: ''
                }
            },
        ]
    }
}

async function postEventTemplate() {
    await repoEvent.postEventTemplate(eventTemplate.value)
}

async function addOnDropListener(isOn: boolean) {
    if (isOn) {
        document.addEventListener('dragend', clearOnDrop)
    } else {
        document.removeEventListener('dragend', clearOnDrop)
    }
}
async function clearOnDrop() {
    templateTemp.type = ''
}

async function getPlaceList() {
    const result = await repoPlace.getPlaceList()
    placeList.value = result
}
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}
function setTemplateTemp(data: ITemplateDragSouce) {
    templateTemp.id = data.id
    templateTemp.sourceIndex = data.index
    templateTemp.type = data.type
}
function insertTemplate(ev: Event, destinationIndex = 0) {
    ev.preventDefault();
    eventTemplate.value.designs.splice(destinationIndex, 0, {
        type: templateTemp.type,
    })
    // Reset flags
    templateTemp.type = ''
    const sourceIndex = Number(templateTemp.sourceIndex)
    if (sourceIndex >= 0) {
        if (destinationIndex <= sourceIndex) {
            eventTemplate.value.designs.splice(sourceIndex + 1, 1)
        } else {
            eventTemplate.value.designs.splice(sourceIndex, 1)
        }
    }
    if (!eventTemplate.value.id) {
        // 全新模板
    } else {
        // 屬於原有模板拖曳
        // 屬於原有的模板設計
        // if () {

        // }
        // 屬於新增的模板設計
        repoEvent.postEventTemplateDesign({
            type: templateTemp.type,
            destination: destinationIndex,
            source: templateTemp.sourceIndex,
            // id: '用來精準更新使用'
        })
    }
    templateTemp.sourceIndex = -1
}
function allowDrop(ev: any) {
    ev.preventDefault();
}
function setTemplateType(ev: any) {
    templateTemp.type = ev.target.dataset.type
}
function cancelDragging() {
    templateTemp.type = ''
}

async function putEventTemplate() {
    isLoading.value = true
    await repoEvent.putEventTemplate(eventTemplate.value)
    dialogVisible.value = false
    isLoading.value = false
}

async function getEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(eventTemplate.value, result)
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
