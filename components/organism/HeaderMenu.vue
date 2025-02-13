<template>
    <el-menu class="headerMenu" mode="horizontal" :ellipsis="false" :menu-trigger="'click'">
        <el-menu-item v-if="repoAuth.getUserType() === 'host'" @click="repoUI.toggleMenu()">
            <el-icon>
                <More />
            </el-icon>
        </el-menu-item>
        <NuxtLink to="/">
            <el-menu-item class="headerMenu__logo">
                <img style="width: 40px" src="@/assets/logo.png" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <el-sub-menu v-if="repoAuth.getUserType()" index="1" class="headerMenu__firstItem">
            <template #title>
                <el-avatar :size="32" :src="avatar" />
            </template>
            <el-menu-item index="1-1">
                <NuxtLink v-if="repoAuth.getUserType() === 'attendee'" @click="setUserType('host')">
                    切換為主辦方
                </NuxtLink>
                <NuxtLink v-if="repoAuth.getUserType() === 'host'" @click="setUserType('attendee')">
                    切換為一般用戶
                </NuxtLink>
            </el-menu-item>
            <el-menu-item index="1-2">
                <el-button @click="handleSignOut()">
                    登出
                </el-button>
            </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else class="headerMenu__firstItem">
            <NuxtLink to="/signin">
                登入
            </NuxtLink>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import { More, Fold, Menu } from '@element-plus/icons-vue'
import { getAuth, onAuthStateChanged, signOut, type User, } from "firebase/auth"
import avatar from '@/assets/mock/user.jpg'
import type { IUser, UserType } from '~/types/user'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoAuth = useRepoAuth()

// Hooks
const router = useRouter()
onMounted(() => {
    addFirebaseListener()
})

// Methods
async function setUserType(userType: UserType) {
    repoAuth.setUserType(userType)
    if (userType) {
        // 紀錄為上次登錄狀態
        repoUser.patchUserPreference({
            userType,
        })
    }
    if (userType === 'host') {
        router.push('/host/event')
    }
    if (userType === 'attendee') {
        router.push('/events')
    }
}

function addFirebaseListener() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (!firebaseUser) {
            // 這邊如果做事會中斷登入流程。
            setUserType('')
            return
        }
        if (firebaseUser.emailVerified) {
            // 判斷是否為已註冊用戶
            const user: IUser = await repoUser.getUser()
            if (user.id) {
                handleLoggedIn(user)
            } else {
                registeredNewUser(firebaseUser)
            }
        } else {
            // 給出重新驗證的畫面
        }
    })
    var user = auth.currentUser;
    console.log({
        user
    })
}

async function handleLoggedIn(user: IUser) {
    setUserType('host')
}

async function registeredNewUser(firebaseUser: User) {
    const { emailVerified, displayName, email, phoneNumber, photoURL, providerId, uid } = firebaseUser
    const venoniaUser: IUser = {
        emailVerified,
        displayName: displayName ?? '',
        email: email ?? '',
        phoneNumber: phoneNumber ?? '',
        photoURL: photoURL ?? '',
        providerId: providerId,
        uid: uid
    }
}

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
    .headerMenu__logo {
        margin: 0px;
    }

    .headerMenu__firstItem {
        margin-left: auto;
    }
}
</style>