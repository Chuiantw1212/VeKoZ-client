import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEventFromList, IEventQuery, IEventSingle } from '~/types/event'
import type { ITemplateDesign } from '~/types/eventTemplate'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    async function postEvent(event: IEventSingle) {
        if (!event.designs?.length) {
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
    async function patchEventCalendar(body: IEventFromList) {
        if (body.startDate! instanceof Date) {
            body.startDate = new Date(body.startDate)
        }
        if (body.endDate! instanceof Date) {
            body.endDate = new Date(body.endDate)
        }
        const response = await defaultApi.authRequest(`/event/calendar`, {
            method: 'PATCH',
            body,
        })
        return response.json()
    }
    async function getEventList(params?: IEventQuery): Promise<IEventFromList[]> {
        const response = await defaultApi.request(`/event/list`, {
            method: 'GET',
            params,
        })
        return response.json()
    }
    async function getEvent(eventId: string): Promise<IEventSingle> {
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