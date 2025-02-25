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
            <div class="profile__socialMedia" :key="renderKey">
                <template v-for="(url, index) in customDesign.urls">
                    <el-button v-if="url.includes('youtube.com/')" class="socialMedia__icon" text circle
                        @click="removeUrl(index)">
                        <img class="link__icon" src="@/assets/icon/youtube.svg">
                    </el-button>
                    <el-button v-else-if="url.includes('facebook.com/')" class="socialMedia__icon" text circle
                        @click="removeUrl(index)">
                        <img class="link__icon" src="@/assets/icon/facebook-circle.svg">
                    </el-button>
                    <el-button v-else-if="url.includes('instagram.com/')" class="socialMedia__icon" text circle
                        @click="removeUrl(index)">
                        <img class="link__icon" src="@/assets/icon/instagram.svg">
                    </el-button>
                    <el-button v-else-if="url.includes('line.me/ti/')" class="socialMedia__icon" text circle
                        @click="removeUrl(index)">
                        <img class="link__icon" src="@/assets/icon/line-logo.svg">
                    </el-button>
                    <el-button v-else-if="url.includes('github.com/')" class="socialMedia__icon" text circle
                        @click="removeUrl(index)">
                        <img class="link__icon" src="@/assets/icon/github.svg">
                    </el-button>
                    <el-button v-else-if="validateEmail(url)" class="socialMedia__icon" text circle
                        @click="removeUrl(index)">
                        <img class="link__icon" src="@/assets/icon/email.svg">
                    </el-button>
                    <el-button v-else class="socialMedia__icon" text circle @click="removeUrl(index)">
                        <img class="link__icon" src="@/assets/icon/web.svg">
                    </el-button>
                </template>
            </div>

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
import { defineEmits, defineModel, defineProps } from 'vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const isLoading = ref(false)
const renderKey = ref<string>(crypto.randomUUID())
// const repoUI = useRepoUI()
const customDesign = defineModel<ITemplateDesign>('modelValue', {
    required: true,
    default: {
        type: 'socialMedia',
    }
})
const socialMediaUrl = ref<string>('')

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
        default: '1. 輸入連結後可新增 2. 點擊icon可刪除'
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
// onMounted(() => {
//     setDefaultValue()
// })
// watch(() => customDesign.value, (newValue) => {
//     setDefaultValue()
//     handleChange(newValue)
// }, { deep: true })

// Methods
function removeUrl(index: number) {
    if (customDesign.value.urls) {
        console.log({
            index
        })
        customDesign.value.urls.splice(index, 1)
        // customDesign.value.urls = []
        renderKey.value = crypto.randomUUID()
        console.log(customDesign.value.urls)
    }
}
function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function pushNewMedia() {
    if (!customDesign.value.urls) {
        customDesign.value.urls = []
    }
    customDesign.value.urls.push(socialMediaUrl.value)
    socialMediaUrl.value = ''
    // const newSocialMedia = socialMediaUrl.value
    // if (newSocialMedia.includes('instagram.com/')) {
    // }
}

function setDefaultValue() {
    if (customDesign.value.hasOwnProperty('value')) {
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
    // repoUI.debounce(props.id, async function () {
    //     await props.onchange(templateDesign)
    //     isLoading.value = false
    // })
}
</script>
<style lang="scss" scoped>
.profile__socialMedia {
    display: flex;
    margin: auto;
    gap: 8px;
    justify-content: center;

    .socialMedia__icon {
        width: 40px;
        height: 40px;
    }

    .link__icon {
        width: 24px;
        height: 24px;
        // border-radius: 50%;
        margin: auto;
        display: block;
    }
}

.profile__inputGroup {
    display: flex;
    align-items: center;
    gap: 20px;
}
</style>