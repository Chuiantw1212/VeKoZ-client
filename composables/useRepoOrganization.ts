import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('organization', () => {
    const defaultApi = useVenoniaApi()
    async function getOrganizationList() {
        const response = await defaultApi.authRequest(`/organization/list`, {
            method: 'get',
        })
        return response.json()
    }
    async function postOrganization(body: any) {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'post',
            body,
        })
        return response
    }
    async function putOrganization(body: any) {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'put',
            body,
        })
        return response
    }
    async function deleteOrganization() {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'delete',
        })
        return response
    }
    async function getOrganizationMemberList() {
        const response = await defaultApi.authRequest(`/organization/member/list`, {
            method: 'get',
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