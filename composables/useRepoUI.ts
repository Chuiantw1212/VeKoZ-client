import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'

export default defineStore('ui', {
    state: () => ({
        isMenuCollapse: false,
        isLoading: false,
        loadingInstance: null as any,
        debounceTimeout: {} as { [key: string]: NodeJS.Timeout }
    }),
    actions: {
        /**
         * https://www.freecodecamp.org/news/javascript-debounce-example/
         * @param isLoading 
         */
        debounce(func: Function, timeout = 300) {
            return (id: string, ...args: any) => {
                const existedTimer = this.debounceTimeout[id]
                clearTimeout(existedTimer);

                const newTimer = setTimeout(() => { func.apply(this, args); }, timeout);
                this.debounceTimeout[id] = newTimer
            };
        },
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