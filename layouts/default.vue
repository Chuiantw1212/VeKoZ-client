<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <HeaderMenu></HeaderMenu>
      </el-header>
      <el-container>
        <el-aside>
          <SideMenu></SideMenu>
        </el-aside>
        <el-container>
          <el-main>
            <slot></slot>
          </el-main>
        </el-container>
      </el-container>
      <el-footer>
        <VotionFooter></VotionFooter>
      </el-footer>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { getAuth, onAuthStateChanged, } from "firebase/auth"
import HeaderMenu from '@/components/HeaderMenu.vue'
import SideMenu from '@/components/SideMenu.vue';
import VotionFooter from '@/components/VotionFooter.vue'

const isActor = ref(false)
// const isOrganization = ref(false) // 至少一個負責人

function addFirebaseListener() {
  try {
    const auth = getAuth()
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        return
      }
      const { displayName, email, photoURL, uid } = firebaseUser
      if(firebaseUser?.email==='chuiantw1212@gmail.com'){
        isActor.value = true
      }
    })
  } catch (error: any) {
    console.log(error.message || error)
  }
}

onMounted(() => {
  addFirebaseListener()
})
</script>