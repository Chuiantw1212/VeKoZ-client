<template>
    <el-menu class="headerMenu" mode="horizontal" :ellipsis="false" :menu-trigger="'click'">
        <!-- <el-menu-item v-if="repoUser.userType === 'host'" class="headerMenu__toggle" @click="repoUI.toggleMenu()">
            <el-icon>
                <More />
            </el-icon>
        </el-menu-item> -->
        <NuxtLink to="/">
            <el-menu-item class="headerMenu__logo">
                <img style="width: 40px" src="@/assets/logo.png" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <div v-if="repoUser.userType === 'attendee' && repoUI.isLarge" class="attendee__menu">
            <MoleculeAttendeeMenuItems></MoleculeAttendeeMenuItems>
        </div>
        <el-sub-menu v-if="repoUser.userType" index="1" class="headerMenu__firstItem">
            <template #title>
                <OrganismUserAuth></OrganismUserAuth>
            </template>
            <NuxtLink v-if="repoUser.userType === 'attendee'" @click="repoUser.setUserType('host')">
                <el-menu-item index="1-1">
                    切換為主辦方
                </el-menu-item>
            </NuxtLink>
            <NuxtLink v-if="repoUser.userType === 'host'" @click="repoUser.setUserType('attendee')">
                <el-menu-item index="1-1">
                    切換為一般用戶
                </el-menu-item>
            </NuxtLink>
            <el-menu-item index="1-2" @click="handleSignOut()">
                登出
            </el-menu-item>
        </el-sub-menu>
        <NuxtLink v-else to="/signin">
            <el-menu-item class="headerMenu__firstItem">
                登入
            </el-menu-item>
        </NuxtLink>
    </el-menu>
</template>

<script lang="ts" setup>
import { getAuth, signOut, } from "firebase/auth"
import { MoleculeAttendeeMenuItems } from '#components'
const repoUI = useRepoUI()
const repoUser = useRepoUser()

// Hooks
const router = useRouter()

// Methods

async function handleSignOut() {
    const auth = getAuth()
    await signOut(auth)
    router.push({
        name: 'signin',
    })
}
</script>

<style lang="scss" scoped>
.headerMenu {
    justify-content: space-between;

    .headerMenu__logo {
        margin: 0px;
    }

    .attendee__menu {
        display: flex;
    }
}
</style>