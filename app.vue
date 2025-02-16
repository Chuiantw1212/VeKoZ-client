<template>
    <div class="defaultLayout">
        <!-- <el-config-provider :locale="zhTw"> -->
        <el-container>
            <el-header v-if="repoUser.userType === 'host' || repoUI.isLarge">  
                <!-- v-if="repoUser.userType === 'host' || repoUI.isLarge" -->
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
                    <el-footer v-if="repoUser.userType !== 'host' && !repoUI.isLarge" class="defaultLayout__footer">
                        <OrganismAttendeeMenu></OrganismAttendeeMenu>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
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
    .defaultLayout__aside {
        width: fit-content;
    }

    .defaultLayout__footer {
        position: fixed;
        bottom: 0px;
        width: 100vw;
        padding: 0px;
        // background-color: red;
    }
}
</style>