<template>
    <el-menu :default-active="activeIndex" class="headerMenu" mode="horizontal" :ellipsis="false"
        :menu-trigger="'click'">
        <!-- <el-menu-item v-if="repoUser.userType === 'host'" class="headerMenu__toggle" @click="repoUI.toggleMenu()">
            <el-icon>
                <More />
            </el-icon>
        </el-menu-item> -->
        <NuxtLink v-if="repoUser.userType === 'host'" to="/host">
            <el-menu-item class="headerMenu__logo">
                <img src="@/assets/logo/140_60_admin.png" class="logo__image" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <NuxtLink v-else to="/">
            <el-menu-item class="headerMenu__logo">
                <img src="@/assets/logo/140_60.png" class="logo__image" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <div v-if="repoUser.userType === 'attendee' && repoUI.isLarge" class="attendee__menu">
            <MoleculeAttendeeMenuItems></MoleculeAttendeeMenuItems>
        </div>
        <div class="menu__endGroup">
            <el-menu-item>
                <el-switch v-model="isFullScreen" active-text="放大" @change="patchUserPreference()" />
            </el-menu-item>
            <NuxtLink v-if="repoUser.userType" to="/settings">
                <el-menu-item index="4" class="headerMenu__firstItem">
                    <OrganismUserAuth></OrganismUserAuth>
                </el-menu-item>
            </NuxtLink>
            <NuxtLink v-else to="/signin">
                <el-menu-item class="headerMenu__firstItem">
                    登入
                </el-menu-item>
            </NuxtLink>
        </div>
    </el-menu>
</template>

<script lang="ts" setup>
import { getAuth, signOut, } from "firebase/auth"
import { MoleculeAttendeeMenuItems } from '#components'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const activeIndex = ref('1')

// Hooks
const router = useRouter()

const isFullScreen = computed(() => {
    if (repoUser.userPreference) {
        return repoUser.userPreference.isFullScreen
    } else {
        return false
    }
})
// watch(() => repoUser.userPreference.isFullScreen, (newValue) => {
//     if (newValue) {
//         isFullScreen.value = true
//     }
// })

// Methods
function patchUserPreference() {
    repoUser.patchUserPreference('isFullScreen', isFullScreen.value)
}

async function handleSignOut() {
    const auth = getAuth()
    await signOut(auth)
    router.push({
        name: 'signIn',
    })
}
</script>

<style lang="scss" scoped>
.headerMenu {
    justify-content: space-between;
    width: calc(100vw - 40px); // -padding x 2
    // z-index: 10;
    // opacity: 1;

    .headerMenu__logo {
        margin: 0px;
        height: 100%;
        padding: 0px;

        .logo__image {
            height: 100%;
        }
    }

    .attendee__menu {
        display: flex;
    }

    .menu__endGroup {
        display: flex;
        align-items: center;
    }
}
</style>