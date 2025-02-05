<template>
    <ClientOnly>
        <div class="ckeditor">
            <div :id="`editor`" ref="editorRef" :disabled="disabled">
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
                        // 'todoList',
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

const localValue = computed({
    get() {
        const value = props.modelValue ?? ''
        return value
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

watch(() => props.disabled, (newValue) => {
    if (editorInstance.value) {
        editorInstance.value.enableReadOnlyMode()
    }
}, { immediate: true })

// watch(
//     () => localValue.value,
//     (newValue) => {
//         if (newValue && editorInstance.value) {
//             editorInstance.value.setData(newValue)
//         }
//     }, { immediate: true }
// )

async function initializeCKEditor() {
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

    const element = document.getElementById('editor')
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

    // 更新狀態
    if (props.disabled) {
        editor.enableReadOnlyMode('docs-snippet')
    }

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

    // 移除scroll貼頂效果
    :deep(.ck.ck-sticky-panel.ck-sticky-panel__content_sticky) {
        top: 0;
    }
}
</style>
