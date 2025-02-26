<template>
    <div>
        <el-dialog class="venonia-dialog" v-model="dialogVisible" :title="props.title" :width="width"
            :show-close="showClose" :lock-scroll="true" :align-center="true">
            <template #header>
                <div class="venonia-dialog-header">
                    <div>
                        <slot name="header"></slot>
                    </div>
                    <div class="headerUI">
                        <slot name="headerUI"></slot>
                    </div>
                </div>
            </template>
            <template #default>
                <div class="venonia-dialog-body">
                    <slot name="default"></slot>
                </div>
            </template>
            <template #footer>
                <div class="venonia-dialog-footer">
                    <slot name="footer"></slot>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
const repoUI = useRepoUI()
const dialogVisible = defineModel<boolean>('modelValue', {
    default: false
})
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    showClose: {
        type: Boolean,
        default: true,
    },
    loading: {
        type: Boolean,
        default: false,
    }
})
const width = computed(() => {
    /**
     * Element plus 預設 50%
     * 手機版本橫置85%比較適合
     * 寬螢幕最大950px適合
     */
    let width: string | number = '50%'
    if (import.meta.client) {
        const innerWidth = window.innerWidth * 0.85
        if (repoUI.isXLarge) {
            width = Math.min(950, innerWidth)
        } else {
            width = window.innerWidth * 0.85
        }
    }
    return width
})
</script>
<style lang="scss" scoped>
.venonia-dialog {
    .venonia-dialog-header {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;

        .header__btnGroup {
            display: flex;
            align-items: center;

            .btnGroup__btn {
                width: 40px;
                height: 40px;
                background: transparent;
                border: none;
                outline: none;
                cursor: pointer;
                font-size: var(--el-message-close-size, 16px);
            }
        }

        .headerUI {
            display: flex;
            gap: 4px;
            align-items: center;
            color: lightgray
        }
    }

    .venonia-dialog-body {
        max-height: calc(100vh - 180px);
        overflow-y: auto;
        padding: 0 20px;
        // border-top: 1px solid lightgray;
        // border-bottom: 1px solid lightgray;
    }

    .venonia-dialog-footer {
        padding: 0 20px;
    }
}
</style>