<template>
    <div class="eventTemplate">
        <el-row :gutter="20">
            <el-col :span="repoUI.isLarge ? 16 : 24">
                <el-card v-loading="isLoading" class="venonia-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="venonia-card-header">
                            <el-form-item>
                                <el-input v-model="eventTemplate.name" placeholder="請輸入模板名稱" size="large"
                                    @change="patchTemplateName()" :maxlength="8" :show-word-limit="true">
                                </el-input>
                            </el-form-item>
                            <div>
                                {{ eventTemplate.id }}
                            </div>
                            <div class="header__btnGroup">
                                <el-button size="small" @click="loadTemplateDialog.isOpen = true">
                                    開啓模板
                                </el-button>
                                <el-button size="small" @click="openSaveDialog">
                                    另存新檔
                                </el-button>
                            </div>
                        </div>
                    </template>
                    <FormTemplateDesign v-model="eventTemplate.designs" :isDesigning="true"
                        :onchange="handleDesignChanged" @remove="removeDesign($event)"
                        @dragstart="setTemplateTemp($event)">
                        <template #default="defaultProps">
                            <div class="eventTemplate__designItem" @drop="insertTemplate($event, defaultProps.index)"
                                @dragover="allowDrop($event)"
                                :class="{ 'eventTemplate__designItem--outline': templateTemp.item.type }">
                            </div>
                        </template>
                    </FormTemplateDesign>
                    <div v-if="!eventTemplate.designs.length" class="eventTemplate__designItem"
                        :class="{ 'eventTemplate__designItem--outline': templateTemp.item.type }"
                        @drop="insertTemplate($event, 0)" @dragover="allowDrop($event)">
                        請拖曳元件至 此位置
                    </div>
                </el-card>
            </el-col>
            <el-col v-if="repoUI.isLarge" :span="8">
                <el-card class="venonia-card" body-class="card__body card__body--205">
                    <template #header>
                        <div class="venonia-card-header">
                            請拖曳以下元件 到 指定位置
                        </div>
                    </template>
                    <FormDesignDragging :designs="eventTemplate.designs" @mouseenter="setTemplateItem($event)"
                        @mouseout="cancelDragging()">
                    </FormDesignDragging>
                </el-card>
            </el-col>
        </el-row>
        <AtomVenoniaDialog v-model="loadTemplateDialog.isOpen" :showClose="true">
            <template #default>
                <FormEditEventTemplate v-if="loadTemplateDialog.isOpen" v-model="eventTemplate"
                    @update:modelValue="loadTemplate($event)" @reset="">
                </FormEditEventTemplate>
            </template>
        </AtomVenoniaDialog>
        <AtomVenoniaDialog v-model="templateSavingDialog.isOpen" :showClose="true">
            <template #header>
                另存新模板
            </template>
            <template #default>
                <el-form v-if="templateSavingDialog.isOpen" ref="saveFormRef" :model="templateSavingDialog">
                    <el-form-item label="模板名稱" :required="true" prop="name">
                        <el-input v-model="templateSavingDialog.name" placeholder="請輸入另存的模板名稱"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button @click="confirmSaveDialog()">儲存</el-button>
            </template>
        </AtomVenoniaDialog>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
import type { IPlace } from '~/types/place'
import type { IEventTemplate, ITemplateDesign, ITemplateDragSouce } from '~/types/eventTemplate'
import type { FormInstance } from 'element-plus'
import defaultTemplateDesigns from '~/assets/defaultTemplateDesigns.json'

const repoUI = useRepoUI()
const repoEventTemplate = useRepoEventTemplate()
const repoOrganization = useRepoOrganization()
const repoPlace = useRepoPlace()
const isLoading = ref<boolean>(false)

// 主要的模板資料
const eventTemplate = ref<IEventTemplate>({
    id: '',
    designs: [] as ITemplateDesign[]
})

// 拖曳中的模板設計
const templateTemp = ref<ITemplateDragSouce>({
    item: {
        type: '', // 拖曳中的判斷欄位
        id: '', // 是否為新增的判斷欄位
    },
    index: -1
})

const organizationList = ref<IOrganization[]>([])
const placeList = ref<IPlace[]>([])

const loadTemplateDialog = ref({
    isOpen: false,
})

const saveFormRef = ref<FormInstance>()
const templateSavingDialog = ref({
    isOpen: false,
    name: ''
})

// Hooks
onMounted(async () => {
    isLoading.value = true
    addOnDropListener(true)
    await getPlaceList()
    await getOrganizationList()
    await getRecentTemplate()
    if (!eventTemplate.value.id) {
        await setDefaultTemplate()
        await postEventTemplate()
    }
    isLoading.value = false
})
onBeforeUnmount(() => {
    addOnDropListener(false)
})

