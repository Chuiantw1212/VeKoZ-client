<template>
    <div class="organization">
        <FormPublicInfoTemplate v-if="organization.id" v-model="organizationProfile" type="organization">
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
import type { IOrganization } from '~/types/organization'
import type { IPublicInfoCard } from '~/types/ui'
const route = useRoute()
const repoOrganization = useRepoOrganization()
const repoEvent = useRepoEvent()

definePageMeta({
    layout: 'profile'
})

const organizationProfile = ref<IPublicInfoCard>({})

const organization = ref<IOrganization>({})
const eventList = ref<IEventFromList[]>([])

// Hooks
onMounted(() => {
    getOrganization()
    getEvents()
})

const organizatoinId = computed(() => {
    const organizationId: string = route.params.organizationId as string
    return organizationId
})

// Methods
async function getOrganization() {
    const organization = await repoOrganization.getOrganization(organizatoinId.value)
    if (organization) {
        organizationProfile.value = {
            id: organization.id,
            name: organization.name,
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
        organizerId: organizatoinId.value,
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