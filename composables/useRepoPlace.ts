import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('place', () => {
    const defaultApi = useVenoniaApi()
    async function getPlaceList() {
        const response = await defaultApi.authRequest(`/place/list`, {
            method: 'GET',
        })
        return response.json()
    }
    async function postPlace(body: any) {
        const response = await defaultApi.authRequest(`/place`, {
            method: 'POST',
            body,
        })
        return response
    }
    async function putPlace(body: any) {
        const response = await defaultApi.authRequest(`/place/${body.id}`, {
            method: 'PUT',
            body,
        })
        return response
    }
    async function deletePlace(id: string) {
        const response = await defaultApi.authRequest(`/place/${id}`, {
            method: 'DELETE',
        })
        return response
    }
    return {
        getPlaceList,
        postPlace,
        putPlace,
        deletePlace,
    }
})