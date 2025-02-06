<template>
    <el-dialog class="venonia-dialog" v-model="dialogVisible" :title="props.title" :width="width" :show-close="false"
        :lock-scroll="true" :align-center="true">
        <template #header>
            <div class="venonia-dialog-header">
                <div>
                    <slot name="header"></slot>
                </div>
                <div>
                    <slot name="headerUI"></slot>
                </div>
            </div>
        </template>
        <div class="venonia-dialog-body">
            <slot name="default"></slot>
        </div>
    </el-dialog>
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
    }
})
const width = computed(() => {
    /**
     * Element plus 預設 50%
     * 手機版本橫置85%比較適合
     * 寬螢幕最大950px適合
     */
    let width: string | number = '50%'
    return width
    if (import.meta.client) {
        const innerWidth = window.innerWidth * 0.85
        if (repoUI.isMobile) {
            width = Math.min(950, innerWidth)
        } else {
            width = window.innerWidth * 0.85
        }
    }
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
    }

    .venonia-dialog-body {
        max-height: calc(100vh - 180px);
        overflow-y: auto;
        padding: 0 20px;
    }
}
</style>