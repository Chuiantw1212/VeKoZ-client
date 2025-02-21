import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IOffer } from '~/types/offer'

export default defineStore('offer', () => {
    const defaultApi = useVenoniaApi()
    async function getOfferList(params?: object): Promise<IOffer[]> {
        const response = await defaultApi.authRequest(`/offer/list`, {
            method: 'GET',
            params
        })
        return response.json()
    }
    return {
        getOfferList
    }
})
