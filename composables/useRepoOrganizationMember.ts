import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('organizationMember', () => {
    const defaultApi = useVenoniaApi()
    async function getOrganizationMemberList(organizationId: string) {
        const response = await defaultApi.authRequest(`/organization/${organizationId}/member/list`, {
            method: 'GET',
        })
        return response.json()
    }
    return {
        getOrganizationMemberList,
    }
})