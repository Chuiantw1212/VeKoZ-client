<template>
    <div class="toolbar">
        <div v-if="isDesigning" class="toolbar__draggable" draggable="true" @mouseout="emit('mouseout')">
            <el-icon class="toolbar__move" @dragstart="emit('dragstart')" @mouseenter="emit('mouseenter')">
                <More />
            </el-icon>
            <slot name="label"></slot>
        </div>
        <div name="default" class="toolbar__default">
            <slot name="default"></slot>
        </div>
        <template v-if="required">
            <el-button v-loading="loading" class="toolbar__btn" type="info" size="small" :disabled="true"
                @click="emit('remove')">
                SEO
            </el-button>
        </template>
        <template v-if="!required">
            <el-button v-loading="loading" class="toolbar__btn" size="small" @click="emit('remove')">
                <el-icon>
                    <Delete />
                </el-icon>
            </el-button>
        </template>
    </div>
</template>
<script setup>
import {
    More,
    Delete,
} from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'mouseenter', 'mouseout'])
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    isDesigning: {
        type: Boolean,
        default: true
    },
    required: {
        type: Boolean,
        default: false
    }
})
</script>
<style lang="scss" scoped>
.toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    width: 100%;

    .toolbar__draggable {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .toolbar__move {
        transform: rotate(90deg);
        cursor: grab;

        // &:hover {
        //     outline: 1px dashed red;
        // }
    }

    .toolbar__default {
        width: 100%;
    }

    .toolbar__btn {
        min-width: 50px;
    }
}
</style>