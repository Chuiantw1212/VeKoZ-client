import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
/**
 * https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores
 */
export default defineStore('ui', () => {
    const isResizing = ref<boolean>(false)
    const isMobile = ref<boolean>(false) // 576px, 60%+
    const isTablet = ref<boolean>(false) // 768px, 1%+
    const isDesktop = ref<boolean>(false) // 992px 
    const isLarge = ref<boolean>(false) // 1200px 
    const isMenuCollapse = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const loadingInstance = ref<any>(null)
    const debounceTimeout = ref<{ [key: string]: NodeJS.Timeout }>({})

    function setWidth() {
        const innerWidth = window.innerWidth
        isMobile.value = false
        isTablet.value = false
        isDesktop.value = false
        isLarge.value = false
        isMenuCollapse.value = true
        if (innerWidth >= 576) {
            isMobile.value = true
        }
        if (innerWidth >= 768) {
            isTablet.value = true
        }
        if (innerWidth >= 992) {
            isDesktop.value = true
        }
        if (innerWidth >= 1200) {
            isLarge.value = true
            isMenuCollapse.value = false
        }
        isResizing.value = false
    }

    if (import.meta.client) {
        setWidth()
        window.addEventListener('resize', () => {
            isResizing.value = true
            debounce('resize', () => {
                setWidth()
            })
        })
    }

    // Methods
    /**
     * https://www.freecodecamp.org/news/javascript-debounce-example/
     * @param isLoading
     */
    function debounce(id: string, func: Function, timeout = 300) {
        const existedTimer = debounceTimeout.value[id]
        if (existedTimer) {
            clearTimeout(existedTimer);
        }
        const newTimer = setTimeout(() => {
            func();
            delete debounceTimeout.value[id]
        }, timeout);
        debounceTimeout.value[id] = newTimer
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
        isResizing,
        isMobile,
        isTablet,
        isDesktop,
        isLarge,
        isLoading,
        isMenuCollapse,
        // Functions
        debounce,
        setLoading,
        toggleMenu,
        setMenuCollapse,
    }
})