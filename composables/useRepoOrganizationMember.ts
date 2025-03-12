import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
import type { IOrganizationMember, IOrganizationMemberQuery } from '~/types/organization'
import type { IPagination } from '~/types/ui'

export default defineStore('organizationMember', () => {
    const defaultApi = useVekozApi()
    async function getMemberOrganizationList(params?: IOrganizationMemberQuery) {
        try {
            const response = await defaultApi.authRequest(`/member/organization/list`, {
                method: 'GET',
                params,
            })
            return response.json()
        } catch (error: any) {
            console.log(error.message)
        }
    }
    async function getOrganizationMemberList(organizationId: string, pagination?: IPagination) {
        const response = await defaultApi.authRequest(`/organization/member/list/${organizationId}`, {
            method: 'GET',
            params: pagination,
        })
        return response.json()
    }
    async function getOrganizationMembership(organizationId: string): Promise<IOrganizationMember> {
        const response = await defaultApi.authRequest(`/organization/member/${organizationId}`, {
            method: 'GET',
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
        getMemberOrganizationList,
        getOrganizationMemberList,
        getOrganizationMembership,
        postNewMember,
        patchMember,
        deleteOrganizationMember,
    }
})