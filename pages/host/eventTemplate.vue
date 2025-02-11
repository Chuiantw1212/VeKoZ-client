<template>
    <div class="eventTemplate">
        <el-row :gutter="20">
            <el-col :span="repoUI.isDesktop ? 16 : 24">
                <el-card v-loading="isLoading" class="venonia-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="venonia-card-header">
                            活動套版
                            <div class="header__btnGroup">
                                <el-button size="small" @click="resetEventTemplate">
                                    套用預設模板
                                </el-button>
                            </div>
                        </div>
                    </template>
                    <FormTemplateDesign v-model="eventTemplate.designs" :isDesigning="true" :onchange="handleChange"
                        @remove="removeDesign($event)" @dragstart="setTemplateTemp($event)">
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
            <el-col v-if="repoUI.isDesktop" :span="8">
                <el-card class="venonia-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="venonia-card-header">
                            請拖曳以下選項到 指定位置
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
                            <OrganismDesignEditor :isDesigning="false" :disabled="true" placeholder="限制一個，內文上限2000字">
                            </OrganismDesignEditor>
                        </div>
                        <el-divider content-position="left">高階欄位</el-divider>
                        <div class="eventTemplate__draggable" draggable="true" data-type="eventGroup"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignEventGroup :disabled="true" :isDesigning="false">
                            </OrganismDesignEventGroup>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="organization"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignOrganization :disabled="true" :isDesigning="false">
                            </OrganismDesignOrganization>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="organizationMember"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignOrganizationMember :disabled="true" :isDesigning="false">
                            </OrganismDesignOrganizationMember>
                        </div>
                        <div class="eventTemplate__draggable" draggable="true" data-type="offer"
                            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
                            <OrganismDesignOffer :disabled="true" :isDesigning="false">
                            </OrganismDesignOffer>
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
import type { IOrganization } from '~/types/organization'
import type { IPlace } from '~/types/place'
import type { IEventTemplate, ITemplateDesign, ITemplateDragSouce } from '~/types/eventTemplate'
const repoUI = useRepoUI()
const repoEventTemplate = useRepoEventTemplate()
const repoOrganization = useRepoOrganization()
const repoPlace = useRepoPlace()
const isLoading = ref<boolean>(false)

// 拖曳中的模板資料
const templateTemp = ref<ITemplateDragSouce>({
    type: '',
    id: '',
    index: -1
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
    delete eventTemplate.value.designIds
    Object.assign(eventTemplate.value, {
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
    })
}

async function handleChange(templateDesign: ITemplateDesign) {
    repoEventTemplate.patchEventTemplateDesign({
        id: templateDesign.id,
        mutable: templateDesign.mutable
    })
}

async function resetEventTemplate() {
    const oldTemplateId = eventTemplate.value.id
    await repoEventTemplate.deleteEventTemplate(String(oldTemplateId))
    setDefaultTemplate()
    postEventTemplate()
}

async function postEventTemplate() {
    const result = await repoEventTemplate.postEventTemplate(eventTemplate.value)
    eventTemplate.value = result
}

async function addOnDropListener(isOn: boolean) {
    if (isOn) {
        document.addEventListener('dragend', clearOnDrop)
    } else {
        document.removeEventListener('dragend', clearOnDrop)
    }
}
async function clearOnDrop() {
    templateTemp.value.type = ''
}

async function getPlaceList() {
    const result = await repoPlace.getPlaceList()
    placeList.value = result
}
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}
function setTemplateTemp(templateSource: ITemplateDragSouce) {
    templateTemp.value = templateSource
}
async function insertTemplate(ev: Event, destinationIndex = 0) {
    ev.preventDefault();
    // 插入元素
    const templateDesign: ITemplateDesign = {
        id: templateTemp.value.id,
        type: templateTemp.value.type,
        // mutable: templateTemp.value.mutable
    }

    // // 新的元素賦予必要預設值
    // if (!templateTemp.value.mutable) {
    //     templateDesign.mutable = {
    //         label: ''
    //     }
    //     if (templateDesign.type === 'offer') {
    //         templateDesign.mutable.offers = [{}]
    //     }
    // }

    // 先更新資料庫再更新畫面
    const hasSource = templateTemp.value.index !== -1
    const sourceIndex = Number(templateTemp.value.index)
    if (hasSource) {
        // 屬於原有模板拖曳
        eventTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
        // 刪除原本位置的的模板
        // nextTick(() => {
        if (destinationIndex < sourceIndex) {
            eventTemplate.value.designs.splice(sourceIndex + 1, 1)
        } else {
            eventTemplate.value.designs.splice(sourceIndex, 1)
        }
        // })
    } else {
        // 屬於新增的模板設計
        const designId = await repoEventTemplate.postEventTemplateDesign({
            type: templateTemp.value.type,
            destination: destinationIndex,
            templateId: eventTemplate.value.id,
            mutable: templateTemp.value.mutable
        })
        templateDesign.id = designId
        eventTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
    }

    // 更新模板順序
    const templateDesignIds = eventTemplate.value.designs.map(design => String(design.id))
    repoEventTemplate.patchEventTemplate(templateDesignIds)

    // Reset flags
    templateTemp.value.id = '' // 用來判斷是否為新增的欄位
    templateTemp.value.type = '' // 用來判斷是否為拖曳中
    templateTemp.value.index = -1
    isLoading.value = false

    // 重新渲染
    // const temp = eventTemplate.value
    // eventTemplate.value = {
    //     designs: []
    // }
}

async function removeDesign(data: any) {
    isLoading.value = true
    // 更新資料庫
    await repoEventTemplate.deleteEventTemplateDesign(data.id)
    // 更新模板順序
    eventTemplate.value.designs.splice(data.index, 1)
    const templateDesignIds = eventTemplate.value.designs.map(design => String(design.id))
    await repoEventTemplate.patchEventTemplate(templateDesignIds)
    isLoading.value = false
}

function allowDrop(ev: any) {
    ev.preventDefault();
}
function setTemplateType(ev: any) {
    templateTemp.value.type = ev.target.dataset.type
}
function cancelDragging() {
    templateTemp.value.type = ''
}

async function getEventTemplate() {
    const result = await repoEventTemplate.getEventTemplate()
    if (result) {
        Object.assign(eventTemplate.value, result)
    }
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
