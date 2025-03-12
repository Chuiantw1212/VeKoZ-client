import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
import type { IOrganization } from '~/types/organization'

export default defineStore('organization', () => {
    const defaultApi = useVekozApi()
    async function getOrganization(organizationId: string): Promise<IOrganization> {
        const response = await defaultApi.request(`/organization/${organizationId}`, {
            method: 'GET',
        })
        return response.json()
    }
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
        return response.json()
    }
    async function patchOrganization(organization: IOrganization) {
        const response = await defaultApi.authRequest(`/organization`, {
            method: 'PATCH',
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
    return {
        getOrganization,
        getOrganizationList,
        postOrganization,
        patchOrganization,
        deleteOrganization,
    }
})