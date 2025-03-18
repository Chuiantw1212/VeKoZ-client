import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
import type { IFollowAction } from '~/types/followAction'

export default defineStore('followAction', () => {
    const defaultApi = useVekozApi()
    async function postFollowAction(body: IFollowAction) {
        const response = await defaultApi.authRequest(`/follow-action`, {
            method: 'POST',
            body,
        })
        return response.json()
    }
    return {
        postFollowAction,
    }
})