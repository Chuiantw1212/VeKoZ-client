<template>
    <div>
        <template v-for="(item, index) in localValue" :key="index">
            <OrganismDesignInput v-if="item.name === 'input'" v-model="localValue[index]" :isDesigning="isDesigning"
                @dragstart="setDragSouce(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)">
            </OrganismDesignInput>
            <!-- 拖曳釋放區域 -->
            <slot :index="Number(index)">

            </slot>
        </template>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'focus'])
const props = defineProps({
    modelValue: {
        type: Array,
        default: function () {
            return []
        }
    },
    isDesigning: {
        type: Boolean,
        default: false
    }
})
const localValue = computed({
    get() {
        return props.modelValue as any
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

const movingSouce = ref(0)

// methods
function setDragSouce(index: number) {
    movingSouce.value = index
}

function handleRemove(index: number) {
    localValue.value.splice(index, 1)
}
function handleUp(index: number) {
    const removedElements = localValue.value.splice(index, 1)
    const target = removedElements[0]
    const newIndex = Math.max(0, index - 1)
    localValue.value.splice(newIndex, 0, target)
}
function handleDown(index: number) {
    const removedElements = localValue.value.splice(index, 1)
    const target = removedElements[0]
    const newIndex = Math.min(localValue.value.length, index + 1)
    localValue.value.splice(newIndex, 0, target)
}
</script>