import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('organization', () => {
    const defaultApi = useVenoniaApi()

    async function postOrganization(data: any) {
        const response = await defaultApi.request(`/organization`, {
            method: 'post',
            data,
        })
        return response
    }
    async function putOrganizationLogo(data: any) {
        const response = await defaultApi.request(`/organization/logo`, {
            method: 'put',
            data,
        })
        return response
    }
    return {
        putOrganizationLogo,
        postOrganization,
    }
})