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

const data = ref('<p>Hello world!</p>');

async function initializeCKEditor() {
    // 使用CDN
    const editorConfig = {
        licenseKey: 'GPL',
        // initialData: localValue.value || '<p></p>',
        toolbar: props.toolbar,
        placeholder: props.placeholder,
        // https://ckeditor.com/docs/ckeditor5/latest/support/licensing/managing-ckeditor-logo.html
        ui: {
            poweredBy: {
                position: 'border',
                label: 'Votion'
            }
        }
    }

    const siteUrl = 'http://localhost:3000'
    const { default: importedEditor } = await import(/* @vite-ignore */`${siteUrl}/ckeditor/bundle.js`)
    console.log('importedEditor', importedEditor)
    console.log('CKEDITOR', window.CKEDITOR)
    const ClassicEditor = importedEditor || window.CKEDITOR
    // console.log(window)
    // const element = document.querySelector(`#editor`)
    const editor = await ClassicEditor.create(editorRef.value, editorConfig)
}

function waitForCkeditorReady(timestamp) {
    // if(){

    // }
    requestAnimationFrame(step);
}

onMounted(async () => {
    // const { default: importedEditor } = await import(/* @vite-ignore */`${siteUrl}/ckeditor/bundle.js`)
    // window.CKEDITOR = importedEditor
    // state.id = $uuid4()
    initializeCKEditor()
})
</script>
