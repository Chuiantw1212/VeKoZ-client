<template>
    <el-row>
        <div class="user__btnGroup">
            <el-button class="btnGroup__btn" :icon="WarnTriangleFilled">註銷帳號</el-button>
            <el-button class="btnGroup__btn" :icon="WarnTriangleFilled" :disabled="true">變更密碼</el-button>
            <el-button class="btnGroup__btn" :icon="User">登出</el-button>
            <el-button v-if="repoUser.userType === 'attendee'" class="btnGroup__btn"
                @click="repoUser.setUserType('host')" :icon="Switch">切換為主辦方</el-button>
            <el-button v-if="repoUser.userType === 'host'" class="btnGroup__btn"
                @click="repoUser.setUserType('attendee')" :icon="Switch">切換為一般用戶</el-button>
            <el-button class="btnGroup__btn" :icon="Message">許願&抱怨</el-button>
            <NuxtLink class="btnGroup__btn" to="https://github.com/VeKoZ-tw" target="_blank">
                <el-button :icon="Cpu">
                    開放原始碼
                </el-button>
            </NuxtLink>
        </div>
    </el-row>
    <el-row class="userTemplate" :gutter="20">
        <el-col :span="repoUI.isMedium ? 16 : 24">
            <el-card class="user__card venonia-card" body-class="card__body card__body--265">
                <template #header>
                    <div class="venonia-card-header">
                        <div>
                            個人資料與名片頁
                        </div>
                        <div>
                            <NuxtLink :to="getPersonalLink()" target="_blank">
                                <el-button v-loading="isLoading" :icon="View">
                                    瀏覽
                                </el-button>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
                <FormTemplateDesign v-model="designs" :isDesigning="true">
                    <template #default="defaultProps">
                        <div class="user__card__designItem" @drop="insertTemplate($event, defaultProps.index)"
                            @dragover="allowDrop($event)"
                            :class="{ 'eventTemplate__designItem--outline': templateTemp.item.type }">
                        </div>
                    </template>
                </FormTemplateDesign>
            </el-card>
        </el-col>
        <el-col v-if="repoUI.isMedium" :span="8">
            <el-card class="venonia-card" body-class="card__body card__body--265">
                <template #header>
                    <div class="venonia-card-header">
                        請拖曳以下元件 到 指定位置
                    </div>
                </template>
                <FormDesignDragging @dragstart="setTemplateItem($event)" @mouseenter="setTemplateItem($event)"
                    @mouseout="cancelDragging()"></FormDesignDragging>
            </el-card>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import { Cpu, User, View, Message, WarnTriangleFilled, Switch } from '@element-plus/icons-vue';
import type { IEventFromList } from '~/types/event';
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate';
import type { IUser } from '~/types/user';
import type { ITemplateDragSouce } from '~/types/eventTemplate';
const designs = ref<ITemplateDesign[]>([
    {
        "type": "banner",
        "label": "",
        "formField": "banner"
    },
    {
        "type": "header1",
        "label": "活動名稱",
        "required": true,
        "formField": "name"
    },
    {
        "type": "textarea",
        "label": "活動摘要",
        "required": true,
        "formField": "description"
    },
    {
        "type": "dateTimeRange",
        "label": "活動時間",
        "required": true,
        "formField": "dates"
    },
    {
        "type": "organization",
        "label": "主辦單位",
        "required": true,
        "formField": "organizer"
    },
    {
        "type": "organizationMember",
        "label": "講者/主持",
        "required": true,
        "formField": "performers"
    },
    {
        "type": "editor",
        "required": true
    }
])
const isLoading = ref<boolean>(false)
const repoUser = useRepoUser()
const eventList = ref<IEventFromList[]>([])
const shareTooltipVisible = ref(false)
const id = ref<string>(crypto.randomUUID())
const seoName = ref<string>('')
const isSeoNameValid = ref<boolean>(false)
const repoUI = useRepoUI()
const columnSpan = ref<number>(8)
const repoEvent = useRepoEvent()
const userForm = ref<IUser>({
    id: '',
    name: '',
    description: '',
    seoName: '',
    seoTitle: '',
})
const templateTemp = ref<ITemplateDragSouce>({
    item: {
        type: '', // 拖曳中的判斷欄位
        id: '', // 是否為新增的判斷欄位
    },
    index: -1
})
// 主要的模板資料
const userTemplate = ref<IEventTemplate>({
    id: '',
    designs: [] as ITemplateDesign[]
})

