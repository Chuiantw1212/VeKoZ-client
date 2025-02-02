<template>
    <div class="backgroud" :class="{ 'backgroud--editing': state.isEditing }" @mouseenter="startEditing()"
        @mouseleave="completeEditing($event)">
        <div class="img__toolbar">
            <button class="toolbar__btn" @click="emit('remove')">
                <Delete />
            </button>
            <button class="toolbar__btn" @click="emit('moveUp')">
                <el-icon>
                    <ArrowUp />
                </el-icon>
            </button>
            <button class="toolbar__btn" @click="emit('moveDown')">
                <ArrowDown />
            </button>
        </div>
        <slot></slot>
    </div>
</template>
<script setup>
import {
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
watch(() => localValue.value.position, (position) => {
    if (position) {
        state.positionIndex = state.positions.findIndex(item => item === position)
    }
}, { immediate: true })

// methods
function startEditing() {
    state.isEditing = true
}
function completeEditing() {
    state.isEditing = false
}
</script>
<style lang="scss" scoped>
.backgroud {
    position: relative;
    background-position: center;

    &:hover {
        outline: solid 5px #252f3d;
    }

    .img__toolbar {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, calc(-100%));
        padding: 10px;
        display: none;
        gap: 10px;
        border-radius: 10px;
        background-color: #252f3d;
        color: white;
        z-index: 1030;

        .toolbar__btn {
            background-color: inherit;
            border: none;
            padding: 0px;
            left: unset;
            cursor: pointer;
        }

        .toolbar__btnGroup {
            position: relative;

            .btnGroup__layer {
                position: absolute;
                top: 0;
                left: 0;
            }
        }

    }

    .img__toolbar--left {
        left: 0;
    }

    .img__toolbar--right {
        right: 0;

    }
}

.backgroud--editing {
    outline: solid 5px #252f3d;

    .img__toolbar {
        display: flex;
    }
}
</style>