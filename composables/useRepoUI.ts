import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'

export default defineStore('ui', {
    state: () => ({
        isMenuCollapse: false,
        isLoading: false,
        loadingInstance: null as any,
    }),
    actions: {
        setLoading(isLoading: boolean) {
            if (isLoading) {
                this.loadingInstance = ElLoading.service({
                    lock: true,
                    fullscreen: true,
                })
            } else {
                this.loadingInstance.close()
            }
        },
        toggleMenu() {
            this.isMenuCollapse = !this.isMenuCollapse
        },
        setMenuCollapse(collapse: boolean) {
            this.isMenuCollapse = collapse
        }
    }
})