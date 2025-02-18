import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { ISelectOption } from '~/types/meta'

export default defineStore('meta', () => {
    const defaultApi = useVenoniaApi()
    const map = ref<{ [key: string]: ISelectOption[] }>({})

    /**
     * 優先使用以下
     * @param id 
     * @returns 
     */
    async function getMetaSelectById(id: string): Promise<ISelectOption[]> {
        if (map.value[id]) {
            return map.value[id]
        }
        const response = await defaultApi.request(`/meta/select/${id}`, {
            method: 'GET',
        })
        map.value[id] = response.json()
        if (map.value[id]) {
            return map.value[id]
        } else {
            return []
        }
    }
    /**
     * 因為佔用記憶體無法快取，盡可能避免
     * @returns 
    */
    async function getMetaSelectMap() {
        const response = await defaultApi.authRequest(`/meta/select/map`, {
            method: 'GET',
        })
        map.value = response.json()
        return map.value
    }
    return {
        getMetaSelectById,
        getMetaSelectMap,
    }
})