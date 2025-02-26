<template>
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" @dragstart="emit('dragstart')">
        <el-divider>近期主辦活動</el-divider>
        <el-row :gutter="20" class="index__eventList">
            <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                <MoleculeEventCard :model-value="item">
                </MoleculeEventCard>
            </el-col>
        </el-row>
    </el-form-item>
    <MoleculeDesignToolbar v-else>
        <el-divider>近期主辦活動</el-divider>
        <el-row :gutter="20" class="index__eventList">
            <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                <MoleculeEventCard :model-value="item">
                </MoleculeEventCard>
            </el-col>
        </el-row>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { IEventFromList } from '~/types/event'
import type { ITemplateDesign } from '~/types/eventTemplate'

const emit = defineEmits(['dragstart'])
const isLoading = ref<boolean>(false)
const repoEvent = useRepoEvent()
const eventList = ref<IEventFromList[]>([])
const columnSpan = ref<number>(12)
// const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'eventHistory',
    }
})

const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
})

// Hooks
onMounted(async () => {
    isLoading.value = true
    await getEventList()
    isLoading.value = false
})

async function getEventList() {
    /**
     * 要拉取近期主辦的活動
     */
    const result = await repoEvent.getEventList({
        startDate: new Date(),
        isPublic: true,
        // limit: 4,
    })
    eventList.value = result
}
</script>