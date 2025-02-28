<template>
    <el-card class="profile" :class="{ 'profile--borderless': !isDesigning }">
        <template #header>
            <div class="profile__header">
                <div>
                    <el-button :icon="Share" text circle>
                    </el-button>
                    <el-button text circle :icon="Menu">
                    </el-button>
                </div>
                <el-button :icon="CollectionTag" :disabled="true">
                    訂閱
                </el-button>
            </div>
        </template>
        <div class="profile__avatar">
            <AtomAvatarUploader v-if="userTemplate.avatar" v-model="userTemplate.avatar">
            </AtomAvatarUploader>
        </div>
        <el-input class="content__header" v-if="userTemplate.seoTitle" v-model="userTemplate.seoTitle" :maxlength="30"
            :show-word-limit="true" size="large"></el-input>
        <el-input v-if="userTemplate.description" v-model="userTemplate.description" :maxlength="90"
            :show-word-limit="true" type="textarea" :rows="3"></el-input>
        <AtomVekozSocialMedia v-if="userTemplate.sameAs" v-model="userTemplate.sameAs"></AtomVekozSocialMedia>
    </el-card>
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
    .content__header {
        :deep(.el-input__inner) {
            font-size: 18px;
            text-align: center;
            font-weight: bold;
        }
    }

    :deep(.el-textarea__inner) {
        text-align: center;
    }

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
        display: flex;
        justify-content: center;
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