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
    async function patchOfferCategory(offer: IOffer): Promise<number> {
        const response = await defaultApi.authRequest(`/offer/category/${offer.categoryId}`, {
            method: 'PATCH',
            body: {
                showInventoryValue: offer.showInventoryValue ?? false,
                sellerId: offer.sellerId,
                sellerName: offer.sellerName,
            }
        })
        return response.text()
    }
    return {
        getOfferList,
        patchOfferCategory,
    }
})
