<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <div class="offerList">
                <div v-for="(offer, index) in customDesign.mutable.offers" class="offer">
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
                </div>
            </div class="offers">
        </el-form-item>
    </template>
    <!-- 編輯用 -->
    <template v-else-if="customDesign.mutable">
        <MoleculeCustomToolbar :allowDelete="allowDelete" @dragstart="emit('dragstart')" @remove="emit('remove')"
            @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
            <template v-slot:label>
                <input v-model="customDesign.mutable.label" class="label__input" placeholder="請輸入欄位名稱">
            </template>
            <template v-slot:default>
                <div class="offerList">
                    <div v-for="(offer, index) in customDesign.mutable.offers" class="offer">
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
                    </div>
                </div class="offers">
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
import { Plus, Minus } from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])
interface IModel {
    type: 'offer',
    mutable: {
        label: string,
        offers: any[]
    }
}
const customDesign = defineModel<IModel>('modelValue', {
    required: true,
    default: {
        type: 'offer',
        mutable: {
            label: '', // 此為必要欄位，且必須為空白
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
    }
})

// Hooks
const newOffer = ref({
    name: '',
    count: null,
    price: null,
})

watch(() => customDesign.value, (newValue) => {
    if (newValue?.mutable) {
        return
    }
    const defaultValue = {
        type: 'offer',
        mutable: {
            label: '',
            offers: [
                newOffer.value,
            ],
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
}, { immediate: true })

// Methods
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
}

.offer {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    .offer__name {
        width: 100%;
    }

    .offer__count {
        width: 100%;
    }

    .offer__price {
        width: 100%;
    }

    .offer__btn {
        // flex: 0.1;
        width: fit-content;
    }
}
</style>