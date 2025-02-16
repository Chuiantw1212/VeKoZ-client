<template>
    <el-avatar :size="32" :src="avatar" />
</template>
<script setup lang="ts">
import avatar from '@/assets/mock/user.jpg'
import { getAuth, onAuthStateChanged, type User, } from "firebase/auth"
import type { IUser } from '~/types/user'
const repoUser = useRepoUser()

// Hooks
onMounted(() => {
    addFirebaseListener()
})

// Methods
function addFirebaseListener() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (!firebaseUser) {
            // 這邊如果做事會中斷登入流程。
            repoUser.setUserType('')
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
}

async function handleLoggedIn(user: IUser) {
    const { preference } = user
    // 使用上次登入狀態或是預設一般參加者
    repoUser.setUserType(preference?.userType ?? 'attendee')
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
</script>