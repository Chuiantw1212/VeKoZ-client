<template>
    <el-card class="profile" :class="{ 'profile--borderless': !isDesigning }">
        <template #header>
            <div class="profile__header">
                <div>
                    <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                        <el-button v-loading="isLoading" :icon="Share" text circle @click="shareLink()">
                        </el-button>
                    </el-tooltip>
                    <el-button v-loading="isLoading" text circle :icon="Menu" @click="openQrCode()">
                    </el-button>
                </div>
                <el-button v-loading="isLoading" :icon="CollectionTag" :disabled="isDesigning">
                    訂閱
                </el-button>
            </div>
        </template>
        <div class="profile__avatar">
            <AtomAvatarUploader v-model="userTemplate.avatar" :disabled="!isDesigning" @change="handleChange">
            </AtomAvatarUploader>
        </div>
        <template v-if="isDesigning">
            <el-input class="content__header" v-if="userTemplate.seoTitle" v-model="userTemplate.seoTitle"
                :maxlength="30" :show-word-limit="true" type="textarea" size="large" @change="handleChange"></el-input>
        </template>
        <template v-else>
            <pre class="content__header">{{ userTemplate.seoTitle }}
            </pre>
        </template>
        <template v-if="isDesigning">
            <el-input v-if="userTemplate.description" v-model="userTemplate.description" :maxlength="90"
                :show-word-limit="true" type="textarea" :rows="3" @change="handleChange"></el-input>
        </template>
        <template v-else>
            <p class="content__desc">{{ userTemplate.description }}</p>
        </template>
        <AtomVekozSocialMedia v-if="userTemplate.sameAs" v-model="userTemplate.sameAs" @change="handleChange">
        </AtomVekozSocialMedia>
    </el-card>
    <AtomVekozDialog v-model="isQrCodeDialogOpen">
        <canvas class="dialog__qrCode" id="qrCanvas"></canvas>
    </AtomVekozDialog>
</template>
<script setup lang="ts">
import { Menu, Share, CollectionTag } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus'
import type { IUser } from '~/types/user';
import QRCode, { type QRCodeRenderersOptions } from 'qrcode'
const repoUI = useRepoUI()
const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change', 'mouseenter', 'mouseout'])
const isLoading = ref<boolean>(false)
const isQrCodeDialogOpen = ref<boolean>(false)
const shareTooltipVisible = ref(false)

const userTemplate = defineModel<IUser>('modelValue', {
    type: Object,
    default: {
        seoName: '',
        designs: [],
    },
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

// Hooks
onMounted(() => {
    // drawQrCode()
})

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
function openQrCode() {
    isQrCodeDialogOpen.value = true
    nextTick(() => {
        drawQrCode()
    })
}
async function drawQrCode() {
    const openInLineExternal = `openExternalBrowser=1`
    const url = `https://vekoz.org/${userTemplate.value.seoName}?${openInLineExternal}`
    const options: QRCodeRenderersOptions = {
        errorCorrectionLevel: 'H'
    }
    console.log({
        url
    })
    QRCode.toCanvas(document.getElementById('qrCanvas'), url, options, function (error) {
        if (error) console.error(error)
        console.log('success!');
    })
}

async function handleChange() {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange()
        isLoading.value = false
    })
}
async function shareLink() {
    const { origin } = window.location
    const openInLineExternal = `openExternalBrowser=1`
    const {
        id,
        seoName,
        seoTitle,
        description
    } = userTemplate.value
    const seoId = seoName || id
    const url = `${origin}/${seoId}?${openInLineExternal}`
    await navigator.clipboard.writeText(url)
    shareTooltipVisible.value = true
    if (navigator.share) {
        await navigator.share({
            title: seoTitle,
            text: description,
            url,
        });
    }
}
function getPersonalLink() {
    const openInLineExternal = `openExternalBrowser=1`
    return `${userTemplate.value.seoName}?${openInLineExternal}`
}
async function validate() {
    return await formRef.value?.validate()
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
        text-align: center;
        font-size: 18px;
        font-weight: bold;

        :deep(.el-input__inner) {
            font-size: 18px;
            text-align: center;
            font-weight: bold;
        }
    }

    .content__desc {
        text-align: center;
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

.dialog__qrCode {
    display: block;
    margin: auto;
}

.profile--borderless {
    border: 0px;
    box-shadow: unset;
}
</style>