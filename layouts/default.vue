<template>
    <el-config-provider namespace="ep">
        <BaseHeader />
        <div class="main-container flex">
            <BaseSide />
            <div w="full" py="4">
                <slot />
            </div>
        </div>
    </el-config-provider>
</template>

<script lang="ts" setup>
// import { useDark, useToggle } from '@vueuse/core'

// export const isDark = useDark()
// export const toggleDark = useToggle(isDark)

import '~/assets/index.scss'

import 'uno.css'
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
// import 'element-plus/theme-chalk/dark/css-vars.css'

import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
#app {
    text-align: center;
    color: var(--ep-text-color-primary);
}

.main-container {
    height: calc(100vh - var(--ep-menu-item-height) - 4px);
}
</style>