<template>
    <label class="background" :style="{ 'background-image': getImageSrc() }" :for="id">
        <input :id="id" autocomplete="off" type="file" accept="image/*" @change="handleFiles($event)">
        <slot></slot>
    </label>
</template>
<script setup lang="ts">
import { Buffer } from 'buffer/'
import placeholderImage from './placeholder.png'
const id = ref<string>(crypto.randomUUID())
const localValue = defineModel('modelValue', {
    default: function () {
        return {
            type: '',
            buffer: [],
        }
    },
})
function getImageSrc() {
    if (!localValue.value) {
        return
    }
    if (typeof localValue.value === "string") {
        const expression = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/
        const regex = new RegExp(expression)
        if (String(localValue.value).match(regex)) {
            return `url(${localValue.value})`
        }
    }
    const { type, buffer } = localValue.value
    let formatBuffer: any = buffer
    if (!(buffer instanceof Uint8Array)) {
        formatBuffer = Buffer.from(buffer)
    }
    const typedArray = new Uint8Array(formatBuffer)
    const blob = new Blob([typedArray], { type: `image/${type}` })
    const objectUrl = URL.createObjectURL(blob)
    return `url(${objectUrl})`
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
    localValue.value = imageBlob
}
</script>
<style lang="scss" scoped>
.background {}
</style>