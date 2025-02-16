<template>
    <NuxtLink to="/">
        <el-menu-item class="menu__item">
            <el-icon>
                <Menu />
            </el-icon>
            <span v-if="repoUI.isMedium">
                活動選單
            </span>
        </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/follows">
        <el-menu-item class="menu__item">
            <el-icon>
                <Star />
            </el-icon>
            <span v-if="repoUI.isMedium">
                追蹤訂閱
            </span>
        </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/tickets">
        <el-menu-item class="menu__item">
            <el-icon>
                <Ticket />
            </el-icon>
            <span v-if="repoUI.isMedium">
                票券歷史
            </span>
        </el-menu-item>
    </NuxtLink>
    <el-menu-item v-if="!repoUI.isLarge" class="menu__item">
        <OrganismUserAuth></OrganismUserAuth>
    </el-menu-item>
</template>
<script setup lang="ts">
import { Menu, Star, Setting, Ticket } from '@element-plus/icons-vue'
const repoUI = useRepoUI()
</script>
<style lang="scss">
.menu__item {
    display: flex;
    justify-content: center;
}
</style>