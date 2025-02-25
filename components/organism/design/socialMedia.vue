<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!isDesigning" :label="customDesign.label" :required="required" :prop="customDesign.formField">
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required">
        <template v-slot:label>
            <el-input v-if="props.showLabel" v-model="customDesign.label" :maxlength="8" :show-word-limit="true"
                placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <!-- customDesign.urls:{{ customDesign.urls }} -->
            <AtomVekozSocialMedia v-if="customDesign.urls" v-model="customDesign.urls" :renderKey="renderKey">
            </AtomVekozSocialMedia>
            <!-- 456 -->
            <div class="profile__inputGroup">
                <el-input v-model="socialMediaUrl" :placeholder="placeholder"></el-input>
                <el-button :icon="Plus" @click="pushNewMedia()">

                </el-button>
            </div>
        </template>
    </MoleculeDesignToolbar>
</template>
<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import type { ITemplateDesign } from '~/types/eventTemplate'
import { defineEmits, defineModel, defineProps, ref, onMounted, watch } from 'vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const isLoading = ref(false)
const repoUI = useRepoUI()
const socialMediaUrl = ref<string>('')
const renderKey = ref<string>(crypto.randomUUID())
const customDesign = defineModel<ITemplateDesign>('modelValue', {
    required: true,
    default: {
        type: 'socialMedia',
    }
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
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '1.輸入社群連結後可新增對應社群的Logo 2.點擊Logo可刪除該連結'
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
    formField: {
        type: String,
        default: '',
    },
    showLabel: {
        type: Boolean,
        default: true,
    }
})

// Hooks
onMounted(() => {
    setDefaultValue()
})
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

// Methods
function pushNewMedia() {
    if (!customDesign.value.urls) {
        customDesign.value.urls = []
    }
    customDesign.value.urls.push(socialMediaUrl.value)
    socialMediaUrl.value = ''
    renderKey.value = crypto.randomUUID()
}
function setDefaultValue() {
    if (customDesign.value.hasOwnProperty('urls')) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'socialMedia',
        label: '',
        urls: [],
    }
    if (props.formField) {
        defaultValue.formField = props.formField
    }
    const mergedItem = Object.assign(defaultValue, customDesign?.value)
    customDesign.value = mergedItem
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
</script>
<style lang="scss" scoped>
.profile__inputGroup {
    display: flex;
    align-items: center;
    gap: 20px;
}
</style>