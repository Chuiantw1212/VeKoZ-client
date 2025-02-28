<template>
    <!-- <div> -->
    <FormUserTemplate v-model="userForm" :is-designing="false"></FormUserTemplate>
    <!-- <FormUserProfile :model-value="userForm" :disabled="true"></FormUserProfile> -->
    <!-- <MoleculeVenoniaCalendar></MoleculeVenoniaCalendar> -->
    <!-- </div> -->
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'profile'
})
import type { IEventFromList } from '~/types/event';
import type { IUser } from '~/types/user';
const route = useRoute()
const repoUser = useRepoUser()
const eventList = ref<IEventFromList[]>([])
const shareTooltipVisible = ref(false)
const id = ref<string>(crypto.randomUUID())
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