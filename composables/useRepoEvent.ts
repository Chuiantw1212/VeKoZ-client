import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEvent } from '~/types/event'
import type { IEventTemplate } from '~/types/eventTemplate'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    async function postEvent(body: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'post',
            body,
        })
        return response.json()
    }
    async function getEventList(query: IEvent) {
        const params = new URLSearchParams({
            ...query
        })

        const response = await defaultApi.authRequest(`/event/list?${params}`, {
            method: 'get',
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
        return response.text()
    }
    return {
        getEventList,
        postEvent,
        getEventTemplate,
        putEventTemplate,
    }
})