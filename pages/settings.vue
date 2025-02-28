<template>
    <el-row class="user__btnGroup" :gutter="20">
        <el-col :span="sysBtnSpan">
            <el-button class="btnGroup__item" :icon="WarnTriangleFilled">註銷帳號</el-button>
        </el-col>
        <el-col :span="sysBtnSpan">
            <el-button class="btnGroup__item" :icon="WarnTriangleFilled" :disabled="true">變更密碼</el-button>
        </el-col>
        <el-col :span="sysBtnSpan">
            <el-button class="btnGroup__item" :icon="User">登出</el-button>
        </el-col>
        <el-col :span="sysBtnSpan">
            <el-button v-if="repoUser.userType === 'attendee'" class="btnGroup__item"
                @click="repoUser.setUserType('host')" :icon="Switch">切換為主辦方</el-button>
            <el-button v-if="repoUser.userType === 'host'" class="btnGroup__item"
                @click="repoUser.setUserType('attendee')" :icon="Switch">切換為一般用戶</el-button>
        </el-col>
        <el-col :span="sysBtnSpan">
            <el-button class="btnGroup__item" :icon="Message">許願&抱怨</el-button>
        </el-col>
        <el-col :span="sysBtnSpan">
            <NuxtLink class="btnGroup__item" to="https://github.com/VeKoZ-tw" target="_blank">
                <el-button class="item__btn" :icon="Cpu">
                    開放原始碼
                </el-button>
            </NuxtLink>
        </el-col>
        <!-- </div> -->
    </el-row>
    <el-row class="userTemplate" :gutter="20">
        <el-col :span="repoUI.isMedium ? 16 : 24">
            <el-card class="user__card vekoz-card" body-class="card__body card__body--265">
                <template #header>
                    <div class="vekoz-card-header">
                        <div>
                            <el-button :disabled="isLoading" @click="openPrivateInfo()">
                                變更基本資料
                            </el-button>
                            <el-button :disabled="isLoading" @click="openSeoInfo()">
                                變更名片頁資料
                            </el-button>
                        </div>
                        <div class="header__ui">
                            <el-switch v-model="userTemplate.isPublic" inline-prompt active-text="公開" inactive-text="關閉"
                                size="large" @change="patchUserIsPublic()" />
                            <NuxtLink :to="getPersonalLink()" target="_blank">
                                <el-button v-loading="isLoading" :icon="View">
                                    瀏覽
                                </el-button>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
                <div class="seoPage">
                    <!-- {{ userTemplate }} -->
                    <FormUserTemplate :key="renderKey" v-model="userTemplate" :is-designing="true"
                        :onchange="patchUser">
                    </FormUserTemplate>
                    <!-- <el-card>
                        尚未完成的功能，敬請期待。
                    </el-card> -->
                </div>
            </el-card>
        </el-col>
        <el-col v-if="repoUI.isMedium" :span="8">
            <el-card class="vekoz-card" body-class="card__body card__body--265">
                <template #header>
                    <div class="vekoz-card-header">
                        請拖曳以下元件 到 指定位置
                    </div>
                </template>
                尚未完成的功能，敬請期待。
                <FormDesignDragging type="attendee" @dragstart="setTemplateItem($event)"
                    @mouseenter="setTemplateItem($event)" @mouseout="cancelDragging()"></FormDesignDragging>
            </el-card>
        </el-col>
    </el-row>
    <AtomVekozDialog v-model="isPrivateInfoOpen">
        <template #header>
            基本資料
        </template>
        <FormUserPrivateInfo v-if="isPrivateInfoOpen" v-model="userPrivateInfo">
        </FormUserPrivateInfo>
        <template #footer>
            <el-button v-loading="isLoading" @click="isPrivateInfoOpen = false">
                取消
            </el-button>
            <el-button v-loading="isLoading" @click="confirmUserPrivateInfo">
                確認
            </el-button>
        </template>
    </AtomVekozDialog>
    <AtomVekozDialog v-model="isSeoInfoOpen">
        <template #header>
            名片頁資料
        </template>
        <FormUserSeoInfo v-if="isSeoInfoOpen" :model-value="userSeoInfo" ref="seoFormRef">

        </FormUserSeoInfo>
        <template #footer>
            <el-button v-loading="isLoading" @click="isSeoInfoOpen = false">
                取消
            </el-button>
            <el-button v-loading="isLoading" @click="confirmUserSeoInfo">
                確認
            </el-button>
        </template>
    </AtomVekozDialog>