// methods
async function patchTemplateName() {
    repoUI.debounce('templateName', async () => {
        await repoEventTemplate.patchTemplateName(eventTemplate.value)
    })
}

async function openSaveDialog() {
    templateSavingDialog.value.isOpen = true
}

async function confirmSaveDialog() {
    const isValid = await saveFormRef.value?.validate()
    if (!isValid) {
        return
    }
    isLoading.value = true
    await postEventTemplate(templateSavingDialog.value.name)
    templateSavingDialog.value.isOpen = false
    isLoading.value = false
}

async function getRecentTemplate() {
    const templateList: IEventTemplate[] = await repoEventTemplate.getEventTemplateList()
    const mostRecentTemplate = templateList[0]
    if (mostRecentTemplate?.id) {
        await getEventTemplate(mostRecentTemplate.id)
    }
}

async function loadTemplate(loadedTemplate: IEventTemplate) {
    loadTemplateDialog.value.isOpen = false
    switch (loadedTemplate.id) {
        case '':
        case 'default': {
            delete loadedTemplate.id
            setDefaultTemplate()
            await postEventTemplate()
            break;
        }
        case 'blank': {
            delete loadedTemplate.id
            await postEventTemplate()
            break;
        }
        default: {
            // Do nothing
        }
    }
}

function setDefaultTemplate() {
    delete eventTemplate.value.designIds
    Object.assign(eventTemplate.value, {
        designs: defaultTemplateDesigns
    })
}

async function handleDesignChanged(templateDesign: ITemplateDesign) {
    // 只需要必要欄位，其他建立時已給
    repoEventTemplate.patchEventTemplateDesign({
        id: templateDesign.id,
        mutable: templateDesign.mutable,
        type: templateDesign.type, // 處理blob時候用
        formField: templateDesign.formField
    })
}

async function postEventTemplate(templateName: string = '') {
    const newTemplate = eventTemplate.value
    if (templateName) {
        newTemplate.name = templateName
    }
    const result = await repoEventTemplate.postEventTemplate(newTemplate)
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
    templateTemp.value.item.type = ''
    templateTemp.value.item.id = ''
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
    const templateDesign: ITemplateDesign = JSON.parse(JSON.stringify(templateTemp.value.item)) // 必須深拷貝，不然會在清除站存資料時影響到模板
    // 先更新資料庫再更新畫面
    const hasSource = templateTemp.value.index !== -1
    const sourceIndex = Number(templateTemp.value.index)
    if (hasSource) {
        // 屬於原有模板拖曳
        eventTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
        // return
        // 刪除原本位置的的模板
        if (destinationIndex < sourceIndex) {
            eventTemplate.value.designs.splice(sourceIndex + 1, 1)
        } else {
            eventTemplate.value.designs.splice(sourceIndex, 1)
        }
    } else {
        // 屬於新增的模板設計
        const designId = await repoEventTemplate.postEventTemplateDesign({
            ...templateDesign,
            templateId: eventTemplate.value.id,
        })
        templateDesign.id = designId
        eventTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
    }
    // return
    // 更新模板順序
    repoEventTemplate.patchTemplateDesignIds(eventTemplate.value)

    // Reset flags
    templateTemp.value.item.id = '' // 用來判斷是否為新增的欄位
    templateTemp.value.item.type = '' // 用來判斷是否為拖曳中
    templateTemp.value.index = -1
    isLoading.value = false
}

async function removeDesign(data: ITemplateDragSouce) {
    isLoading.value = true
    // 更新資料庫
    await repoEventTemplate.deleteEventTemplateDesign(String(data.item.id))
    // 更新模板順序
    eventTemplate.value.designs.splice(data.index, 1)
    await repoEventTemplate.patchTemplateDesignIds(eventTemplate.value)
    isLoading.value = false
}

function allowDrop(ev: any) {
    ev.preventDefault();
}
function setTemplateItem(itemMeta: ITemplateDesign) {
    const { formField, type } = itemMeta
    templateTemp.value.item.formField = formField
    templateTemp.value.item.type = type
}
function cancelDragging() {
    templateTemp.value.item.type = ''
}

async function getEventTemplate(templateId: string) {
    const result = await repoEventTemplate.getEventTemplate(templateId)
    if (result) {
        Object.assign(eventTemplate.value, result)
    }
}
</script>
<style lang="scss" scoped>
.eventTemplate {
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
