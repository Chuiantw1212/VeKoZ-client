<template>
    <div class="checkbox-group">
        <template v-for="(item) in props.items">
            <label :id="item[itemValue]">
                <input class="group__input" type="checkbox" v-model="modelValue" :id="item[itemValue]"
                    :value="item[itemValue]"
                    :style="{ 'accent-color': `${item.calendarColor ?? '#0275ff'} !important` }" />
                {{ item[itemLabel] }}
            </label>
        </template>
    </div>
</template>
<script setup lang="ts">
const modelValue = defineModel({
    type: Array,
    required: true,
})

const props = defineProps({
    items: {
        type: Array as any,
        required: true,
    },
    itemLabel: {
        type: String,
        default: 'label'
    },
    itemValue: {
        type: String,
        default: 'value',
    },
})
</script>
<style lang="scss" scoped>
.checkbox-group {
    display: flex;
    flex-direction: column;
}
</style>