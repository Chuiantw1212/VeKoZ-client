<template>
    <ClientOnly>
        Editor
        <!-- <div class="ckeditor">
            <div :id="`editor-${id}`" ref="editorRef">
            </div>
        </div> -->
    </ClientOnly>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import type { EditorConfig, } from 'ckeditor5';

const editorRef = ref()
const editorInstance = ref()
const emit = defineEmits(['update:modelValue'])

const localValue = defineModel<String>('modelValue', {
    type: String,
    default: ''
})

const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
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
                'fontFamily',
                'fontSize',
                '|',
                'bold',
                'italic',
                'fontColor',
                '|',
                'link',
                'mediaEmbed',
                'htmlEmbed',
                {
                    label: '更多',
                    items: [
                        'alignment',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'removeFormat'
                    ]
                },
            ]
        }
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

watch(() => props.disabled, (newValue) => {
    setEditorEndable()
}, { immediate: true })

async function initializeCKEditor() {
    const element = document.getElementById(`editor-${props.id}`)
    if (!element) {
        return
    }
    // 使用CDN
    const editorConfig: EditorConfig = {
        licenseKey: 'GPL',
        toolbar: props.toolbar as string[],
        placeholder: props.placeholder,
        ui: {
            poweredBy: {
                position: 'border',
                label: 'Venonia'
            }
        },
    }

    // Create CKEditor
    const siteUrl = useRuntimeConfig().public.siteUrl
    const { default: importedEditor } = await import(/* @vite-ignore */`${siteUrl}/ckeditor/bundle.js`)
    const ClassicEditor = importedEditor || (window as any).CKEDITOR
    const editor = await ClassicEditor.create(element, editorConfig)

    // 附加初始值
    if (localValue.value) {
        editor.setData(localValue.value)
    }

    // 附加監聽器
    editor.model?.document?.on('change:data', () => {
        let newValue = editor.getData()
        localValue.value = newValue
    })

    // 紀錄instance
    editorInstance.value = markRaw(editor)

    // 更新狀態
    setEditorEndable()
}

function setEditorEndable() {
    if (!editorInstance.value) {
        return
    }
    if (props.disabled) {
        editorInstance.value.enableReadOnlyMode('docs-snippet')
    } else {
        editorInstance.value.disableReadOnlyMode('docs-snippet')
    }
}


onMounted(async () => {
    initializeCKEditor()
})
onBeforeUnmount(() => {
    if (editorInstance.value) {
        editorInstance.value.destroy()
    }
})
</script>

<style lang="scss" scoped>
.ckeditor {
    width: 100%;

    // 移除scroll貼頂效果
    :deep(.ck.ck-sticky-panel.ck-sticky-panel__content_sticky) {
        top: 0;
    }
}
</style>
