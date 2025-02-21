<template>
    <el-header v-if="repoUser.userType === 'host' || repoUI.isLarge">
        <HeaderMenu class="vekoz--header"></HeaderMenu>
    </el-header>
    <el-container class="defaultLayout" :class="{ 'defaultLayout__isStandard': !repoUser.userPreference.isFullScreen }">
        <el-aside v-if="repoUser.userType === 'host'" class="defaultLayout__aside">
            <SideMenu></SideMenu>
        </el-aside>
        <el-container>
            <el-main class="scsrollable">
                <NuxtPage />
            </el-main>
        </el-container>
    </el-container>
    <el-footer v-if="repoUser.userType !== 'host' && !repoUI.isLarge" class="defaultLayout__footer">
        <OrganismAttendeeMenu></OrganismAttendeeMenu>
    </el-footer>
</template>
<script setup lang="ts">
import HeaderMenu from '~/components/organism/HeaderMenu.vue'
import SideMenu from '~/components/organism/SideMenu.vue';
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'

const repoUser = useRepoUser()
const repoUI = useRepoUI()
</script>
<style lang="scss" scoped>
.vekoz--header {
    position: fixed;
    opacity: 0.9;
    z-index: 10;
}

.defaultLayout {
    font-family: "Noto Sans TC", serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings:
        "wdth" 100;
    justify-content: center;

    .defaultLayout__aside {
        width: fit-content;
    }
}

.defaultLayout__isStandard {
    max-width: 1280px;
    justify-content: center;
    margin: auto;
}

.defaultLayout__footer {
    position: fixed;
    bottom: 0px;
    width: 100vw;
    padding: 0px;
}
</style>