</template>
<script setup lang="ts">
import { Cpu, User, View, Message, WarnTriangleFilled, Switch } from '@element-plus/icons-vue';
import type { IEventFromList } from '~/types/event';
import type { IUser } from '~/types/user';
import type { ITemplateDragSouce } from '~/types/eventTemplate';
import type { IUserDesign } from '~/types/userDesign';
import type { FormInstance } from 'element-plus';

const repoUser = useRepoUser()
const repoUserDesign = useRepoUserDesign()
const repoEvent = useRepoEvent()
const seoFormRef = ref<FormInstance>()
const renderKey = ref<string>(crypto.randomUUID())

// 其他未歸類
const id = ref<string>(crypto.randomUUID())
const isLoading = ref<boolean>(false)

// UI相關
const repoUI = useRepoUI()
const sysBtnSpan = ref<number>(12)
const columnSpan = ref<number>(8)
const templateTemp = ref<ITemplateDragSouce>({
    item: {
        type: '', // 拖曳中的判斷欄位
        id: '', // 是否為新增的判斷欄位
    },
    index: -1
})

// 主要的模板資料
const userTemplate = ref<IUser>({
    id: '',
    name: '',
    description: '',
    seoName: '',
    seoTitle: '',
    isPublic: false,
    avatar: '',
    designs: [],
    sameAs: [],
})

// 基本資料相關
const isPrivateInfoOpen = ref<boolean>(false)
const userPrivateInfo = ref<{
    id?: string,
    email?: string,
    name?: string,
}>({})

// SEO資料相關
const isSeoInfoOpen = ref<boolean>(false)
const userSeoInfo = ref<{
    id?: string,
    avatar?: any,
    seoName?: string,
    seoTitle?: string,
    description?: string,
}>({})
const seoName = ref<string>('')
const isSeoNameValid = ref<boolean>(false)

// Hooks
onMounted(async () => {
    window.addEventListener('resize', setColumnSpan)
    setColumnSpan()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setColumnSpan)
})
watch(() => repoUser.userInfo, (newValue) => {
    isLoading.value = true
    repoUI.debounce(`initializeUserForm${id.value}`, () => {
        initializeUserForm(newValue)
        isLoading.value = false
    })
}, { immediate: true, })

// Methods
function patchUser() {
    repoUI.debounce(`patchUser-${id.value}`, async () => {
        if (typeof userTemplate.value.avatar !== 'string') {
            const publicUrl = await repoUser.putUserAvatar(userTemplate.value.avatar)
            userTemplate.value.avatar = publicUrl
        }
        await repoUser.patchUser({
            avatar: userTemplate.value.avatar,
            seoTitle: userTemplate.value.seoTitle,
            description: userTemplate.value.description,
            sameAs: userTemplate.value.sameAs,
        })
        renderKey.value = crypto.randomUUID()
    })
}

// async function handleDesignChanged(userDesign: IUserDesign) {
//     const userPatch = await repoUserDesign.patchUserDesign(userDesign)
//     if (userPatch) {
//         Object.assign(userTemplate.value, userPatch)
//     }
// }

function openSeoInfo() {
    userSeoInfo.value.id = userTemplate.value.id ?? ''
    userSeoInfo.value.seoName = userTemplate.value.seoName ?? ''
    userSeoInfo.value.seoTitle = userTemplate.value.seoTitle ?? ''
    userSeoInfo.value.description = userTemplate.value.description
    userSeoInfo.value.avatar = userTemplate.value.avatar
    userSeoInfo.value.description = userTemplate.value.description
    isSeoInfoOpen.value = true
}

async function confirmUserSeoInfo() {
    const isValidForm = await seoFormRef.value?.validate()
    if (!isValidForm) {
        return
    }
    isSeoInfoOpen.value = false
    try {
        await repoUser.patchUser(userSeoInfo.value)
        userTemplate.value.seoName = userSeoInfo.value.seoName
    } catch (error) {
        openSeoInfo()
    }
}


function patchUserIsPublic() {
    repoUser.patchUser({
        id: userTemplate.value.id,
        isPublic: userTemplate.value.isPublic
    })
}

function openPrivateInfo() {
    isPrivateInfoOpen.value = true
    userPrivateInfo.value.id = userTemplate.value.id ?? ''
    userPrivateInfo.value.email = userTemplate.value.email ?? ''
    userPrivateInfo.value.name = userTemplate.value.name ?? ''
}

async function confirmUserPrivateInfo() {
    isLoading.value = true
    delete userPrivateInfo.value.email
    // await repoUser.patchUser(userPrivateInfo.value)
    Object.assign(userTemplate.value, userPrivateInfo.value)
    const header1Design = userTemplate.value.designs?.find(design => design.formField === 'name')
    if (header1Design) {
        header1Design.value = userPrivateInfo.value.name
    }
    isLoading.value = false
    isPrivateInfoOpen.value = false
}

