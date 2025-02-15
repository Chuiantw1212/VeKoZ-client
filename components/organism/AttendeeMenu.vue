<template>
    <el-menu class="footerMenu" mode="horizontal" :ellipsis="false" :menu-trigger="'click'">
        <MoleculeAttendeeMenuItems></MoleculeAttendeeMenuItems>
    </el-menu>
</template>

<script lang="ts" setup>
import { Menu, Star, Setting, Ticket } from '@element-plus/icons-vue'
import { getAuth, onAuthStateChanged, signOut, type User, } from "firebase/auth"
import avatar from '@/assets/mock/user.jpg'
import type { IUser, UserType } from '~/types/user'
import AttendeeMenuItems from '../molecule/AttendeeMenuItems.vue'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoAuth = useRepoAuth()

// Hooks
const router = useRouter()
const route = useRoute()

// Methods

</script>

<style lang="scss" scoped>
.footerMenu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .footerMenu__logo {
        margin: 0px;
    }

    .footerMenu__firstItem {
        margin-left: auto;
    }
}
</style>