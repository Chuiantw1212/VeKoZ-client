import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    
    async function putEventTemplate(data: any) {
        const response = await defaultApi.request(`/event/template`, {
            method: 'put',
            data,
        })
        return response
    }
    return {
        putEventTemplate,
    }
})