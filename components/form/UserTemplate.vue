<template>
    <div class="userProfilePage">
        <OrganismDesignProfile v-model="userTemplate" :isDesigning="isDesigning"></OrganismDesignProfile>
        <el-divider>近期公開活動</el-divider>
        <el-carousel type="card">
            <el-carousel-item v-for="(event) in eventList">
                <MoleculeEventCard :model-value="event">

                </MoleculeEventCard>
                <!-- <img :src="event.banner"> -->
            </el-carousel-item>
        </el-carousel>
        <div v-if="userTemplate.designs">
            <template v-for="(design, index) in userTemplate.designs">
                <OrganismDesignAvatarUploader v-if="design.type === 'avatar'" v-model="userTemplate.designs[index]"
                    :onchange="onchange" :required="design.required" :disabled="props.disabled" :show-label="false"
                    @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                    @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                    @mouseout="emit('mouseout')">
                </OrganismDesignAvatarUploader>
                <!-- <OrganismDesignEventHistory v-model="userTemplate.designs[index]" :onchange="onchange"
                    :required="design.required" :disabled="props.disabled" :show-label="false"
                    @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                    @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                    @mouseout="emit('mouseout')">
                </OrganismDesignEventHistory> -->
                <template v-if="design.type === 'header1'">
                    <OrganismDesignHeader1 v-if="isDesigning" v-model="userTemplate.designs[index]" :onchange="onchange"
                        :required="design.required" :disabled="props.disabled" :show-label="false"
                        @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                        @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                        @mouseout="emit('mouseout')">
                    </OrganismDesignHeader1>
                    <h1 v-else>{{ userTemplate.designs[index].value }}</h1>
                </template>
                <template v-if="design.type === 'textarea'">
                    <OrganismDesignTextarea v-if="isDesigning" v-model="userTemplate.designs[index]"
                        :onchange="onchange" :required="design.required" :disabled="props.disabled" :show-label="false"
                        @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                        @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                        @mouseout="emit('mouseout')">
                    </OrganismDesignTextarea>
                    <p v-else>{{ userTemplate.designs[index].value }}</p>
                </template>
                <OrganismDesignSocialMedia v-if="design.type === 'socialMedia'" v-model="userTemplate.designs[index]"
                    :onchange="onchange" :required="design.required" :disabled="props.disabled" :show-label="false"
                    @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                    @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                    @mouseout="emit('mouseout')">
                </OrganismDesignSocialMedia>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import type { IEventFromList } from '~/types/event';
import type { IUser } from '~/types/user';

const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change', 'mouseenter', 'mouseout'])

const eventRepo = useRepoEvent()
const userTemplate = defineModel<IUser>('modelValue', {
    type: Object,
    default: {
        id: '',
        seoName: '',
        designs: [],
    },
})

const props = defineProps({
    isDesigning: {
        type: Boolean,
        default: false
    },
    onchange: {
        type: Function,
        default: () => { }
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})

const formRef = ref<FormInstance>()
const eventList = ref<IEventFromList[]>([])

// Hooks
watch(() => userTemplate.value.id, (value) => {
    getEventList()
}, { immediate: true })

// methods
async function getEventList() {
    if (userTemplate.value.id) {
        const result = await eventRepo.getEventList({
            performerIds: [userTemplate.value.id],
        })
        eventList.value = [...result, ...result, ...result]
    }
}

async function validate() {
    return await formRef.value?.validate()
}
function handleRemove(index: number) {
    if (!userTemplate.value.designs) {
        return
    }
    const item = userTemplate.value.designs[index]
    emit('remove', {
        item,
        index,
    })
}
function handleDragStart(index: number) {
    if (!userTemplate.value.designs) {
        return
    }
    const item = userTemplate.value.designs[index]
    emit('dragstart', {
        item: JSON.parse(JSON.stringify(item)),
        index,
    })
}
function handleUp(index: number) {
    if (!userTemplate.value.designs) {
        return
    }
    const removedElements = userTemplate.value.designs.splice(index, 1)
    const target = removedElements[0]
    if (target) {
        const newIndex = Math.max(0, index - 1)
        userTemplate.value.designs.splice(newIndex, 0, target)
    }
}
function handleDown(index: number) {
    if (!userTemplate.value.designs) {
        return
    }
    const removedElements = userTemplate.value.designs.splice(index, 1)
    const target = removedElements[0]
    if (target) {
        const newIndex = Math.min(userTemplate.value.designs.length, index + 1)
        userTemplate.value.designs.splice(newIndex, 0, target)
    }
}
defineExpose({
    validate,
})
</script>
<style lang="scss" scoped>
.userProfilePage {
    max-width: 480px;
    margin: auto;
}

.designForm {
    width: 100%;
}

.icon {
    height: 24px;
    width: 24px;
}

.profile {
    :deep(.el-card__header) {
        border-bottom: 0px;

    }

    .profile__header {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        height: 32px; // template共同高度

        >* {
            margin-bottom: 0px; // 除掉form-item的maargon-bottom
        }
    }

    .profile__avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: auto;
        display: block;
    }

    .profile__name {
        text-align: center;
        margin: 1.25rem 0px;
    }
}

.profile--borderless {
    border: 0px;
    box-shadow: unset;
}
</style>