<template>
    <ClientOnly>
        <div class="ckeditor">

            <div :id="`editor`" ref="editorRef">
            </div>
        </div>
    </ClientOnly>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import type { EditorConfig, } from 'ckeditor5';
const editorRef = ref()
const editorInstance = ref()
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    toolbar: {
        type: Array,
        default: function () {
            return [
                'undo',
                'redo',
                '|',
                'heading',
                '|',
                'fontSize',
                '|',
                'bold',
                'italic',
                'fontColor',
                '|',
                'link',
                // 'imageUpload',
                'mediaEmbed',
                '|',
                'bulletedList',
                'numberedList',
                '|',
                'removeFormat'
            ]
        }
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
})

const localValue = computed({
    get() {
        const value = props.modelValue ?? ''
        if (value && editorInstance.value) {
            editorInstance.value.setData(value)
        }
        return value  // important
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

async function initializeCKEditor() {
    // 使用CDN
    const editorConfig: EditorConfig = {
        licenseKey: 'GPL',
        toolbar: props.toolbar as string[],
        placeholder: props.placeholder,
    }

    // Create CKEditor
    const siteUrl = useRuntimeConfig().public.siteUrl
    const { default: importedEditor } = await import(/* @vite-ignore */`${siteUrl}/ckeditor/bundle.js`)
    const ClassicEditor = importedEditor || (window as any).CKEDITOR
    const editor = await ClassicEditor.create(editorRef.value, editorConfig)

    // 附加監聽器
    editor.model?.document?.on('change:data', () => {
        let newValue = editor.getData()
        localValue.value = newValue
    })

    // 紀錄instance
    editorInstance.value = markRaw(editor)
}

onMounted(async () => {
    initializeCKEditor()
})
</script>

<style lang="scss" scoped>
.ckeditor {
    width: 100%;
}
</style>
