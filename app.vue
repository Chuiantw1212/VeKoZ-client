<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Element Plus Icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const nuxtApp = useNuxtApp()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  nuxtApp.vueApp.component(key, component)
}
// Firebase UI 繁中版
onMounted(async () => {
  // Firebase https://github.com/firebase/firebaseui-web?tab=readme-ov-file#localized-widget
  // await import(`@/assets/firebase/firebase-ui-auth__zh_tw.js`)
  // await import(`@/assets/firebase/firebase-ui-auth.css`)
  // console.log(window)
})
</script>
