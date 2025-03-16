import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
import type { IPlace, IPlaceQuery } from '~/types/place'

export default defineStore('place', () => {
    const defaultApi = useVekozApi()
    async function getPlaceList(params: IPlaceQuery) {
        const response = await defaultApi.authRequest(`/place/list`, {
            method: 'GET',
            params,
        })
        return response.json()
    }
    async function postPlace(body: IPlace) {
        const response = await defaultApi.authRequest(`/place`, {
            method: 'POST',
            body,
        })
        return response
    }
    async function patchPlace(body: IPlace) {
        const response = await defaultApi.authRequest(`/place`, {
            method: 'PATCH',
            body,
        })
        return response
    }
    async function deletePlace(params: IPlaceQuery) {
        const response = await defaultApi.authRequest(`/place`, {
            method: 'DELETE',
            params,
        })
        return response
    }
    return {
        getPlaceList,
        postPlace,
        patchPlace,
        deletePlace,
    }
})