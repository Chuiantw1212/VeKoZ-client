<template>
    <div>
        <!-- <h1>{{ userForm.seoTitle }}</h1> -->
        <el-card class="venonia-card">
            <template #header>
                <div class="venonia-card-header">
                    <div></div>
                    <div>
                        <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                            <el-button v-loading="isLoading" :icon="Share" @click="shareLink()">
                                分享網址
                            </el-button>
                        </el-tooltip>
                        <el-button :icon="FullScreen">QR Code</el-button>
                    </div>
                </div>
            </template>
            <FormUserProfile :model-value="userForm" :disabled="true"></FormUserProfile>
        </el-card>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})
import { Share } from '@element-plus/icons-vue';
import { FormUserProfile } from '#components';
import { StarFilled, View, FullScreen } from '@element-plus/icons-vue';
import type { IEventFromList } from '~/types/event';
import type { IUser } from '~/types/user';
const route = useRoute()
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
onMounted(() => {
    getPublicUserInfo()
    // const { seoName } = route.params as any
    // console.log({
    //     seoName
    // })
})

// Methods
async function getPublicUserInfo() {
    const { seoName } = route.params as any
    const user = await repoUser.getPublicUser(seoName)
    userForm.value = user
}

async function shareLink() {
    const { origin } = window.location
    const openInLineExternal = `openExternalBrowser=1`
    const {
        id,
        seoName,
        seoTitle,
        description
    } = userForm.value
    const seoId = seoName || id
    const url = `${origin}/${seoId}?${openInLineExternal}`
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