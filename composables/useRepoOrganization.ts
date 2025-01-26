import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('organization', () => {
    const defaultApi = useVenoniaApi()
    async function getOrganizationList() {
        const response = await defaultApi.request(`/organization/list`, {
            method: 'get',
        })
        return response.json()
    }
    async function postOrganization(body: any) {
        const response = await defaultApi.request(`/organization`, {
            method: 'post',
            body,
        })
        return response
    }
    async function putOrganization(body: any) {
        const response = await defaultApi.request(`/organization`, {
            method: 'put',
            body,
        })
        return response
    }
    async function deleteOrganization(body: any) {
        const response = await defaultApi.request(`/organization`, {
            method: 'delete',
            body,
        })
        return response
    }
    return {
        getOrganizationList,
        postOrganization,
        putOrganization,
        deleteOrganization,
    }
})