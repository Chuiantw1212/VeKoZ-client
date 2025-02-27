<template>
    <el-container class="defaultLayout">
        <el-main>
            <slot></slot>
        </el-main>
    </el-container>
</template>
<style lang="scss" scoped>
.defaultLayout__isStandard {
    max-width: 1280px;
    justify-content: center;
    margin: auto;
}
</style>