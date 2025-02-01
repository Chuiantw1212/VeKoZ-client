<template>
    <div class="event">
        <div class="event__header">
            <h1>事件管理</h1>
            <el-button @click="editEventTemplate">事件樣板</el-button>
        </div>
        <br />
        <VotionCalendar v-model="form">
        </VotionCalendar>

        <el-dialog v-model="dialogVisible" title="事件樣板" class="event__template">
            <FormEventTemplate v-if="dialogVisible" v-model="organizationTemplate"></FormEventTemplate>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="putEventTemplate">
                    確認
                </el-button>
            </template>
        </el-dialog>
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