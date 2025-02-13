<template>
    <div class="defaultLayout">
        <!-- <el-config-provider :locale="zhTw"> -->
        <el-container>
            <el-header>
                <HeaderMenu></HeaderMenu>
            </el-header>
            <el-container>
                <el-aside v-if="repoUser.userType === 'host'" class="defaultLayout__aside">
                    <SideMenu></SideMenu>
                </el-aside>
                <el-container>
                    <el-main class="defaultLayout__main">
                        <NuxtPage />
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
        <!-- </el-config-provider> -->
    </div>
</template>
<script setup lang="ts">
import HeaderMenu from '~/components/organism/HeaderMenu.vue'
import SideMenu from '~/components/organism/SideMenu.vue';
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'

const repoUser = useRepoUser()
</script>
<style lang="scss" scoped>
.defaultLayout {
    .defaultLayout__aside {
        width: fit-content;
    }
}
</style>