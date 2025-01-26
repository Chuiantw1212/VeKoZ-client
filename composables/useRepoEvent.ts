import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    async function getEventTemplate() {
        const response = await defaultApi.request(`/event/template`, {
            method: 'get',
        })
        return response.json()
    }
    async function putEventTemplate(body: any) {
        const response = await defaultApi.request(`/event/template`, {
            method: 'put',
            body,
        })
        return response
    }
    return {
        getEventTemplate,
        putEventTemplate,
    }
})