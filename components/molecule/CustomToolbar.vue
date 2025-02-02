<template>
    <div class="customToolbar" draggable="true">
        <el-icon class="customToolbar__move" @dragstart="emit('dragstart')">
            <More />
        </el-icon>
        <div class="customToolbar__slot">
            <slot></slot>
        </div>
        <el-button class="toolbar__btn" @click="emit('remove')">
            <el-icon>
                <Delete />
            </el-icon>
        </el-button>
    </div>
</template>
<script setup>
import {
    More,
    Delete,
} from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown'])
</script>
<style lang="scss" scoped>
.customToolbar {
    display: flex;
    gap: 12px;
    align-items: center;

    .customToolbar__move {
        transform: rotate(90deg);
        cursor: grab;
    }

    .customToolbar__slot {
        width: 100%;
    }
}
</style>