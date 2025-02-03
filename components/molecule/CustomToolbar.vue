<template>
    <div class="customToolbar">
        <div class="customToolbar__draggable" draggable="true">
            <el-icon class="customToolbar__move" @dragstart="emit('dragstart')">
                <More />
            </el-icon>
            <slot name="label"></slot>
        </div>
        <div name="default" class="customToolbar__default">
            <slot name="default"></slot>
        </div>
        <template v-if="allowDelete">
            <el-button class="toolbar__btn" @click="emit('remove')">
                <el-icon>
                    <Delete />
                </el-icon>
            </el-button>
        </template>
        <template v-else>
            <el-button class="toolbar__btn" type="info" size="small" :disabled="true" @click="emit('remove')">
                SEO
            </el-button>
        </template>
    </div>
</template>
<script setup>
import {
    More,
    Delete,
} from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown'])
const props = defineProps({
    allowDelete: {
        type: Boolean,
        default: true
    }
})
</script>
<style lang="scss" scoped>
.customToolbar {
    display: flex;
    gap: 12px;
    align-items: center;

    .customToolbar__draggable {
        display: flex;
        align-items: center;
        gap: 12px;

        >* {
            height: 24px;
        }
    }

    .customToolbar__move {
        transform: rotate(90deg);
        cursor: grab;
    }

    .customToolbar__default {
        width: 100%;
    }

    .toolbar__btn {
        min-width: 50px;
    }
}
</style>