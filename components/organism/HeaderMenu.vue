<template>
    <el-menu :default-active="activeIndex" class="headerMenu" mode="horizontal" :ellipsis="false"
        :menu-trigger="'click'">
        <!-- <el-menu-item v-if="repoUser.preference.menuType === 'host'" class="headerMenu__toggle" @click="repoUI.toggleMenu()">
            <el-icon>
                <More />
            </el-icon>
        </el-menu-item> -->
        <NuxtLink v-if="repoUser.preference.menuType === 'host'" to="/host">
            <el-menu-item class="headerMenu__logo">
                <img src="@/assets/logo/140_60_admin.png" class="logo__image" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <NuxtLink v-else to="/">
            <el-menu-item class="headerMenu__logo">
                <img src="@/assets/logo/140_60.png" class="logo__image" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <div v-if="repoUser.preference.menuType === 'attendee' && repoUI.isLarge" class="attendee__menu">
            <MoleculeAttendeeMenuItems></MoleculeAttendeeMenuItems>
        </div>
        <div class="menu__endGroup">
            <OrganismUserAuth></OrganismUserAuth>
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
const route = useRoute()

const isFullScreen = computed(() => {
    if (repoUser.preference) {
        return repoUser.preference.isFullScreen
    } else {
        return false
    }
})

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