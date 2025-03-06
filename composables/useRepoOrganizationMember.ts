import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IOrganizationMember } from '~/types/organization'
import type { IPagination } from '~/types/ui'

export default defineStore('organizationMember', () => {
    const defaultApi = useVenoniaApi()
    async function getMemberOrganizatoinList(pagination?: IPagination) {
        const response = await defaultApi.authRequest(`/member/organization/list`, {
            method: 'GET',
            params: pagination,
        })
        return response.json()
    }
    async function getOrganizationMemberList(organizationId: string, pagination: IPagination) {
        const response = await defaultApi.authRequest(`/organization/${organizationId}/member/list`, {
            method: 'GET',
            params: pagination,
        })
        return response.json()
    }
    async function postNewMember(body: IOrganizationMember): Promise<IOrganizationMember> {
        const response = await defaultApi.authRequest(`/organization/member`, {
            method: 'POST',
            body,
        })
        return response.json()
    }
    async function patchMember(body: IOrganizationMember): Promise<IOrganizationMember> {
        const response = await defaultApi.authRequest(`/organization/member`, {
            method: 'PATCH',
            body,
        })
        return response.json()
    }
    async function deleteOrganizationMember(body: IOrganizationMember) {
        const response = await defaultApi.authRequest(`/organization/member`, {
            method: 'DELETE',
            body,
        })
        return response.json()
    }
    return {
        getMemberOrganizatoinList,
        getOrganizationMemberList,
        postNewMember,
        patchMember,
        deleteOrganizationMember,
    }
})