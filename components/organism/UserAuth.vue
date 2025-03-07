<template>
    <el-avatar v-if="repoUser.userInfo.id" :size="32" :src="repoUser.userInfo.avatar" />
    <el-avatar v-else :size="32" :src="defaultAvatar" />
</template>
<script setup lang="ts">
import defaultAvatar from '@/assets/logo/160_160.png'
import { getAuth, onAuthStateChanged, type Unsubscribe, type User, } from "firebase/auth"
import type { IUser } from '~/types/user'

const route = useRoute()
const router = useRouter()
const repoUser = useRepoUser()
const unsuber = ref<Unsubscribe>()
const repoUI = useRepoUI()

// Hooks
onMounted(() => {
    addFirebaseListener()
})

onBeforeUnmount(() => {
    if (unsuber.value) {
        unsuber.value()
    }
})

// Methods
function addFirebaseListener() {
    const auth = getAuth()
    unsuber.value = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (!firebaseUser) {
            // 這邊如果做事會中斷登入流程。
            repoUser.setUserType('')
            router.push('/')
            return
        }
        if (firebaseUser.emailVerified) {
            // 判斷是否為已註冊用戶
            const user = await repoUser.getUser()
            if (user?.id) {
                handleLoggedIn(user)
            } else {
                await repoUser.postNewUser()
                await repoUser.getUser()
                router.push('/')
            }
            // })
        } else {
            // 給出重新驗證的畫面
        }
    })
}

async function handleLoggedIn(user: IUser) {
    const { preference } = user
    if (route.name === 'signin') {
        router.push('/')
    }
    // // 使用上次登入狀態或是預設一般參加者
    // repoUser.setUserType(preference?.menuType ?? 'attendee')
}
</script>