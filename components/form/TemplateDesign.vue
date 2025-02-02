<template>
    <div>
        <template v-for="(item, index) in localValue" :key="index">
            <OrganismDesignInput v-if="item.name === 'input'" v-model="localValue[index]" :isDesigning="isDesigning"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignInput>
            <slot :index="Number(index)">

            </slot>
        </template>
    </div>
</template>
<script setup>
const emit = defineEmits(['update:modelValue', 'focus'])
const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {}
        }
    },
    isDesigning: {
        type: Boolean,
        default: false
    }
})
const localValue = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
// methods
function handleRemove(index) {
    localValue.value.splice(index, 1)
}
function handleUp(index) {
    const removedElements = localValue.value.splice(index, 1)
    const target = removedElements[0]
    const newIndex = Math.max(0, index - 1)
    localValue.value.splice(newIndex, 0, target)
}
function handleDown(index) {
    const removedElements = localValue.value.splice(index, 1)
    const target = removedElements[0]
    const newIndex = Math.min(localValue.value.length, index + 1)
    localValue.value.splice(newIndex, 0, target)
}
</script>