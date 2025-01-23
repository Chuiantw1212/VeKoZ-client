<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item>
      <NuxtLink to="/">
        <img style="width: 40px" src="@/assets/logo.png" alt="Element logo" />
      </NuxtLink>
    </el-menu-item>
    <el-menu-item>
      <NuxtLink v-if="isSignedIn" @click="handleSignOut()">
        Sign Out
      </NuxtLink>
      <NuxtLink v-else to="/signin">
        Sign In
      </NuxtLink>
    </el-menu-item>
    <el-menu-item>
      <el-avatar class="mr-3" :size="32" :src="avatar" />
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
        router.push({
          name: 'index',
        })
      }
    })
  } catch (error: any) {
    console.log(error.message || error)
  }
}

function handleSignOut() {
  router.push({
    name: 'signin',
  })
}

onMounted(() => {
  addFirebaseListener()
})
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>