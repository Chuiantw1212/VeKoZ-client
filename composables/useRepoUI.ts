import { defineStore } from 'pinia'
export default defineStore('ui', {
    state: () => ({
        isMenuCollapse: false
    }),
    actions: {
        toggleMenu() {
            this.isMenuCollapse = !this.isMenuCollapse
        },
        setMenuCollapse(collapse: boolean) {
            this.isMenuCollapse = collapse
        }
    }
})