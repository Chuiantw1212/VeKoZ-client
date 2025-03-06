<template>
    <div class="userProfilePage">
        <OrganismDesignProfile class="userProfilePage__landing" v-model="publicInfo" :onchange="onchange"
            :isDesigning="isDesigning" :disabled="disabled">
        </OrganismDesignProfile>
        <!-- <OrganismDesignSocialMedia v-if="publicInfo.sameAs" v-model="publicInfo.sameAs">
        </OrganismDesignSocialMedia> -->
        <!-- publicInfo{{ publicInfo.sameAs }} -->

        <el-divider class="userProfilePage__divider">近期公開活動</el-divider>
        <template v-if="eventList.length">
            <el-carousel type="card" :autoplay="false">
                <el-carousel-item v-for="(event) in eventList">
                    <MoleculeEventCard :model-value="event" :disabled="disabled || isDesigning"></MoleculeEventCard>
                </el-carousel-item>
            </el-carousel>
        </template>
        <template v-else>
            <el-card class="notFound">
                <el-empty description="無">
                </el-empty>
            </el-card>
        </template>
        <!-- <div v-if="publicInfo.designs">
            <template v-for="(design, index) in publicInfo.designs">
                <OrganismDesignAvatarUploader v-if="design.type === 'avatar'" v-model="publicInfo.designs[index]"
                    :onchange="onchange" :required="design.required" :disabled="props.disabled" :show-label="false"
                    @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                    @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                    @mouseout="emit('mouseout')">
                </OrganismDesignAvatarUploader>
                <template v-if="design.type === 'header1'">
                    <OrganismDesignHeader1 v-if="isDesigning" v-model="publicInfo.designs[index]" :onchange="onchange"
                        :required="design.required" :disabled="props.disabled" :show-label="false"
                        @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                        @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                        @mouseout="emit('mouseout')">
                    </OrganismDesignHeader1>
                    <h1 v-else>{{ publicInfo.designs[index].value }}</h1>
                </template>
<template v-if="design.type === 'textarea'">
                    <OrganismDesignTextarea v-if="isDesigning" v-model="publicInfo.designs[index]"
                        :onchange="onchange" :required="design.required" :disabled="props.disabled" :show-label="false"
                        @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                        @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                        @mouseout="emit('mouseout')">
                    </OrganismDesignTextarea>
                    <p v-else>{{ publicInfo.designs[index].value }}</p>
                </template>
<OrganismDesignSocialMedia v-if="design.type === 'socialMedia'" v-model="publicInfo.designs[index]" :onchange="onchange"
    :required="design.required" :disabled="props.disabled" :show-label="false" @dragstart="handleDragStart(index)"
    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
    @mouseenter="emit('mouseenter', design.type)" @mouseout="emit('mouseout')">
</OrganismDesignSocialMedia>
</template>
</div> -->
    </div>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import type { IEventFromList, IEventQuery } from '~/types/event';
import type { IPublicInfoCard } from '~/types/ui';
import type { IUser } from '~/types/user';

const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change', 'mouseenter', 'mouseout'])

const eventRepo = useRepoEvent()
const publicInfo = defineModel<IPublicInfoCard>('modelValue', {
    type: Object,
    default: {
        id: '',
        seoName: '',
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
    type: {
        type: String,
        default: 'user',
    },
})

const formRef = ref<FormInstance>()
const eventList = ref<IEventFromList[]>([])

// Hooks
watch(() => publicInfo.value.id, (value) => {
    getEventList()
}, { immediate: true })

// methods
async function getEventList() {
    if (publicInfo.value.id) {
        const payload: IEventQuery = {}
        if (props.type === 'user') {
            payload.performerIds = [publicInfo.value.id]
        }
        if (props.type === 'organization') {
            payload.organizerId = publicInfo.value.id
        }
        const result = await eventRepo.getEventList(payload)
        eventList.value = result
    }
}

async function validate() {
    return await formRef.value?.validate()
}
// function handleRemove(index: number) {
//     if (!publicInfo.value.designs) {
//         return
//     }
//     const item = publicInfo.value.designs[index]
//     emit('remove', {
//         item,
//         index,
//     })
// }
// function handleDragStart(index: number) {
//     if (!publicInfo.value.designs) {
//         return
//     }
//     const item = publicInfo.value.designs[index]
//     emit('dragstart', {
//         item: JSON.parse(JSON.stringify(item)),
//         index,
//     })
// }
// function handleUp(index: number) {
//     if (!publicInfo.value.designs) {
//         return
//     }
//     const removedElements = publicInfo.value.designs.splice(index, 1)
//     const target = removedElements[0]
//     if (target) {
//         const newIndex = Math.max(0, index - 1)
//         publicInfo.value.designs.splice(newIndex, 0, target)
//     }
// }
// function handleDown(index: number) {
//     if (!publicInfo.value.designs) {
//         return
//     }
//     const removedElements = publicInfo.value.designs.splice(index, 1)
//     const target = removedElements[0]
//     if (target) {
//         const newIndex = Math.min(publicInfo.value.designs.length, index + 1)
//         publicInfo.value.designs.splice(newIndex, 0, target)
//     }
// }
defineExpose({
    validate,
})
</script>
<style lang="scss" scoped>
.userProfilePage {
    max-width: 480px;
    margin: auto;
    min-height: 100vh;
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