import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEvent } from '~/types/event'
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    async function postEvent(event: IEventTemplate) {
        if (!event.designs.length) {
            alert(`!event.designs.length`)
            return
        }
        const response = await defaultApi.authRequest(`/event`, {
            method: 'POST',
            body: event,
        })
        return response.json()
    }
    async function patchEventForm(body: ITemplateDesign) {
        const response = await defaultApi.authRequest(`/event/form`, {
            method: 'PATCH',
            body,
        })
        return response.json()
    }
    async function patchEventCalendar(body: IEvent) {
        const response = await defaultApi.authRequest(`/event/calendar`, {
            method: 'PATCH',
            body,
        })
        return response.json()
    }
    async function getEventList(params: IEvent): Promise<IEvent[]> {
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
    return {
        // Event
        getEventList,
        getEvent,
        postEvent,
        patchEventForm,
        patchEventCalendar,
        deleteEvent,
    }
})