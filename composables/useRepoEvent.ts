import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()


    async function postEvent() {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'post',
        })
        return response.json()
    }
    async function getEventTemplate() {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'get',
        })
        return response.json()
    }
    async function putEventTemplate(body: any) {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'put',
            body,
        })
        return response
    }
    return {
        state: {
            test: '1'
        },
        postEvent,
        getEventTemplate,
        putEventTemplate,
    }
})