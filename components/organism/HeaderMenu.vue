<template>
  <el-menu class="headerMenu" mode="horizontal" :ellipsis="false">
    <el-menu-item @click="repoUI.toggleMenu()">
      <el-icon>
        <More />
      </el-icon>
    </el-menu-item>
    <NuxtLink to="/">
      <el-menu-item class="headerMenu__logo">
        <img style="width: 40px" src="@/assets/logo.png" alt="Element logo" />
      </el-menu-item>
    </NuxtLink>
    <el-menu-item class="headerMenu__firstItem">
      <NuxtLink v-if="isSignedIn" @click="handleSignOut()">
        登出
      </NuxtLink>
      <NuxtLink v-else to="/signin">
        登入
      </NuxtLink>
    </el-menu-item>
    <el-menu-item>
      <el-avatar :size="32" :src="avatar" />
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

const isSignedIn = ref(false)

const router = useRouter()

function addFirebaseListener() {
  try {
    const auth = getAuth()
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      console.log({
        firebaseUser
      })
      if (!firebaseUser) {
        router.push('/')
        return
      }

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
      if (emailVerified) {
        // 判斷是否為已註冊用戶
        const user = await getUser()
        console.log({
          user
        })
      } else {
        // 給出重新驗證的畫面
      }
      // if (firebaseUser.id) {
      //   isSignedIn.value = true
      // }
    })
  } catch (error: any) {
    console.log(error.message || error)
  }
}

async function getUser() {
  const result = await repoUser.getUser()
}

async function handleSignOut() {
  const auth = getAuth()
  await signOut(auth)
  router.push({
    name: 'signin',
  })
}

onMounted(() => {
  addFirebaseListener()
})
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