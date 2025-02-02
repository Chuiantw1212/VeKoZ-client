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
        <!-- <div class="img__toolbar">
            <button class="toolbar__btn" @click="emit('moveUp')">
                <el-icon>
                    <ArrowUp />
                </el-icon>
            </button>
            <button class="toolbar__btn" @click="emit('moveDown')">
                <el-icon>
                    <ArrowDown />
                </el-icon>
            </button>
        </div> -->
    </div>
</template>
<script setup>
import {
    More,
    Delete,
    ArrowUp,
    ArrowDown,
} from '@element-plus/icons-vue'

const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown'])
const state = reactive({
    isEditing: false,
    positionIndex: 0,
})
const props = defineProps({
    modelValue: {
        type: Object,
        default: function () {
            return {
                url: null, // 初始無值則表示不啟用背景上傳
                position: 'center',
                size: 'cover',
            }
        }
    },
})

// hooks
const localValue = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

// methods
function startEditing() {
    state.isEditing = true
}
function completeEditing() {
    state.isEditing = false
}
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