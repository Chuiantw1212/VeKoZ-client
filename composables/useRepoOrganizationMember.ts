import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IOrganizationMember } from '~/types/organization'

export default defineStore('organizationMember', () => {
    const defaultApi = useVenoniaApi()
    async function getOrganizationMemberList(organizationId: string) {
        const response = await defaultApi.authRequest(`/organization/${organizationId}/member/list`, {
            method: 'GET',
        })
        return response.json()
    }
    async function postNewMember(body: IOrganizationMember) {
        const response = await defaultApi.authRequest(`/organization/member`, {
            method: 'GET',
            body,
        })
        return response.json()
    }
    return {
        getOrganizationMemberList,
        postNewMember,
    }
})