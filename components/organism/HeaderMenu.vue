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
        <el-sub-menu v-if="isSignedIn" index="1" class="headerMenu__firstItem">
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
                <NuxtLink @click="handleSignOut()">
                    登出
                </NuxtLink>
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
import { ref } from 'vue'
import type { IUser } from '~/types/user'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoAuth = useRepoAuth()
const isSignedIn = ref(false)

// Hooks
const router = useRouter()
onMounted(() => {
    addFirebaseListener()
})

// Methods
async function setUserType(userType: 'attendee' | 'host') {
    repoAuth.setUserType(userType)
    repoUser.patchUserPreference({
        userType,
    })
}

function addFirebaseListener() {
    try {
        const auth = getAuth()
        onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            if (!firebaseUser) {
                // 登出後回到首頁
                router.push('/')
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
    } catch (error: any) {
        console.log(error.message || error)
    }
}

async function handleLoggedIn(user: IUser) {
    isSignedIn.value = true
    repoAuth.setUserType('attendee')
    router.push({
        name: 'host'
    })
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
    isSignedIn.value = false
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