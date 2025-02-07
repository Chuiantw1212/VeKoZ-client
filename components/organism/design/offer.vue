<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.mutable?.label">
        <div class="offerList">
            <div v-for="(offer, index) in customDesign.mutable.offers" class="offer">
                <template v-if="!disabled">
                    <el-input class="offer__name" placeholder="票券名稱" v-model="offer.name" :disabled="disabled"
                        :maxlength="30" :show-word-limit="true"></el-input>
                    <el-input-number class="offer__count" placeholder="數量" v-model="offer.count" :min="0"
                        :disabled="disabled">
                        <template #suffix>
                            <span>張</span>
                        </template>
                    </el-input-number>
                    <el-input-number class="offer__price" placeholder="票價" v-model="offer.price" :min="0"
                        :disabled="disabled">
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
                    <el-input placeholder="票券名稱" v-model="offer.name" :disabled="true" :maxlength="30"
                        :show-word-limit="true"></el-input>
                    <el-input placeholder="數量" :disabled="true"></el-input>
                    <el-input placeholder="票價" :disabled="true"></el-input>
                </template>
            </div>
        </div class="offers">
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign.mutable" :loading="isLoading" :allowDelete="allowDelete"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.mutable.label" :maxlength="8" :show-word-limit="true"
                placeholder="票券群組"></el-input>
        </template>
        <template v-slot:default>
            <div class="offerList">
                <div v-for="(offer, index) in customDesign.mutable.offers" class="offer">
                    <el-input v-if="!disabled" class="offer__name" placeholder="票券名稱" v-model="offer.name"
                        :disabled="disabled" :maxlength="30" :show-word-limit="true"></el-input>
                    <el-input-number class="offer__count" placeholder="數量" v-model="offer.count" :min="0"
                        :disabled="disabled">
                        <template #suffix>
                            <span>張</span>
                        </template>
                    </el-input-number>
                    <el-input-number class="offer__price" placeholder="票價" v-model="offer.price" :min="0"
                        :disabled="disabled">
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
            </div class="offers">
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import { Plus, Minus } from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
const isLoading = ref(false)
const repoUI = useRepoUI()

interface IModel {
    type: 'offer',
    mutable: {
        label: string,
        offers: any[]
    }
}

const customDesign = defineModel<IModel>('modelValue', {
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
    allowDelete: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: '請輸入'
    },
    onchange: {
        type: Function,
        default: async () => { }
    }
})

// Hooks
const newOffer = ref({
    name: '',
    count: null,
    price: null,
})

onMounted(() => {
    if (customDesign?.value.mutable) {
        return
    }
    const defaultValue = {
        type: 'offer',
        mutable: {
            label: '票券群組',
            offers: [
                newOffer.value,
            ],
        }
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
})

// 觸發更新
watch(() => customDesign.value, (newValue) => {
    handleChange(newValue)
}, { deep: true })

// methods
async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}
function createOffer() {
    customDesign.value.mutable.offers.push(newOffer.value)
}
function removeOffer(index: number) {
    customDesign.value.mutable.offers.splice(index, 1)
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
    gap: 12px;
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