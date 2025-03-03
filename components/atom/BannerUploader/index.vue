<template>
    <div class="inputGroup" :style="{ width: props.width, height: props.height, }">
        <!-- {{ banner }} -->
        <div class="inputGroup__nameGroup">
            <div>
                <span v-if="required" class="nameGroup__required">*</span>
                {{ name }}
            </div>
        </div>
        <label class="inputGroup__label" :class="{ 'inputGroup__label--disabled': disabled }">
            <img class="label__image" :src="getImageSrc()">
            <!-- <div class="label__image" :style="{ 'background-image': getImageSrc() }"></div> -->
            <!-- isValidUrl(banner){{ isValidUrl(banner) }} -->
            <div class="label__content" :class="{ 'label__content--isVisible': !isUploaded }">
                <!-- <div class="content__text"> -->
                <el-icon size="large">
                    <UploadFilled></UploadFilled>
                </el-icon>
                點擊上傳
                <!-- </div> -->
            </div>
            <input v-show="false" :disabled="disabled" class="body__input" autocomplete="off" type="file"
                accept="image/*" :data-required="required" :data-name="name" @change="handleFiles($event)">
            </input>
        </label>
    </div>
</template>
<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { Buffer } from 'buffer/'
const banner = defineModel('modelValue', {
    default: function () {
        return {
            type: '',
            buffer: [],
        }
    },
})
const props = defineProps({
    name: {
        type: String,
        default: "",
    },
    required: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: "100%",
    },
    height: {
        type: String,
        default: "auto", // 預設不要再改變就是100%，這樣才有機會從外部容器控制高度
    }
})

const isUploaded = computed(() => {
    const isUrl = isValidUrl(banner.value)
    const isUploaded = (banner.value as any).type && (banner.value as any).type !== ''
    return isUrl || isUploaded
})

// Methods
function getImageSrc() {
    if (!banner.value) {
        return
    }
    if (isValidUrl(banner.value)) {
        return `${banner.value}`
    }
    const { type, buffer } = banner.value as any
    let formatBuffer: any = buffer
    if (!(buffer instanceof Uint8Array)) {
        formatBuffer = Buffer.from(buffer)
    }
    const typedArray = new Uint8Array(formatBuffer)
    const blob = new Blob([typedArray], { type: `image/${type}` })
    const objectUrl = URL.createObjectURL(blob)
    return objectUrl
}
function isValidUrl(url: any) {
    if (url && typeof url === "string") {
        const expression = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/
        const regex = new RegExp(expression)
        return String(url).match(regex)
    }
}
async function handleFiles(event: any) {
    const { files } = event.target
    const file: File = files[0]
    const readerResult: ArrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer
            resolve(arrayBuffer)
        }
        reader.onerror = (error) => reject(error)
    })
    const typeChunks = file.type.split("/")
    const type = String(typeChunks[1])
    const buffer = Buffer.from(readerResult) // Uint8Array
    const imageBlob: any = {
        type,
        buffer,
    }
    banner.value = imageBlob
}
</script>
<style lang="scss" scoped>
.inputGroup {

    .inputGroup__label {
        position: relative;
        cursor: pointer;
        border: 1px dashed lightgray;
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 4px;

        &:hover {
            .label__content {
                visibility: visible;
            }
        }

        .label__content {
            visibility: hidden;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            gap: 4px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.1);

            .content__text {
                background-color: white;
            }
        }

        .label__content--isVisible {
            visibility: visible;
        }

        .label__icon {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 30px;
            height: 30px;
        }

        .label__image {
            display: block;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 100%;
            width: 100%;
        }
    }

    .inputGroup__label--disabled {
        cursor: unset;
    }
}
</style>