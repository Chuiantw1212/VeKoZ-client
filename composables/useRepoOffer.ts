import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IOrganization } from '~/types/organization'

export default defineStore('offer', () => {
    const defaultApi = useVenoniaApi()
    async function getOfferList(params?: object): Promise<IOrganization[]> {
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
