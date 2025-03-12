<template>
    <div class="checkbox-group">
        <template v-for="(item, index) in props.items">
            <label :id="item[itemValue]">
                <input type="checkbox" v-model="modelValue" :id="item[itemValue]" :value="item[itemValue]" />

                {{ item[itemLabel] }}

            </label>
        </template>
    </div>
</template>
<script setup lang="ts">
// const 
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
    }
})
</script>
<style lang="css" scoped>
.checkbox-group {
    display: flex;
    flex-direction: column;
}
</style>