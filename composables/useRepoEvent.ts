import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEvent } from '~/types/event'
import type { IEventTemplate } from '~/types/eventTemplate'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    async function postEvent(body: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'POST',
            body,
        })
        return response.json()
    }
    async function patchEvent(body: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'PATCH',
            body,
        })
        return response.json()
    }
    async function getEventList(params: IEvent) {
        const response = await defaultApi.authRequest(`/event/list`, {
            method: 'GET',
            params,
        })
        return response.json()
    }
    async function getEvent(eventId: string) {
        const response = await defaultApi.authRequest(`/event/${eventId}`, {
            method: 'GET',
        })
        return response.json()
    }
    async function deleteEvent(eventId: string) {
        const response = await defaultApi.authRequest(`/event/${eventId}`, {
            method: 'DELETE',
        })
        return response.text()
    }
    // Template
    async function getEventTemplate() {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'GET',
        })
        return response.json()
    }
    async function postEventTemplate(body: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'POST',
            body,
        })
        return response.text()
    }
    async function patchEventTemplate(body: string[]) {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'PATCH',
            body,
        })
        return response.text()
    }
    async function postEventTemplateDesign(body: any) {
        const response = await defaultApi.authRequest(`/event/template/design`, {
            method: 'POST',
            body,
        })
        return response.text()
    }
    return {
        // Event
        getEventList,
        getEvent,
        postEvent,
        patchEvent,
        deleteEvent,
        // Template
        postEventTemplate,
        getEventTemplate,
        patchEventTemplate,
        postEventTemplateDesign,
    }
})