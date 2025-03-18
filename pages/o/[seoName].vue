<template>
    <div class="organization">
        <FormPublicInfoTemplate v-if="organizationProfile.id" v-model="organizationProfile" type="organization">
        </FormPublicInfoTemplate>
        <el-empty v-else description="查無組織">
            <ol>
                可能的原因如下
                <li>專屬網址變更</li>
                <li>組織已被刪除</li>
            </ol>
            <NuxtLink to="/">回首頁</NuxtLink>
        </el-empty>
    </div>
</template>
<script setup lang="ts">
import type { IEventFromList } from '~/types/event'
import type { IPublicInfoCard } from '~/types/ui'
const route = useRoute()
const repoOrganization = useRepoOrganization()
const repoEvent = useRepoEvent()

definePageMeta({
    layout: 'profile'
})

const organizationProfile = ref<IPublicInfoCard>({
    id: '',
})

const eventList = ref<IEventFromList[]>([])

// Hooks
onMounted(() => {
    getOrganization()
    getEvents()
})

const seoName = computed(() => {
    const seoName: string = route.params.seoName as string
    return seoName
})

// Methods
async function getOrganization() {
    const organization = await repoOrganization.getOrganization(seoName.value)
    if (organization) {
        organizationProfile.value = {
            id: String(organization.id),
            name: organization.name,
            seoName:organization.seoName??String(organization.id),
            description: organization.description,
            image: organization.logo,
            banner: organization.banner,
            urlPath: `o/${organization.id}`,
            sameAs: organization.sameAs,
        }
    }
}

async function getEvents() {
    const events = await repoEvent.getEventList({
        organizerId: seoName.value,
        isPublic: true,
    })
    eventList.value = events
}

</script>
<style lang="scss" scoped>
.organization {
    max-width: 480px;
    width: 100%;
    margin: auto;
}
</style>