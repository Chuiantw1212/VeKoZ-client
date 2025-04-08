<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" class="el-form-item">
        <div v-if="customDesign" class="offerList">
            <div v-for="(offer, index) in customDesign.offers" class="offer">
                <template v-if="!disabled">
                    <el-card class="offer__card">
                        <el-form ref="offers" class="offer__body" :model="offer" :rules="offerRules">
                            <el-row class="body__row">
                                <el-col :span="8">
                                    <el-form-item prop="name">
                                        <el-input v-if="!disabled" class="offer__name" placeholder="票券名"
                                            v-model="offer.name" :disabled="disabled" :maxlength="20"
                                            :show-word-limit="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item prop="inventoryMaxValue">
                                        <el-input-number class="offer__sku" placeholder="數量"
                                            v-model="offer.inventoryMaxValue" :min="0" :max="60" :disabled="disabled"
                                            controls-position="right">
                                            <template #suffix>
                                                <span>張</span>
                                            </template>
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item prop="price">
                                        <el-input-number class="offer__price" placeholder="票價" v-model="offer.price"
                                            :min="0" :disabled="disabled" controls-position="right">
                                            <template #suffix>
                                                <span>元</span>
                                            </template>
                                        </el-input-number>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="body__row">
                                <AtomVekozDateTimeRange v-model:start-date="offer.validFrom" :minDate="props.startDate"
                                    :maxDate="props.endDate" v-model:end-date="offer.validThrough"
                                    ref="dateTimeRangeRef" :disabledDate="true">
                                </AtomVekozDateTimeRange>
                            </el-row>
                            <el-row class="body__row">
                                <el-input v-model="offer.description" type="textarea"
                                    placeholder="1. 上方欄位請輸入票券有效時間 2. 此欄位請輸入票券描述" :maxlength="150"
                                    :show-word-limit="true"></el-input>
                            </el-row>
                        </el-form>
                    </el-card>
                    <el-button v-if="index === 0" class="offer__btn" :disabled="disabled" @click="createOffer()">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-button>
                    <el-button v-else class="offer__btn" :disabled="disabled" @click="removeOffer(index)">
                        <el-icon>
                            <Close />
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
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.label" :maxlength="8" :show-word-limit="true" placeholder="群組名稱"></el-input>
        </template>
        <template v-slot:default>
            <div class="offerList">
                <div v-for="(offer, index) in customDesign.offers" class="offer">
                    <div class="offer__body">
                        <div class="body__upper">
                            <el-input v-if="!disabled" class="offer__name" placeholder="票券名" v-model="offer.name"
                                :disabled="disabled" :maxlength="20" :show-word-limit="true"></el-input>
                            <el-input-number class="offer__sku" placeholder="數量" v-model="offer.inventoryMaxValue"
                                :min="0" :max="60" :disabled="disabled" controls-position="right">
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
                        </div>
                        <div class="body__lower">
                            <AtomVekozDateTimeRange v-model:start-date="offer.validFrom" :minDate="props.startDate"
                                :maxDate="props.endDate" v-model:end-date="offer.validThrough" ref="dateTimeRangeRef"
                                :disabledDate="true">
                            </AtomVekozDateTimeRange>
                            <el-input v-model="offer.description" type="textarea"
                                placeholder="1. 上方欄位請輸入票券有效時間 2. 此欄位請輸入票券描述" :maxlength="150"
                                :show-word-limit="true"></el-input>
                        </div>
                    </div>
                    <el-button v-if="index === 0" class="offer__btn" type="success" plain :disabled="disabled"
                        @click="createOffer()">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-button>
                    <el-button v-else class="offer__btn" type="danger" plain :disabled="disabled"
                        @click="removeOffer(index)">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import { Plus, Close } from '@element-plus/icons-vue'
import type { FormContext, FormInstance, FormRules } from 'element-plus'
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { IOffer } from '~/types/offer'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const isLoading = ref(false)
const repoUI = useRepoUI()
const dateTimeRangeRefs = useTemplateRef('dateTimeRangeRef')
const offerRefs = useTemplateRef('offers')
const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'offers',
        label: '票券群組', // 此為必要欄位，且必須為空白，不然空間塞不下
        offers: [
            {
                name: '',
                inventoryMaxValue: null,
                price: null,
            }
        ],
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
    startDate: {
        type: [String, Date],
        default: '',
    },
    endDate: {
        type: [String, Date],
        default: '',
    },
})

// Hooks
class Offer {
    name: string = '';
    inventoryMaxValue: number | null = null;
    price: number | null = null;
    description: string = '';
    validFrom: Date | null = null;
    validThrough: Date | null = null;
}

onMounted(() => {
    setDefaultValue()
})
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })

const offerRules = ref<FormRules<any>>({
    name: [
        { required: true, message: '票券名稱為必填', },
    ],
    inventoryMaxValue: [
        { required: true, message: '數量為必填', },
    ],
    price: [
        { required: true, message: '票價為必填', },
    ]
})

// Methods
function setDefaultValue() {
    if (customDesign.value.offers) {
        return
    }
    const newOffer = getNewOffer()
    const defaultValue: ITemplateDesign = {
        type: 'offers',
        label: '票券群組',
        offers: [
            newOffer,
        ],
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
    }, 1000)
}
function getNewOffer() {
    const newOffer = new Offer()
    if (props.startDate && props.startDate instanceof Date) {
        newOffer.validFrom = props.startDate
    }
    if (props.endDate && props.endDate instanceof Date) {
        newOffer.validThrough = props.endDate
    }
    return newOffer
}
function createOffer() {
    /**
     * 預設的第一個Offer會沒有值
     */
    const newOffer = getNewOffer()
    customDesign.value.offers?.push(newOffer)
}
function removeOffer(index: number) {
    customDesign.value.offers?.splice(index, 1)
}

function setDate(incomingDate: Date) {
    dateTimeRangeRefs.value.forEach((rangeComponent: any) => {
        rangeComponent.setDate(incomingDate)
    })
}

async function validate() {
    const validatePromises: boolean[] = offerRefs.value.map((offerComponent: FormInstance) => {
        const result = offerComponent.validate()
        return result
    })
    const results = await Promise.all(validatePromises)
    const isAllValid = results.every(value => !!value)
    return isAllValid
}

defineExpose({
    setDate,
    validate
})
</script>
<style lang="scss" scoped>
// .el-form-item {
//     display: flex;
//     --font-size: 14px;
//     margin-bottom: 18px;

//     .el-form-item__label {
//         display: inline-flex;
//         justify-content: flex-end;
//         align-items: flex-start;
//         flex: 0 0 auto;
//         font-size: var(--el-form-label-font-size);
//         color: var(--el-text-color-regular);
//         height: 32px;
//         line-height: 32px;
//         padding: 0 12px 0 0;
//         box-sizing: border-box;
//     }
// }

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

    .offer__card {
        width: 100%;
    }

    .offer__body {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;

        .body__row {
            margin-bottom: 18px;
        }

        .body__upper {
            display: flex;
            gap: 4px;
            margin-bottom: 18px;
        }

        .body__lower {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
    }

    .offer__name {
        flex: 1;
    }

    .offer__sku {
        flex: 1;
    }

    .offer__price {
        flex: 1;
    }

    .offer__btn {
        width: fit-content;
        height: 100%;
    }
}
</style>