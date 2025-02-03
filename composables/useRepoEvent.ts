import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEvent } from '~/types/event'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    async function postEvent(body: IEvent) {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'post',
            body,
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
        return response.json()
    }
    return {
        postEvent,
        getEventTemplate,
        putEventTemplate,
    }
})