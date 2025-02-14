<template>
    <el-menu class="headerMenu" mode="horizontal" :ellipsis="false" :menu-trigger="'click'">
        <el-menu-item v-if="repoUser.userType === 'host'" @click="repoUI.toggleMenu()">
            <el-icon>
                <More />
            </el-icon>
        </el-menu-item>
        <NuxtLink to="/">
            <el-menu-item class="headerMenu__logo">
                <img style="width: 40px" src="@/assets/logo.png" alt="Element logo" />
            </el-menu-item>
        </NuxtLink>
        <el-sub-menu v-if="repoUser.userType" index="1" class="headerMenu__firstItem">
            <template #title>
                <el-avatar :size="32" :src="avatar" />
            </template>
            <NuxtLink v-if="repoUser.userType === 'attendee'" @click="setUserType('host')">
                <el-menu-item index="1-1">
                    切換為主辦方
                </el-menu-item>
            </NuxtLink>
            <NuxtLink v-if="repoUser.userType === 'host'" @click="setUserType('attendee')">
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
import { More, Fold, Menu } from '@element-plus/icons-vue'
import { getAuth, onAuthStateChanged, signOut, type User, } from "firebase/auth"
import avatar from '@/assets/mock/user.jpg'
import type { IUser, UserType } from '~/types/user'
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoAuth = useRepoAuth()

// Hooks
const router = useRouter()
const route = useRoute()

onMounted(() => {
    addFirebaseListener()
})

// Methods
async function setUserType(userType: UserType) {
    repoUser.userType = userType
    if (userType) {
        // 紀錄為上次登錄狀態
        repoUser.patchUserPreference('userType', userType)
    }
    if (userType === 'host') {
        // router.push('/host/event')
    }
    if (userType === 'attendee') {
        // if (route.name === 'index') {
        //     router.push('/events')
        // }
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
    const { preference } = user
    if (preference?.userType) {
        setUserType(preference.userType)
    }
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