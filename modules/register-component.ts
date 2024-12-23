/**
 * 從npm modules註冊元件
 * https://nuxt.com/docs/guide/directory-structure/components
 */
import { defineNuxtModule, addComponentsDir, createResolver } from '@nuxt/kit'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    // app.component(key, component)
}


export default defineNuxtModule({
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)
        addComponentsDir({
            path: resolver.resolve('@element-plus/icons-vue'),
            global: true,
        })
    }
})