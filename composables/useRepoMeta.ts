import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
import type { ISelectOption } from '~/types/meta'

export default defineStore('meta', () => {
    const defaultApi = useVekozApi()
    const repoUI = useRepoUI()
    const map = ref<{ [key: string]: ISelectOption[] }>({})

    /**
     * 優先使用以下
     * @param id 
     * @returns 
     */
    async function getMetaSelectById(id: string): Promise<ISelectOption[]> {
        const newPromise = await new Promise((resolve, reject) => {
            repoUI.debounce(`getMetaSelectById-${id}`, async () => {
                if (map.value[id]) {
                    return map.value[id]
                }
                const response = await defaultApi.request(`/meta/select/${id}`, {
                    method: 'GET',
                })
                map.value[id] = response.json()
                if (map.value[id]) {
                    resolve(map.value[id])
                } else {
                    resolve([])
                }
            })
        })
        return newPromise as ISelectOption[]
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