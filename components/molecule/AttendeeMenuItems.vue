<template>
    <NuxtLink to="/">
        <el-menu-item>
            <el-icon>
                <Menu />
            </el-icon>
            <span v-if="repoUI.isMedium">
                活動選單
            </span>
        </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/follows">
        <el-menu-item>
            <el-icon>
                <Star />
            </el-icon>
            <span v-if="repoUI.isMedium">
                追蹤訂閱
            </span>
        </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/">
        <el-menu-item>
            <el-icon>
                <Ticket />
            </el-icon>
            <span v-if="repoUI.isMedium">
                票券歷史
            </span>
        </el-menu-item>
    </NuxtLink>
    <el-menu-item v-if="!repoUI.isLarge">
        <OrganismUserAuth></OrganismUserAuth>
    </el-menu-item>
    <!-- <NuxtLink to="/">
        <el-menu-item>
            <el-icon>
                <Setting />
            </el-icon>
            <span v-if="repoUI.isMedium">
                偏好設定
            </span>
        </el-menu-item>
    </NuxtLink> -->
</template>
<script setup lang="ts">
import { Menu, Star, Setting, Ticket } from '@element-plus/icons-vue'
const repoUI = useRepoUI()
</script>