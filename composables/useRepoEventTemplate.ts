import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'

export default defineStore('eventTemplate', () => {
    const defaultApi = useVenoniaApi()
    const mostRecentEventTemplate = ref<IEventTemplate>()

    async function getEventTemplate() {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'GET',
        })
        const result: IEventTemplate | 0 = response.json()
        return result
    }
    async function postEventTemplate(body: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'POST',
            body,
        })
        // const result = response.text()
        // if (result) {
        //     body.id = result
        //     mostRecentEventTemplate.value = body
        // }
        return response.text()
    }
    async function patchEventTemplate(body: string[]) {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'PATCH',
            body,
        })
        return response.text()
    }
    async function deleteEventTemplate(id: string) {
        const response = await defaultApi.authRequest(`/event/template/${id}`, {
            method: 'DELETE',
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
    async function deleteEventTemplateDesign(id: string) {
        const response = await defaultApi.authRequest(`/event/template/design/${id}`, {
            method: 'DELETE',
        })
        return response.text()
    }
    async function patchEventTemplateDesign(body: ITemplateDesign) {
        const response = await defaultApi.authRequest(`/event/template/design`, {
            method: 'PATCH',
            body,
        })
        return response.text()
    }
    return {
        // Template
        postEventTemplate,
        getEventTemplate,
        patchEventTemplate,
        deleteEventTemplate,
        // Design
        postEventTemplateDesign,
        deleteEventTemplateDesign,
        patchEventTemplateDesign,
    }
})