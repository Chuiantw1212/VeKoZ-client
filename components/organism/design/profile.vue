<template>
    <div class="publicInfo" :class="{ 'publicInfo--borderless': !isDesigning }">
        <div v-if="publicInfo.banner" class="publicInfo__bannerWrap">
            <!-- <img class="bannerWrap__banner" :src="publicInfo.banner"> -->
            <AtomBannerUploader v-model="publicInfo.banner" :disabled="!isDesigning" @change="handleChange">
            </AtomBannerUploader>
        </div>
        <div class="publicInfo__actions" :class="{ 'publicInfo__actions--withBanner': publicInfo.banner }">
            <div>
                <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                    <el-button v-loading="isLoading" :icon="Share" text circle @click="shareLink()">
                    </el-button>
                </el-tooltip>
                <el-button v-loading="isLoading" text circle :icon="Menu" @click="openQrCode()">
                </el-button>
            </div>
            <el-button v-loading="isLoading" :icon="CollectionTag" :disabled="isDesigning" @click="openQrCode()">
                追隨
            </el-button>
        </div>
        <div class="publicInfo__headerGroup" :class="{ 'publicInfo__headerGroup--hasBanner': publicInfo.banner }">
            <div class="publicInfo__avatar">
                <AtomAvatarUploader v-model="publicInfo.image" :disabled="!isDesigning" @change="handleChange">
                </AtomAvatarUploader>
            </div>
            <template v-if="isDesigning">
                <el-input class="content__header" v-if="publicInfo.name" v-model="publicInfo.name" :maxlength="30"
                    :show-word-limit="true" type="textarea" size="large" @change="handleChange"></el-input>
            </template>
            <template v-else>
                <pre class="content__header">{{ publicInfo.name }}</pre>
            </template>
            <div class="content__followers">XXX人追隨</div>
            <template v-if="isDesigning">
                <el-input v-if="publicInfo.description" v-model="publicInfo.description" :maxlength="120"
                    :show-word-limit="true" type="textarea" :rows="6" @change="handleChange"></el-input>
            </template>
            <template v-else>
                <pre class="content__desc">{{ publicInfo.description }}</pre>
            </template>
            <!-- {{ publicInfo }} -->
            <AtomVekozSocialMedia v-if="publicInfo.sameAs" v-model="publicInfo.sameAs" @change="handleChange">
            </AtomVekozSocialMedia>
        </div>
        <!-- </el-card> -->
        <AtomVekozDialog v-model="isQrCodeDialogOpen">
            <canvas class="dialog__qrCode" id="qrCanvas"></canvas>
        </AtomVekozDialog>
    </div>
</template>
<script setup lang="ts">
import { Menu, Share, CollectionTag } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus'
import type { IUser } from '~/types/user';
import QRCode, { type QRCodeRenderersOptions } from 'qrcode'
import type { IPublicInfoCard } from '~/types/ui';
const repoUI = useRepoUI()
const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change', 'mouseenter', 'mouseout'])
const isLoading = ref<boolean>(false)
const isQrCodeDialogOpen = ref<boolean>(false)
const shareTooltipVisible = ref(false)

const publicInfo = defineModel<IPublicInfoCard>('modelValue', {
    type: Object,
    required: true,
    default: {
        name: '',
        description: '',
        image: '',
        banner: '',
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
    const { origin } = window.location
    const openInLineExternal = `openExternalBrowser=1`
    const url = `${origin}/${publicInfo.value.urlPath}?${openInLineExternal}`
    const options: QRCodeRenderersOptions = {
        errorCorrectionLevel: 'H'
    }
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
    const openInLineExternal = `openExternalBrowser=1`
    const {
        name,
        description,
        urlPath,
    } = publicInfo.value
    const { origin } = window.location
    const url = `${origin}/${urlPath}?${openInLineExternal}`
    await navigator.clipboard.writeText(url)
    shareTooltipVisible.value = true
    if (navigator.share) {
        await navigator.share({
            title: name,
            text: description,
            url,
        });
    }
}
async function validate() {
    return await formRef.value?.validate()
}

defineExpose({
    validate,
})
</script>
<style lang="scss" scoped>
.publicInfo {
    padding-top: 2rem;
    position: relative;

    .publicInfo__actions {
        display: flex;
        background-color: rgba(255, 255, 255, 0.9);
        align-items: center;
        justify-content: space-between;

        >* {
            margin-bottom: 0px; // 除掉form-item的maargon-bottom
        }
    }

    .publicInfo__actions--withBanner {
        height: 0px; // template共同高度
        transform: translateY(90px);
    }

    .publicInfo__bannerWrap {
        height: calc(50vw - 60px);
        max-height: calc(240px - 60px);

        .bannerWrap__banner {
            display: block;
            width: 100%;
            max-width: 1280px;
            border-radius: 0px 0px 12px 12px;
            top: 0px;
        }
    }

    .publicInfo__headerGroup--hasBanner {
        z-index: 10;
    }

    .publicInfo__avatar {
        display: flex;
        justify-content: center;
    }

    .content__header {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 0px;

        :deep(.el-input__inner) {
            font-size: 18px;
            text-align: center;
            font-weight: bold;
        }
    }

    .content__followers {
        text-align: center;
    }

    .content__desc {
        text-align: center;
        // white-space: pre;
        white-space: pre-wrap;
        margin-top: 20px;
    }

    :deep(.el-textarea__inner) {
        text-align: center;
    }

    :deep(.el-card__header) {
        border-bottom: 0px;
    }

    .publicInfo__banner--mobile {
        width: 100%;
    }

    :deep(.publicInfo__body) {
        padding: 0px;
    }

    .publicInfo__name {
        text-align: center;
        margin: 1.25rem 0px;
    }
}

.designForm {
    width: 100%;
}

.icon {
    height: 24px;
    width: 24px;
}


.dialog__qrCode {
    display: block;
    margin: auto;
}

.publicInfo--borderless {
    border: 0px;
    box-shadow: unset;
}
</style>