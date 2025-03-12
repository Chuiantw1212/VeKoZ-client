import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
export default defineStore('google', () => {
    const defaultApi = useVekozApi()
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