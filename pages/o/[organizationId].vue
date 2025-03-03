<template>
    <div class="organization">
        <!-- <OrganismDesignProfile v-model="organizationProfile"></OrganismDesignProfile> -->
        <FormPublicInfoTemplate v-model="organizationProfile" type="organization"></FormPublicInfoTemplate>
        <!-- <div class="organization__bannerWrap">
            <img class="organization__banner" :src="organization.banner">
        </div>
        <div class="organization__headerGroup">
            <img class="headerGroup__logo" :src="organization.logo">
            <h1 class="headerGroup__title">{{ organization.name }}</h1>
            <div class="headerGroup__followers">
                已有 XX人追隨
            </div>
        </div>
        <el-main>
            <div class="headerGroup__desc">{{ organization.description }}</div>
        </el-main>
        <el-main>
            <el-row>
                <el-col v-for="event in eventList" class="me-20">
                    <MoleculeEventCard :model-value="event">
                    </MoleculeEventCard>
                </el-col>
            </el-row>
        </el-main> -->
    </div>
</template>
<script setup lang="ts">
import { CollectionTag } from '@element-plus/icons-vue'
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
    organizationProfile.value = {
        id: organization.id,
        name: organization.name,
        description: organization.description,
        image: organization.logo,
        banner: organization.banner,
        link: `o/${organization.id}`,
        sameAs: organization.sameAs,
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

    // .organization__bannerWrap {
    //     height: calc(50vw - 55px);
    //     max-height: 240px;
    // }

    .organization__banner {
        display: block;
        width: 100%;
        max-width: 1280px;
        border-radius: 0px 0px 12px 12px;
        top: 0px;
    }

    // .organization__headerGroup {
    //     // margin-top: calc(50vw - 55px);
    //     z-index: 10;

    //     .headerGroup__logo {
    //         border-radius: 50%;
    //         width: 110px;
    //         margin: auto;
    //         display: block;
    //     }

    //     .headerGroup__title {
    //         text-align: center;
    //         margin-bottom: 0px;
    //     }

    //     .headerGroup__desc {
    //         margin-top: 20px;
    //     }

    //     .headerGroup__followers {
    //         text-align: center;
    //     }
    // }
}

.me-20 {
    margin-bottom: 20px;
}
</style>