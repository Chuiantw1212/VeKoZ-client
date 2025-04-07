<template>
    <el-header v-if="repoUser.preference.menuType === 'host' || repoUI.isLarge">
        <HeaderMenu class="vekoz--header"></HeaderMenu>
    </el-header>
    <el-container class="defaultLayout" :class="{ 'defaultLayout__isStandard': !isFullScreen }">
        <el-aside v-if="repoUser.preference.menuType === 'host'" class="defaultLayout__aside">
            <SideMenu></SideMenu>
        </el-aside>
        <el-container>
            <el-main class="vekoz__main">
                <slot></slot>
            </el-main>
        </el-container>
    </el-container>
    <el-footer v-if="repoUser.preference.menuType !== 'host' && !repoUI.isLarge" class="defaultLayout__footer">
        <OrganismAttendeeMenu></OrganismAttendeeMenu>
    </el-footer>
</template>
<script setup lang="ts">
import HeaderMenu from '~/components/organism/HeaderMenu.vue'
import SideMenu from '~/components/organism/SideMenu.vue';
// import zhTw from 'element-plus/dist/locale/zh-tw.mjs'

const repoUser = useRepoUser()
const repoUI = useRepoUI()

const isFullScreen = computed(() => {
    if (repoUser.preference) {
        return repoUser.preference?.isFullScreen
    }
})

</script>
<style lang="scss" scoped>
.vekoz__main {
    overflow-y: unset;
    overflow-x: unset;
}

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
        height: 100%;
        position: sticky;
        top: 60px;
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