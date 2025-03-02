<template>
    <div class="organization">
        <!-- 組織專屬頁面 -->
        <div class="organization__bannerWrap">
            <img class="organization__banner" :src="organization.banner">
        </div>
        <div class="organization__headerGroup">
            <img class="headerGroup__logo" :src="organization.logo">
            <h1 class="headerGroup__title">{{ organization.name }}</h1>
            <div class="headerGroup__followers">XX人追蹤</div>
        </div>
        <!-- <MoleculeEventCard :model-value="item">

        </MoleculeEventCard> -->
        <!-- <MoleculeVekozCalendar></MoleculeVekozCalendar> -->
        <el-main>

        </el-main>
    </div>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
const route = useRoute()
const repoOrganization = useRepoOrganization()
const repoEvent = useRepoEvent()

definePageMeta({
    layout: 'profile'
})

const organization = ref<IOrganization>({})

// Hooks
onMounted(() => {
    getOrganization()
    getEvents()
})

const organizatoinId = computed(() => {
    const organizationId: string = route.params.id as string
    return organizationId
})

// Methods
async function getOrganization() {
    organization.value = await repoOrganization.getOrganization(organizatoinId.value)
}

async function getEvents() {
    const events = await repoEvent.getEvent({
        organizerId: organizatoinId.value
    })
}

</script>
<style lang="scss" scoped>
.organization {
    max-width: 1280px;
    width: 100%;
    margin: auto;

    .organization__bannerWrap {
        height: 0px;
    }

    .organization__banner {
        display: block;
        width: 100%;
        max-width: 1280px;
        border-radius: 0px 0px 12px 12px;
        top: 0px;
    }

    .organization__headerGroup {
        margin-top: calc(50vw - 55px);
        z-index: 10;

        .headerGroup__logo {
            border-radius: 50%;
            width: 110px;
            margin: auto;
            display: block;
        }

        .headerGroup__title {
            text-align: center;
        }

        .headerGroup__followers {
            text-align: center;
        }
    }
}
</style>