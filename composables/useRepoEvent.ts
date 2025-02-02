import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    const template = ref()

    async function postEvent() {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'post',
        })
        template.value = await response.text()
        return template.value
    }
    async function getEventTemplate() {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'get',
        })
        template.value = await response.json()
        return template.value
    }
    async function putEventTemplate(body: any) {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'put',
            body,
        })
        template.value = await response.text()
        return template.value
    }
    return {
        template,
        postEvent,
        getEventTemplate,
        putEventTemplate,
    }
})