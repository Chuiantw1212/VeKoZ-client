<template>
    <el-dialog v-model="dialogVisible" :title="props.title" :width="width" :show-close="false" :lock-scroll="true"
        :align-center="true" body-class="venonia-dialog-body">
        <template #header="{ titleId, titleClass }">
            <slot name="header" :titleId="titleId" :titleClass="titleClass"></slot>
        </template>
        <slot name="default"></slot>
    </el-dialog>
</template>
<script setup lang="ts">
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
    const innerWidth = window.innerWidth * 0.85
    return Math.min(950, innerWidth)
})
</script>
<style lang="scss" scoped>
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
}
</style>