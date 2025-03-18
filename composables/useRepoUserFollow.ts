import { defineStore } from 'pinia'
import useVekozApi from './useVekozApi'
import type { IFollowAction } from '~/types/userFollow'

export default defineStore('userFollow', () => {
    const defaultApi = useVekozApi()
    async function getFollowAction(params: IFollowAction) {
        const response = await defaultApi.authRequest(`/user/follow`, {
            method: 'GET',
            params,
        })
        return response.json()
    }
    async function postFollowAction(body: IFollowAction) {
        const response = await defaultApi.authRequest(`/user/follow`, {
            method: 'POST',
            body,
        })
        return response.json()
    }
    async function deleteFollowAction(body: IFollowAction) {
        const response = await defaultApi.authRequest(`/user/follow`, {
            method: 'DELETE',
            body,
        })
        return response.json()
    }
    return {
        getFollowAction,
        postFollowAction,
        deleteFollowAction,
    }
})