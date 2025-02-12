import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'

export default defineStore('eventTemplate', () => {
    const defaultApi = useVenoniaApi()

    async function getEventTemplate(templateId: string) {
        if (!templateId) {
            alert(`templateId沒給：${templateId}`)
            return
        }
        const response = await defaultApi.authRequest(`/event/template/${templateId}`, {
            method: 'GET',
        })
        const result: IEventTemplate | 0 = response.json()
        return result
    }
    async function getEventTemplateList() {
        const response = await defaultApi.authRequest(`/event/template/list`, {
            method: 'GET',
        })
        return response.json()
    }
    async function postEventTemplate(body: IEventTemplate): Promise<IEventTemplate> {
        delete body.id // 另存新檔案
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'POST',
            body,
        })
        return response.json()
    }
    async function patchTemplateDesignIds(template: IEventTemplate) {
        const templateDesignIds = template.designs.map(design => String(design.id))
        const response = await defaultApi.authRequest(`/event/template/${template.id}`, {
            method: 'PATCH',
            body: {
                designIds: templateDesignIds
            },
        })
        return response.text()
    }
    async function patchTemplateName(template: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event/template/${template.id}`, {
            method: 'PATCH',
            body: {
                name: template.name
            },
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
        if (body.id) {
            const response = await defaultApi.authRequest(`/event/template/design`, {
                method: 'PATCH',
                body,
            })
            return response.text()
        }
    }
    return {
        // Template
        postEventTemplate,
        getEventTemplate,
        getEventTemplateList,
        patchTemplateDesignIds,
        patchTemplateName,
        deleteEventTemplate,
        // Design
        postEventTemplateDesign,
        deleteEventTemplateDesign,
        patchEventTemplateDesign,
    }
})