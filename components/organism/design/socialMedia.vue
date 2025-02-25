<template>
    <div>
        <!-- 檢視與編輯用 -->
        <el-form-item v-if="!props.isDesigning" class="formItem" :label="customDesign.label" :required="required"
            :prop="customDesign.formField" @dragstart="emit('dragstart')">
            <!-- <el-input v-if="customDesign" v-model="customDesign.value" type="textarea" :rows="3" :maxlength="150"
            :show-word-limit="true" :placeholder="placeholder" :disabled="disabled" /> -->
        </el-form-item>
        <!-- 樣板編輯專用 -->
        <MoleculeDesignToolbar v-else-if="customDesign" class="formItem"
            :class="{ 'formItem--center': customDesign.alignment === 'center' }" :loading="isLoading"
            :required="required" @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')"
            @moveDown="emit('moveDown')">
            <template v-slot:label>
                <el-input v-if="props.showLabel" v-model="customDesign.label" :maxlength="8" :show-word-limit="true"
                    placeholder="欄位名稱"></el-input>
            </template>
            <template v-slot:default>
                <div class="profile__socialMedia">
                    <el-button class="socialMedia__icon" text circle>
                        <img class="link__icon" src="@/assets/icon/email.svg">
                    </el-button>
                    <el-button class="socialMedia__icon" text circle>
                        <img class="link__icon" src="@/assets/icon/facebook-circle.svg">
                    </el-button>
                    <el-button class="socialMedia__icon" text circle>
                        <img class="link__icon" src="@/assets/icon/instagram.svg">
                    </el-button>
                    <el-button class="socialMedia__icon" text circle>
                        <img class="link__icon" src="@/assets/icon/line-logo.svg">
                    </el-button>
                    <el-button class="socialMedia__icon" text circle>
                        <img class="link__icon" src="@/assets/icon/youtube.svg">
                    </el-button>
                    <el-button class="socialMedia__icon" text circle>
                        <img class="link__icon" src="@/assets/icon/web.svg">
                    </el-button>
                </div>
                <!-- <el-input v-model="customDesign.value" type="textarea" :rows="3" :maxlength="150" :show-word-limit="true"
                :placeholder="placeholder" :disabled="disabled" /> -->
            </template>
        </MoleculeDesignToolbar>
    </div>
</template>
<script lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import { defineEmits, defineModel, defineProps } from 'vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const isLoading = ref(false)
// const repoUI = useRepoUI()
const customDesign = defineModel<ITemplateDesign>('modelValue', {
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
        default: '請輸入描述'
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
watch(() => customDesign.urls, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

// Methods
function setDefaultValue() {
    if (customDesign?.value.hasOwnProperty('value')) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'socialMedia',
        label: '',
        value: '',
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
</style>