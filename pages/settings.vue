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
                            <NuxtLink :to="getPersonalLink()" target="_blank">
                                <el-button v-loading="isLoading" :icon="View">
                                    瀏覽
                                </el-button>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
                <FormUserProfile :model-value="userForm">

                </FormUserProfile>
            </el-card>
            <el-divider>
                歷史活動紀錄
            </el-divider>
            <el-row :gutter="20" class="index__eventList">
                <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                    <MoleculeVenoniaCard class="index__card">
                        <template #default>
                            <NuxtLink to="/event/123">
                                <img v-if="item.banner" :src="item.banner" style="width: 100%" />
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
            <el-card class="venonia-card" body-class="card__body card__body--205">
                <template #header>
                    <div class="venonia-card-header">
                        請拖曳以下元件 到 指定位置
                    </div>
                </template>
                <FormDesignDragging></FormDesignDragging>
            </el-card>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import { StarFilled, View } from '@element-plus/icons-vue';
import type { IEventFromList } from '~/types/event';
import type { IUser } from '~/types/user';
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