async function initializeUserForm(newValue: IUser) {
    if (!newValue.id || !userTemplate.value.designs) {
        return
    }
    const userInfoCopy: IUser = JSON.parse(JSON.stringify(newValue))
    delete userInfoCopy.preference
    // if (!userInfoCopy.designs?.length && !userTemplate.value.designs.length) {
    //     const defaultDesigns: IUserDesign[] = [
    //         {
    //             type: 'avatar',
    //             value: 'https://storage.googleapis.com/public.venonia.com/organization/B5TtVn9U2op8zXR2hIOA/logo/65d42353-7353-4d73-be75-c10d426273a0.jpeg',
    //             required: true,
    //             formField: 'avatar',
    //         },
    //         {
    //             type: 'header1',
    //             value: 'EN Chu',
    //             alignment: 'center',
    //             required: true,
    //             formField: 'seoTitle',
    //         },
    //         {
    //             type: 'textarea',
    //             value: '',
    //             alignment: 'center',
    //             required: true,
    //             formField: 'description',
    //         },
    //         {
    //             type: 'socialMedia',
    //             urls: [],
    //             required: true,
    //             formField: 'socialMedia',
    //         },
    //         {
    //             type: 'eventHostHistory',
    //             required: true,
    //         },
    //     ]
    //     const createdDesign = await repoUserDesign.postUserDesigns(defaultDesigns)
    //     userInfoCopy.designs = createdDesign
    // }
    userTemplate.value = userInfoCopy
}
function setTemplateItem(itemMeta: IUserDesign) {
    Object.assign(templateTemp.value.item, itemMeta)
}

function cancelDragging() {
    templateTemp.value.item.type = ''
}

function getPersonalLink() {
    const openInLineExternal = `openExternalBrowser=1`
    return `${userTemplate.value.seoName}?${openInLineExternal}`
}

function setColumnSpan() {
    repoUI.debounce(id.value, () => {
        columnSpan.value = 24
        sysBtnSpan.value = 12
        if (repoUI.isMedium) {
            columnSpan.value = 12
            sysBtnSpan.value = 8
        }
        if (repoUI.isLarge) {
            sysBtnSpan.value = 6
        }
        if (repoUI.isXLarge) {
            sysBtnSpan.value = 4
        }
    })
}

async function insertTemplate(ev: Event, destinationIndex = 0) {
    ev.preventDefault();
    if (!templateTemp.value.item.type) {
        alert('系統BUG, 元件類型遺失請重新拖曳。')
    }
    // // 插入元素
    // const templateDesign: ITemplateDesign = JSON.parse(JSON.stringify(templateTemp.value.item)) // 必須深拷貝，不然會在清除站存資料時影響到模板
    // // 先更新資料庫再更新畫面
    // const hasSource = templateTemp.value.index !== -1
    // const sourceIndex = Number(templateTemp.value.index)
    // if (hasSource) {
    //     // 屬於原有模板拖曳
    //     userTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
    //     // return
    //     // 刪除原本位置的的模板
    //     if (destinationIndex < sourceIndex) {
    //         userTemplate.value.designs.splice(sourceIndex + 1, 1)
    //     } else {
    //         userTemplate.value.designs.splice(sourceIndex, 1)
    //     }
    // } else {
    //     // 屬於新增的模板設計
    //     const designId = await repoEventTemplate.postEventTemplateDesign({
    //         ...templateDesign,
    //         templateId: userTemplate.value.id,
    //     })
    //     templateDesign.id = designId
    //     userTemplate.value.designs.splice(destinationIndex, 0, templateDesign)
    // }
    // // return
    // // 更新模板順序
    // repoEventTemplate.patchTemplateDesignIds(userTemplate.value)

    // // Reset flags
    // templateTemp.value.item.id = '' // 用來判斷是否為新增的欄位
    // templateTemp.value.item.type = '' // 用來判斷是否為拖曳中
    // templateTemp.value.index = -1
    // isCardLoading.value = false
}

function allowDrop(ev: any) {
    ev.preventDefault();
}

</script>
<style lang="scss" scoped>
.header__ui {
    display: flex;
    align-items: center;
    gap: 20px;
}

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

    .btnGroup__item {
        width: 100%;
        flex-wrap: wrap;

        .item__btn {
            width: 100%;
        }
    }
}

.seoPage {
    display: flex;
    flex-direction: column;
    gap: 20px;
    // background-image: url('@/assets/mock/background.jpg');
}
</style>