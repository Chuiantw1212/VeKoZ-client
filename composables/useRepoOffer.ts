import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
import type { IOffer, IPatchOffer } from '~/types/offer'

export default defineStore('offer', () => {
    const defaultApi = useVekozApi()
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
    async function patchOffer(offer: IPatchOffer): Promise<number> {
        const response = await defaultApi.authRequest(`/offer/${offer.id}`, {
            method: 'PATCH',
            body: offer,
        })
        return response.text()
    }

    return {
        getOfferList,
        patchOfferCategory,
        patchOffer,
    }
})
