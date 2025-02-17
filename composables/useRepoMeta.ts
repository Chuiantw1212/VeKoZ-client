import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('meta', () => {
    const defaultApi = useVenoniaApi()
    const map = ref<{ [key: string]: any }>({})
    async function getMetaSelectMap() {
        const response = await defaultApi.authRequest(`/meta/select/map`, {
            method: 'GET',
        })
        map.value = response.json()
        return map.value
    }
    return {
        getMetaSelectMap,
    }
})