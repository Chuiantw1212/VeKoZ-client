<template>
    <ClientOnly>
        <div :id="`editor`" ref="editorRef">
        </div>
    </ClientOnly>
</template>

<script setup>
import { markRaw } from 'vue'
const { $ckeditorConfig } = useNuxtApp()
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
            editorInstance, value.setData(newValue)
        }
        return value  // important
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

const data = ref('<p>Hello world!</p>');

async function initializeCKEditor() {
    // 使用CDN
    const editorConfig = {
        licenseKey: 'GPL',
        toolbar: props.toolbar,
        placeholder: props.placeholder,
        // https://ckeditor.com/docs/ckeditor5/latest/support/licensing/managing-ckeditor-logo.html
        // ui: {
        //     poweredBy: {
        //         position: 'border',
        //         label: 'Votion'
        //     }
        // }
    }

    // Create CKEditor
    const siteUrl = useRuntimeConfig().public.siteUrl
    const { default: importedEditor } = await import(/* @vite-ignore */`${siteUrl}/ckeditor/bundle.js`)
    const ClassicEditor = importedEditor || window.CKEDITOR
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
