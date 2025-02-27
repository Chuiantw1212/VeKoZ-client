<template>
    <div v-if="userTemplate.designs">
        <template v-for="(design, index) in userTemplate.designs">
            <OrganismDesignAvatarUploader v-if="design.type === 'avatar'" v-model="userTemplate.designs[index]"
                :onchange="onchange" :required="design.required" :disabled="props.disabled" :show-label="false"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignAvatarUploader>
            <OrganismDesignEventHistory v-if="design.type === 'eventHostHistory'" v-model="userTemplate.designs[index]"
                :onchange="onchange" :required="design.required" :disabled="props.disabled" :show-label="false"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', design.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignEventHistory>
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
                <OrganismDesignTextarea v-if="isDesigning" v-model="userTemplate.designs[index]" :onchange="onchange"
                    :required="design.required" :disabled="props.disabled" :show-label="false"
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
</template>
<script setup lang="ts">
import { Menu, Share, CollectionTag } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus'
import type { IUser } from '~/types/user';

const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change', 'mouseenter', 'mouseout'])
const userTemplate = defineModel<IUser>('modelValue', {
    type: Object,
    default: {
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
const formModel = ref<{ [key: string]: any }>({})
const formRules = ref<{ [key: string]: any }>({})

// // Hooks
// watch(() => templateDesigns.value, () => {
//     templateDesigns.value.forEach(design => {
//         if (design.formField) {
//             switch (design.formField) {
//                 case 'organizer': {
//                     formModel.value[design.formField] = design.organizationId
//                     break;
//                 }
//                 case 'performers': {
//                     formModel.value[design.formField] = design.memberIds
//                     break;
//                 }
//                 case 'dates':
//                 case 'name':
//                 case 'banner':
//                 default: {
//                     formModel.value[design.formField] = design.value
//                 }
//             }
//             formRules.value[design.formField] = {
//                 required: true,
//                 message: `${design.label}為必填`
//             }
//         }
//     })
// }, { immediate: true, deep: true })

// methods
function getPersonalLink() {
    const openInLineExternal = `openExternalBrowser=1`
    return `${userTemplate.value.seoName}?${openInLineExternal}`
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