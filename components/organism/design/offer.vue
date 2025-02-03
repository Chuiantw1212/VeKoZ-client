<template>
    <!-- 檢視用 -->
    <template v-if="!props.isDesigning">
        <el-form-item :label="customDesign.mutable?.label">
            <div class="offer">
                <el-input class="offer__name" placeholder="名稱" v-model="customDesign.mutable.offerName"
                    :disabled="disabled" :maxlength="30" :show-word-limit="true"></el-input>
                <el-input-number class="offer__count" placeholder="數量" v-model="customDesign.mutable.offerCount"
                    :disabled="disabled"></el-input-number>
                <el-input-number class="offer__price" placeholder="票價" v-model="customDesign.mutable.offerPrice"
                    :disabled="disabled"></el-input-number>
                <el-button class="offer__btn" :disabled="disabled">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
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
                    <div v-for="(offer) in customDesign.mutable.offers" class="offer">
                        <el-input class="offer__name" placeholder="名稱" v-model="offer.offerName" :disabled="disabled"
                            :maxlength="30" :show-word-limit="true"></el-input>
                        <el-input-number class="offer__count" placeholder="數量" v-model="offer.offerCount"
                            :disabled="disabled"></el-input-number>
                        <el-input-number class="offer__price" placeholder="票價" v-model="offer.offerPrice"
                            :disabled="disabled"></el-input-number>
                        <el-button class="offer__btn" :disabled="disabled" @click="createOffer()">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-button>
                    </div>
                </div class="offers">
            </template>
        </MoleculeCustomToolbar>
    </template>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                type: 'offer',
                mutable: {
                    label: '' // 此為必要欄位，且必須為空白
                }
            }
        }
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
    }
})

const customDesign = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

// Hooks
const newOffer = reactive({
    name: '',
    count: null,
    price: null,
})

watch(() => customDesign.value, (newValue) => {
    if (newValue.mutable) {
        return
    }
    const defaultValue = {
        type: 'offer',
        mutable: {
            label: '票券',
            offers: [
                newOffer,
            ],
        }
    }
    const mergedItem = Object.assign(defaultValue, newValue)
    customDesign.value = mergedItem
}, { immediate: true })

// Methods
function createOffer() {
    customDesign.value.mutable.offers.push(newOffer)
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