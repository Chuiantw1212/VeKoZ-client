<template>
    <div>
        講者個人頁
        <el-card>
            <template #header>
                <!-- <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                                <el-button v-loading="isLoading" :icon="Share" @click="shareLink()">
                                    分享網址
                                </el-button>
                            </el-tooltip> -->
            </template>
        </el-card>
    </div>
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