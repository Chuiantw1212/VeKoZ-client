<template>
    <div class="venonia-select">
        <div class="select__selected">
            <span>選項A</span>
            <span>選項B</span>
        </div>

        <div>
            <input v-model="inputText" placeholder="搜尋選項">
            <select v-model="selectValue" class="form__select" :disabled="disabled" @change="handleChange()">
                <option :label="placeholder" value=""></option>
                <option v-for="(item) in options" :key="item[itemValue]" :label="item[itemLabel]" :value="item.value"
                    :disabled="item.disabled" />
            </select>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, } from 'vue'
import type { PropType } from 'vue'
const emits = defineEmits(['update:modelValue', 'change'])
interface IOptionItem {
    label?: string
    value?: any,
    disabled?: boolean,
    color: string,
    [key: string]: any,
}
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array as PropType<IOptionItem[]>,
        default: () => {
            return []
        }
    },
    placeholder: {
        type: String,
        default: '請選擇'
    },
    itemLabel: {
        type: String,
        default: 'label'
    },
    itemValue: {
        type: String,
        default: 'value'
    }
})

const selectValue = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    }
})

const colors = ref([
    {
        label: 'Light gray',
        value: 'lightgray'
    },
    {
        label: 'Gray',
        value: 'gray'
    },
    {
        label: 'Brown',
        value: 'brown'
    },
    {
        label: 'Yellow',
        value: 'yellow'
    },
    {
        label: 'Green',
        value: 'green'
    },
    {
        label: 'Blue',
        value: 'blue'
    },
    {
        label: 'Purple',
        value: 'purple'
    },
    {
        label: 'Pink',
        value: 'pink'
    },
    {
        label: 'Red',
        value: 'red'
    },
])

const inputText = ref<string | number>('')

// methods
/**
 * https://github.com/gka/chroma.js/blob/main/src/generator/random.js
 */
// function generateColorHex() {
//     const digits = '0123456789abcdef';
//     const { floor, random } = Math;
//     let code = '#';
//     for (let i = 0; i < 6; i++) {
//         code += digits.charAt(floor(random() * 16));
//     }
//     return code
// }

function handleChange() {
    emits('change', selectValue.value)
}

onMounted(() => {
    // const test1 = generateColorHex()
    // const test2 = generateColorHex()
    // console.log({
    //     test1,
    //     test2
    // })
})
</script>
<style lang="scss" scoped>
.venonia-select {
    display: flex;
    flex-direction: column;

    .select__selected {}
}

.form__select {
    all: unset;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    min-width: 118px;
    padding: 0 15px;
    white-space: pre-wrap;

    &:disabled {
        background-color: rgb(245, 247, 250);
    }
}
</style>