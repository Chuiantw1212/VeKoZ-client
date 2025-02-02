<template>
    <div>
        <div v-if="localValue.length">
            <slot :index="0">

            </slot>
        </div>
        <template v-for="(item, index) in localValue" :key="index">
            <OrganismDesignInput v-if="item.name === 'input'" v-model="localValue[index]" :isDesigning="isDesigning"
                @dragstart="emit('dragstart', { index, name: 'input' })" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignInput>
            <OrganismDesignNumber v-if="item.name === 'number'" v-model="localValue[index]" :isDesigning="isDesigning"
                @dragstart="emit('dragstart', { index, name: 'number' })" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignNumber>
            <OrganismDesignOrganization v-if="item.name === 'organization'" v-model="localValue[index]"
                :isDesigning="isDesigning" @dragstart="emit('dragstart', { index, name: 'organization' })"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignOrganization>
            <OrganismDesignOrganizationMember v-if="item.name === 'organizationMember'" v-model="localValue[index]"
                :isDesigning="isDesigning" @dragstart="emit('dragstart', { index, name: 'organizationMember' })"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignOrganizationMember>
            <OrganismDesignDateTimeRange v-if="item.name === 'dateTimeRange'" v-model="localValue[index]"
                :isDesigning="isDesigning" @dragstart="emit('dragstart', { index, name: 'dateTimeRange' })"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignDateTimeRange>
            <OrganismDesignAccommodation v-if="item.name === 'accommodation'" v-model="localValue[index]"
                :isDesigning="isDesigning" @dragstart="emit('dragstart', { index, name: 'accommodation' })"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignAccommodation>
            <OrganismDesignUrl v-if="item.name === 'url'" v-model="localValue[index]" :isDesigning="isDesigning"
                @dragstart="emit('dragstart', { index, name: 'url' })" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignUrl>
            <OrganismDesignDivider v-if="item.name === 'divider'" v-model="localValue[index]" :isDesigning="isDesigning"
                @dragstart="emit('dragstart', { index, name: 'divider' })" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignDivider>
            <OrganismDesignEditor v-if="item.name === 'editor'" v-model="localValue[index]" :isDesigning="isDesigning"
                @dragstart="emit('dragstart', { index, name: 'editor' })" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignEditor>
            <!-- 拖曳釋放區域 -->
            <slot :index="Number(index + 1)">

            </slot>
        </template>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'focus', 'dragstart'])
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

// methods
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