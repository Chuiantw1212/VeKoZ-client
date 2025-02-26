<template>
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" @dragstart="emit('dragstart')">
        <!-- <el-input v-if="customDesign" v-model="customDesign.value" :maxlength="maxlength" :show-word-limit="true"
            :placeholder="placeholder" :disabled="disabled" :size="size"></el-input> -->
    </el-form-item>
    <MoleculeDesignToolbar>
        <el-row :gutter="20" class="index__eventList">
            <el-col v-for="(item) in eventList" :span="columnSpan" class="index__row">
                <MoleculeEventCard :model-value="item">

                </MoleculeEventCard>
                <!-- <MoleculeVenoniaCard class="index__card">
                    <template #default>
                        <img :src="item.banner" style="width: 100%" />
                    </template>
<template #footer>
                        <span>
                            2024/11/01
                        </span>
                        <span>
                            7.8
                            <el-icon>
                                <StarFilled />
                            </el-icon>
                        </span>
                    </template>
</MoleculeVenoniaCard> -->
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
const columnSpan = ref<number>(24)
const repoUI = useRepoUI()

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

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    // setDefaultValue()
    handleChange(newValue)
}, { deep: true })


async function getEventList() {
    /**
     * 要拉取近期主辦的活動
     */
    const result = await repoEvent.getEventList({
        startDate: new Date(),
        isPublic: true,
        limit: 4,
    })
    eventList.value = result
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
</script>