<template>
    <el-row class="user" :gutter="20">
        <el-col :span="repoUI.isMedium ? 16 : 24">
            <div class="user__btnGroup">
                <el-button class="btnGroup__btn" :disabled="true">變更密碼</el-button>
                <el-button class="btnGroup__btn">登出</el-button>
                <el-button v-if="repoUser.userType === 'attendee'" class="btnGroup__btn"
                    @click="repoUser.setUserType('host')">切換為主辦方</el-button>
                <el-button v-if="repoUser.userType === 'host'" class="btnGroup__btn"
                    @click="repoUser.setUserType('attendee')">切換為一般用戶</el-button>
            </div>
            <el-card class="user__card">
                <template #header>
                    <div class="card__header">
                        <div>
                            個人資料與名片頁
                        </div>
                        <div>
                            <el-button v-loading="isLoading" :icon="View">
                                預覽
                            </el-button>
                            <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                                <el-button v-loading="isLoading" :icon="Share" @click="shareLink()">
                                    分享網址
                                </el-button>
                            </el-tooltip>
                        </div>
                    </div>
                </template>
                <el-form label-width="auto">
                    <el-row justify="center">
                        <el-col :span="6">
                            <el-form-item>
                                <img class="card__avatar" src="@/assets/mock/user.jpg">
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row justify="space-between" :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="註冊Email">
                                <el-input v-model="userForm.email" placeholder="請輸入Email" :disabled="true">
                                    <template #suffix>
                                        (僅主辦方可見)
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="暱稱/姓名">
                                <el-input v-model="userForm.name" placeholder="請輸入暱稱或姓名" :maxlength="30"
                                    :show-word-limit="true">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="名片頁網址">
                                <el-input v-model="seoName" :maxlength="30" placeholder="例：en-chu"
                                    :show-word-limit="true" @change="patchSeoName()">
                                    <template #prefix>
                                        https://venonia.com/
                                    </template>
                                    <template #suffix>
                                        <el-icon v-if="isSeoNameValid" color="#67c23a" v-loading="isSeoNameLoading">
                                            <CircleCheck></CircleCheck>
                                        </el-icon>
                                        <el-icon v-else color="#f56c6c" v-loading="isSeoNameLoading">
                                            <CircleClose></CircleClose>
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="名片頁標題">
                                <el-input v-model="userForm.seoTitle" :maxlength="30" placeholder="例：EN Chu，一個善於理財的工程師"
                                    :show-word-limit="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="描述">
                                <el-input v-model="userForm.description" type="textarea" :rows="3" :maxlength="150"
                                    placeholder="請輸入簡介" :show-word-limit="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-divider>
                    近期主辦(2場)與評價
                </el-divider>
                <!-- <el-card class="user__card"> -->
                <el-row :gutter="20" class="index__eventList">
                    <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                        <MoleculeVenoniaCard class="index__card">
                            <template #default>
                                <NuxtLink to="/event/123">
                                    <img src="https://storage.googleapis.com/public.venonia.com/eventTemplateDesign%2FimKB1tyxFBlthb4fBbaG%2Fbanner.png"
                                        style="width: 100%" />
                                </NuxtLink>
                            </template>
                            <template #footer>
                                <span>
                                    2024/11/01
                                </span>
                                <span>
                                    7.8
                                    <el-icon>
                                        <StarFilled />
                                    </el-icon>
                                </span>
                            </template>
                        </MoleculeVenoniaCard>
                    </el-col>
                </el-row>
            </el-card>
            <el-divider>
                許願與抱怨
            </el-divider>
            <p>VeKoZ為EN Chu獨立開發。</p>
            <p>打開掃Line即可聯絡作者本人。</p>
            <p>開發進度歡迎到Github查看。</p>
            <el-divider>
                系統功能
            </el-divider>
            <div class="user__delete">
                <el-button :style="{ 'width': '100%' }" type="danger">帳號註銷</el-button>
            </div>
        </el-col>
        <el-col v-if="repoUI.isMedium" :span="8">
            <el-card>
                模板設計系統
            </el-card>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import { Share, StarFilled, CircleCheck, View, CircleClose } from '@element-plus/icons-vue';
import type { IEvent } from '~/types/event';
import type { IUser } from '~/types/user';
const isLoading = ref<boolean>(false)
const isSeoNameLoading = ref<boolean>(false)
const repoUser = useRepoUser()
const eventList = ref<IEvent[]>([])
const shareTooltipVisible = ref(false)
const id = ref<string>(crypto.randomUUID())
const userForm = ref<IUser>({
    id: '',
    name: '',
    description: '',
    seoName: '',
    seoTitle: '',
})
const seoName = ref<string>('')
const isSeoNameValid = ref<boolean>(false)
const eventForm = ref<IEvent>({
    startDate: new Date(),
})
const repoUI = useRepoUI()
const columnSpan = ref<number>(8)
const repoEvent = useRepoEvent()

// Hooks
onMounted(async () => {
    isLoading.value = true
    const startOfTheMonth = new Date()
    startOfTheMonth.setDate(0)
    eventForm.value.startDate = startOfTheMonth
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
        ...eventForm.value,
        isPublic: true,
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

async function patchSeoName() {
    isSeoNameLoading.value = true
    repoUI.debounce('patchUserSeoName', async () => {
        const result = await repoUser.patchUserSeoName({
            seoName: seoName.value,
            id: userForm.value.id
        })
        isSeoNameValid.value = result.status === 200
        isSeoNameLoading.value = false
    })
}

async function shareLink() {
    const { origin } = window.location
    const openInLineExternalBrowser = `openExternalBrowser=1`
    const {
        id,
        seoName,
        seoTitle,
        description
    } = userForm.value
    const seoId = seoName || id
    const url = `${origin}/${seoId}?${openInLineExternalBrowser}`
    if (!navigator.share) {
        await navigator.share({
            title: seoTitle,
            text: description,
            url,
        });
    } else {
        await navigator.clipboard.writeText(url)
        shareTooltipVisible.value = true
    }
}

</script>
<style lang="scss" scoped>
.user {
    padding-bottom: 60px; // footer menu height

    .user__card {
        margin-top: 20px;

        .card__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card__avatar {
            display: block;
            width: 118px;
            height: 118px;
            border-radius: 50%;
            margin: auto;
        }

        .card__editor {
            margin-top: 20px;
        }

        .item__body {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;

            >:first-child {
                width: 100%;
            }
        }
    }

    .user__btnGroup {
        display: flex;
        gap: 8px;

        .btnGroup__btn {
            width: 100%;
        }
    }

    .user__delete {
        margin-top: 12px;
    }
}

.index__row {
    margin-bottom: 20px;
}
</style>