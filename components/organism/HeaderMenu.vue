<template>
    <el-menu :default-active="activeIndex" class="headerMenu" mode="horizontal" :ellipsis="false"
        :menu-trigger="'click'">
        <NuxtLink v-if="repoUser.preference.menuType === 'host'" to="/host">
            <el-menu-item class="headerMenu__logo" index="host">
                <img src="@/assets/logo/140_60_admin.png" class="logo__image" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <NuxtLink v-else to="/">
            <el-menu-item class="headerMenu__logo" index="index">
                <img src="@/assets/logo/140_60.png" class="logo__image" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <div v-if="repoUser.preference.menuType === 'attendee' && repoUI.isLarge" class="attendee__menu">
            <MoleculeAttendeeMenuItems></MoleculeAttendeeMenuItems>
        </div>
        <div class="menu__endGroup">
            <el-switch class="item__switch" :model-value="isFullScreen" active-text="延展"
                @change="patchUserPreference()" />
            <OrganismUserAuth></OrganismUserAuth>
        </div>
    </el-menu>
</template>

<script lang="ts" setup>
import { MoleculeAttendeeMenuItems } from '#components'
const route = useRoute()
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const activeIndex = ref<string>('index')

// Hooks
onMounted(() => {
    activeIndex.value = String(route.name)
})
const isFullScreen = computed(() => {
    return repoUser.preference.isFullScreen ?? false
})

// Methods
function patchUserPreference() {
    repoUser.patchUserPreference('isFullScreen', !isFullScreen.value)
}
</script>

<style lang="scss" scoped>
.headerMenu {
    justify-content: space-between;
    width: calc(100vw - 40px); // -padding x 2

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