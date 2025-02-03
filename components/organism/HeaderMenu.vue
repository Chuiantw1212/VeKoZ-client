<template>
  <el-menu class="headerMenu" mode="horizontal" :ellipsis="false">
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
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import avatar from '@/assets/mock/user.jpg'
import { ref } from 'vue'

const isSignedIn = ref(false)

const router = useRouter()

function addFirebaseListener() {
  try {
    // window.firebase = firebase as any
    const auth = getAuth()
    onAuthStateChanged(auth, async (firebaseUser) => {
      // loadingDialogVisible.value = true
      if (!firebaseUser) {
        // await setIdToken(false)
        // await getUserFromServer(false)
        return
      }
      const { displayName, email, photoURL, uid } = firebaseUser
      if (firebaseUser) {
        isSignedIn.value = true
        // router.push({
        //   name: 'index',
        // })
      }
    })
  } catch (error: any) {
    console.log(error.message || error)
  }
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