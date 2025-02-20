<template>
    <el-card class="venonia__card">
        <!-- <template #header>
            <slot name="header">

            </slot>
        </template> -->
        <template #default>
            <slot name="default">

            </slot>
        </template>
        <template #footer>
            <div class="card__footer">
                <slot name="footer">
                </slot>
            </div>
        </template>
    </el-card>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
.venonia__card {
    :deep(.el-card__body) {
        padding: 0px;
    }

    :deep(.el-card__footer) {
        padding: 8px;
    }

    .card__footer {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        align-items: center;
    }
}
</style>