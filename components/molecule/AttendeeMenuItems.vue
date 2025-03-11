<template>
    <NuxtLink to="/">
        <el-menu-item class="menu__item" index="1">
            <el-icon>
                <Search />
            </el-icon>
            <span v-if="repoUI.isMedium">
                活動探索
            </span>
        </el-menu-item>
    </NuxtLink>
    <!-- <NuxtLink to="/follows">
        <el-menu-item class="menu__item" index="2">
            <el-icon>
                <Collection />
            </el-icon>
            <span v-if="repoUI.isMedium">
                追隨訂閱
            </span>
        </el-menu-item>
    </NuxtLink> -->
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
    <OrganismUserAuth v-if="!repoUI.isLarge"></OrganismUserAuth>
</template>
<script setup lang="ts">
import { Search, Collection, Setting, Ticket } from '@element-plus/icons-vue'
const repoUI = useRepoUI()
</script>
<style lang="scss">
.menu__item {
    display: flex;
    justify-content: center;
}
</style>