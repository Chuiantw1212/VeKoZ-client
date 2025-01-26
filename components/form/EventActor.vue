<template>
    <div>
        <el-divider>
            演員/講者
        </el-divider>
        <el-form-item>
            <el-select v-model="eventActors" multiple placeholder="請選擇">
                <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.name" />
            </el-select>
        </el-form-item>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    options: {
        type: Array,
        default: () => []
    }
})
const eventActors = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
</script>