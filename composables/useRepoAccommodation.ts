import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('accommodation', () => {
    const defaultApi = useVenoniaApi()
    async function getAccommodationList() {
        const response = await defaultApi.authRequest(`/accommodation/list`, {
            method: 'get',
        })
        return response.json()
    }
    async function postAccommodation(body: any) {
        const response = await defaultApi.authRequest(`/accommodation`, {
            method: 'post',
            body,
        })
        return response
    }
    async function putAccommodation(body: any) {
        const response = await defaultApi.authRequest(`/accommodation`, {
            method: 'put',
            body,
        })
        return response
    }
    async function deleteAccommodation(id: string) {
        const response = await defaultApi.authRequest(`/accommodation/${id}`, {
            method: 'delete',
        })
        return response
    }
    return {
        getAccommodationList,
        postAccommodation,
        putAccommodation,
        deleteAccommodation,
    }
})