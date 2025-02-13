import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IOrganization } from '~/types/organization'

export default defineStore('organization', () => {
    const defaultApi = useVenoniaApi()
    async function getOrganizationList(): Promise<IOrganization[]> {
        const response = await defaultApi.authRequest(`/organization/list`, {
            method: 'GET',
        })
        return response.json()
    }
    async function postOrganization(body: any): Promise<IOrganization> {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'POST',
            body,
        })
        return response
    }
    async function putOrganization(organization: IOrganization) {
        const response = await defaultApi.authRequest(`/organization/${organization.id}`, {
            method: 'PUT',
            body: organization,
        })
        return response
    }
    async function deleteOrganization(organizationId: string) {
        const response = await defaultApi.authRequest(`/organization/${organizationId}`, {
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