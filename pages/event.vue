<template>
    <div class="event">
        <div class="event__header">
            <h1>活動管理</h1>
            <NuxtLink to="/eventTemplate">點此設計活動套板</NuxtLink>
        </div>
        <br />
        <VotionCalendar v-model="form">
        </VotionCalendar>
    </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/molecule/VotionCalendar.vue';
import useRepoEvent from '~/composables/useRepoEvent';
const repoEvent = useRepoEvent()

const dialogVisible = ref(false)

const organizationTemplate = reactive({
    description: '',
})

const form = reactive({
    name: '',
    locationName: '',
    locationAddress: '',
    virtualLocationUrl: '',
    description: '', // html
    startDate: '',
    endDate: '',
})

// methods
async function putEventTemplate() {
    await repoEvent.putEventTemplate(organizationTemplate)
    dialogVisible.value = false
}

async function editEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(organizationTemplate, result)
    dialogVisible.value = true
}

async function getEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(form, result)
}

onMounted(() => {
    getEventTemplate()
})

</script>

<style lang="scss" scoped>
.event {
    .event__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>