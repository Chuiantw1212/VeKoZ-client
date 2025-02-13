import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IOrganization } from '~/types/organization'

export default defineStore('organization', () => {
    const defaultApi = useVenoniaApi()
    async function getGoogleCalendarEvents() {

        // const response = await defaultApi.authRequest(`/organization/list`, {
        //     method: 'GET',
        // })
        // return response.json()
    }
    return {
        getGoogleCalendarEvents,
    }
})