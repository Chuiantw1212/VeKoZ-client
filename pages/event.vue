<template>
    <div class="event">
        <div class="event__header">
            <h1>活動管理</h1>
            <NuxtLink to="/eventTemplate">點此設計活動套板</NuxtLink>
        </div>
        <br />
        <VotionCalendar v-model="form" @create="createNewEvent($event)">
        </VotionCalendar>

        <el-dialog v-model="dialogVisible" title="活動編輯" @close="dialogVisible = false" :lock-scroll="true">
            <FormTemplateDesign v-model="eventTemplate.designs"></FormTemplateDesign>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="createEvent()">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/molecule/VotionCalendar.vue';
import useRepoEvent from '~/composables/useRepoEvent';
import type { IOrganizationMember } from '~/types/organization';
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'

const repoEvent = useRepoEvent()

const dialogVisible = ref(false)
// const dialogTableVisible = ref(false)

const eventTemplate = ref<IEventTemplate>({
    designs: []
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
async function getEventTemplate() {
    const result = await repoEvent.getEventTemplate()
    Object.assign(eventTemplate, result)
}

async function createNewEvent(data: any) {
    const seoDateTimeRange = eventTemplate.value.designs.find((design) => {
        return design.type === 'dateTimeRange'
    })
    if (seoDateTimeRange) {
        // seoDateTimeRange = []
    }
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