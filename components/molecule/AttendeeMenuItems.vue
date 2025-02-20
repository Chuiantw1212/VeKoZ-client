<template>
    <NuxtLink to="/">
        <el-menu-item class="menu__item" index="1">
            <el-icon>
                <Grid />
            </el-icon>
            <span v-if="repoUI.isMedium">
                活動探索
            </span>
        </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/follows">
        <el-menu-item class="menu__item" index="2">
            <el-icon>
                <Collection />
            </el-icon>
            <span v-if="repoUI.isMedium">
                追蹤訂閱
            </span>
        </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/tickets">
        <el-menu-item class="menu__item" index="3">
            <el-icon>
                <Ticket />
            </el-icon>
            <span v-if="repoUI.isMedium">
                票券歷史
            </span>
        </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/settings">
        <el-menu-item v-if="!repoUI.isLarge" class="menu__item" index="4">
            <OrganismUserAuth></OrganismUserAuth>
        </el-menu-item>
    </NuxtLink>
</template>
<script setup lang="ts">
import { Grid, Collection, Setting, Ticket } from '@element-plus/icons-vue'
const repoUI = useRepoUI()
</script>
<style lang="scss">
.menu__item {
    display: flex;
    justify-content: center;
}
</style>