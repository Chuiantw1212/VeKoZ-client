import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
export default defineStore('google', () => {
    const defaultApi = useVenoniaApi()
    async function getGoogleCalendarEvents(params: any) {
        const response = await defaultApi.authRequest(`/google/calendar/event/list`, {
            method: 'GET',
            params,
        })
        return response.json()
    }
    return {
        getGoogleCalendarEvents,
    }
})