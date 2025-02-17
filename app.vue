<template>
    <el-header v-if="repoUser.userType === 'host' || repoUI.isLarge">  
        <!-- v-if="repoUser.userType === 'host' || repoUI.isLarge" -->
        <HeaderMenu></HeaderMenu>
    </el-header>
    <el-container class="defaultLayout" :class="{'defaultLayout__attendee': true}">
        <el-aside v-if="repoUser.userType === 'host'" class="defaultLayout__aside">
            <SideMenu></SideMenu>
        </el-aside>
        <el-container>
            <el-main >
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
.defaultLayout {
    justify-content: center;

    .defaultLayout__aside {
        width: fit-content;
    }
}

.defaultLayout__attendee{
    max-width: 1280px; // ?
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