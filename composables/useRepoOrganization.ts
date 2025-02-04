import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('organization', () => {
    const defaultApi = useVenoniaApi()
    async function getOrganizationList() {
        const response = await defaultApi.authRequest(`/organization/list`, {
            method: 'GET',
        })
        return response.json()
    }
    async function postOrganization(body: any) {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'POST',
            body,
        })
        return response
    }
    async function putOrganization(body: any) {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'PUT',
            body,
        })
        return response
    }
    async function deleteOrganization() {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'DELETE',
        })
        return response
    }
    async function getOrganizationMemberList(organizationId: string) {
        const response = await defaultApi.authRequest(`/organization/${organizationId}/member/list`, {
            method: 'GET',
        })
        return response.json()
    }
    return {
        getOrganizationList,
        postOrganization,
        putOrganization,
        deleteOrganization,
        getOrganizationMemberList,
    }
})