// Hooks
onMounted(async () => {
    isLoading.value = true
    await getEventList()
    window.addEventListener('resize', setColumnSpan)
    setColumnSpan()
    isLoading.value = false
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setColumnSpan)
})
watch(() => userForm.value, () => {
    updateUserInfo()
}, { deep: true, })
watch(() => repoUser.userInfo, (newValue) => {
    if (newValue.id && !userForm.value.id) {
        const copy: IUser = JSON.parse(JSON.stringify(newValue))
        delete copy.preference
        userForm.value = copy
        isSeoNameValid.value = true
        seoName.value = copy.seoName ?? ''
    }
}, { immediate: true, })

// Methods
function setTemplateItem(itemMeta: ITemplateDesign) {
    Object.assign(templateTemp.value.item, itemMeta)
}

function cancelDragging() {
    templateTemp.value.item.type = ''
}

function getPersonalLink() {
    if (import.meta.client) {
        const { origin } = window.location
        const openInLineExternal = `openExternalBrowser=1`
        return `${origin}/${seoName.value}?${openInLineExternal}`
    }
}

function setColumnSpan() {
    repoUI.debounce(id.value, () => {
        columnSpan.value = 24
        if (repoUI.isMedium) {
            columnSpan.value = 12
        }
    })
}
async function getEventList() {
    const result = await repoEvent.getEventList({
        startDate: new Date(),
        isPublic: true,
        limit: 4,
    })
    eventList.value = result
}

function updateUserInfo() {
    isLoading.value = true
    repoUI.debounce('patchUser', async () => {
        await repoUser.patchUser(userForm.value)
        isLoading.value = false
    })
}

async function insertTemplate(ev: Event, destinationIndex = 0) {
    ev.preventDefault();
    if (!templateTemp.value.item.type) {
        alert('系統BUG, 元件類型遺失請重新拖曳。')
    }
    // 插入元素
    const templateDesign: ITemplateDesign = JSON.parse(JSON.stringify(templateTemp.value.item)) // 必須深拷貝，不然會在清除站存資料時影響到模板
    // 先更新資料庫再更新畫面
    const hasSource = templateTemp.value.index !== -1
    const sourceIndex = Number(templateTemp.value.index)
    if (hasSource) {
        // 屬於原有模板拖曳
        userTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
        // return
        // 刪除原本位置的的模板
        if (destinationIndex < sourceIndex) {
            userTemplate.value.designs.splice(sourceIndex + 1, 1)
        } else {
            userTemplate.value.designs.splice(sourceIndex, 1)
        }
    } else {
        // 屬於新增的模板設計
        const designId = await repoEventTemplate.postEventTemplateDesign({
            ...templateDesign,
            templateId: userTemplate.value.id,
        })
        templateDesign.id = designId
        userTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
    }
    // return
    // 更新模板順序
    repoEventTemplate.patchTemplateDesignIds(userTemplate.value)

    // Reset flags
    templateTemp.value.item.id = '' // 用來判斷是否為新增的欄位
    templateTemp.value.item.type = '' // 用來判斷是否為拖曳中
    templateTemp.value.index = -1
    isCardLoading.value = false
}

</script>
<style lang="scss" scoped>
.userTemplate {
    margin-top: 20px;

    .user__card {

        .user__card__designItem {
            max-width: 100%;
            min-height: 8px;
            line-height: 44px;
            font-size: 20px;
            text-align: center;
            margin: 2px 0px;
        }

        .user__card__designItem--outline {
            outline: 1px dashed red;
        }

        .card__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .user__delete {
        margin-top: 12px;
    }
}

.index__row {
    margin-bottom: 20px;
}

.user__btnGroup {
    display: flex;
    gap: 8px;
    width: 100%;

    .btnGroup__btn {
        width: 100%;
    }
}
</style>