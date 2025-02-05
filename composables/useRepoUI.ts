import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
/**
 * https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores
 */
export default defineStore('ui', () => {
    const isMobile = ref<boolean>(false) // 60%+
    const isTablet = ref<boolean>(false) // 1%+
    const isDesktop = ref<boolean>(false) // 992px 35%+
    const isMenuCollapse = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const loadingInstance = ref<any>(null)
    const debounceTimeout = ref<{ [key: string]: NodeJS.Timeout }>({})

    /**
     * https://www.freecodecamp.org/news/javascript-debounce-example/
     * @param isLoading
     */
    function debounce(func: Function, timeout = 300) {
        return (id: string, ...args: any) => {
            const existedTimer = debounceTimeout.value[id]
            clearTimeout(existedTimer);

            const newTimer = setTimeout(() => { func.apply(args); }, timeout);
            debounceTimeout.value[id] = newTimer
        };
    }
    function setLoading(isLoading: boolean) {
        if (isLoading) {
            loadingInstance.value = ElLoading.service({
                lock: true,
                fullscreen: true,
            })
        } else {
            loadingInstance.value.close()
        }
    }
    function toggleMenu() {
        isMenuCollapse.value = !isMenuCollapse.value
    }
    function setMenuCollapse(collapse: boolean) {
        isMenuCollapse.value = collapse
    }

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLoading,
        isMenuCollapse,
        // Functions
        debounce,
        setLoading,
        toggleMenu,
        setMenuCollapse,
    }
})