<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label" @dragstart="emit('dragstart')">
        <div v-if="customDesign.mutable" class="offerList">
            <div v-for="(offer, index) in customDesign.mutable.offers" class="offer">
                <template v-if="!disabled">
                    <el-input class="offer__name" placeholder="票券名" v-model="offer.name" :disabled="disabled"
                        :maxlength="30" :show-word-limit="true"></el-input>
                    <el-input-number class="offer__count" placeholder="數量" v-model="offer.count" :min="0"
                        :disabled="disabled" controls-position="right">
                        <template #suffix>
                            <span>張</span>
                        </template>
                    </el-input-number>
                    <el-input-number class="offer__price" placeholder="票價" v-model="offer.price" :min="0"
                        :disabled="disabled" controls-position="right">
                        <template #suffix>
                            <span>元</span>
                        </template>
                    </el-input-number>
                    <el-button v-if="index === 0" class="offer__btn" :disabled="disabled" @click="createOffer()">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-button>
                    <el-button v-else class="offer__btn" :disabled="disabled" @click="removeOffer(index)">
                        <el-icon>
                            <Minus />
                        </el-icon>
                    </el-button>
                </template>
                <template v-if="disabled">
                    <el-input placeholder="票券名" v-model="offer.name" :disabled="true" :maxlength="30"
                        :show-word-limit="true"></el-input>
                    <el-input placeholder="數量" :disabled="true" controls-position="right"></el-input>
                    <el-input placeholder="票價" :disabled="true" controls-position="right"></el-input>
                </template>
            </div>
        </div>
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                placeholder="票券群組"></el-input>
        </template>
        <template v-slot:default>
            <div class="offerList">
                <div v-for="(offer, index) in customDesign.mutable.offers" class="offer">
                    <el-input v-if="!disabled" class="offer__name" placeholder="票券名" v-model="offer.name"
                        :disabled="disabled" :maxlength="30" :show-word-limit="true"></el-input>
                    <el-input-number class="offer__count" placeholder="數量" v-model="offer.count" :min="0"
                        :disabled="disabled" controls-position="right">
                        <template #suffix>
                            <span>張</span>
                        </template>
                    </el-input-number>
                    <el-input-number class="offer__price" placeholder="票價" v-model="offer.price" :min="0"
                        :disabled="disabled" controls-position="right">
                        <template #suffix>
                            <span>元</span>
                        </template>
                    </el-input-number>
                    <el-button v-if="index === 0" class="offer__btn" :disabled="disabled" @click="createOffer()">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-button>
                    <el-button v-else class="offer__btn" :disabled="disabled" @click="removeOffer(index)">
                        <el-icon>
                            <Minus />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import { Plus, Minus } from '@element-plus/icons-vue'
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const isLoading = ref(false)
const repoUI = useRepoUI()

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'offer',
        mutable: {
            label: '票券群組', // 此為必要欄位，且必須為空白，不然空間塞不下
            offers: [
                {
                    name: '',
                    count: null,
                    price: null,
                }
            ]
        }
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
        default: '請輸入'
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
    formField: {
        type: String,
        default: '',
    },
})

// Hooks
const newOffer = ref<{
    name: string,
    count: any,
    price: any
}>({
    name: '',
    count: null,
    price: null,
})

onMounted(() => {
    setDefaultValue()
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

// methods
function setDefaultValue() {
    if (customDesign?.value.mutable) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'offer',
        mutable: {
            label: '票券群組',
            offers: [
                newOffer.value,
            ],
        }
    }
    if (props.formField) {
        defaultValue.formField = props.formField
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
function createOffer() {
    customDesign.value.mutable?.offers?.push(newOffer.value)
}
function removeOffer(index: number) {
    customDesign.value.mutable?.offers?.splice(index, 1)
}
</script>
<style lang="scss" scoped>
.offerList {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.offer {
    display: flex;
    gap: 4px;
    width: 100%;

    .offer__name {
        flex: 1;
    }

    .offer__count {
        flex: 1;
    }

    .offer__price {
        flex: 1;
    }

    .offer__btn {
        width: fit-content;
    }
}
</style>