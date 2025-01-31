import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('accomodation', () => {
    const defaultApi = useVenoniaApi()
    async function getAccomodationList() {
        const response = await defaultApi.authRequest(`/accomodation/list`, {
            method: 'get',
        })
        return response.json()
    }
    async function postAccomodation(body: any) {
        const response = await defaultApi.authRequest(`/accomodation`, {
            method: 'post',
            body,
        })
        return response
    }
    async function putAccomodation(body: any) {
        const response = await defaultApi.authRequest(`/accomodation`, {
            method: 'put',
            body,
        })
        return response
    }
    async function deleteAccomodation(body: any) {
        const response = await defaultApi.authRequest(`/accomodation`, {
            method: 'delete',
            body,
        })
        return response
    }
    return {
        getAccomodationList,
        postAccomodation,
        putAccomodation,
        deleteAccomodation,
    }
})