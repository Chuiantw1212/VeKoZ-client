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
    async function getFollowActionList(params: IFollowAction) {
        const response = await defaultApi.authRequest(`/user/follow/list`, {
            method: 'GET',
            params,
        })
        return response.json()
    }
    async function postFollowAction(body: IFollowAction): Promise<IFollowAction> {
        const response = await defaultApi.authRequest(`/user/follow`, {
            method: 'POST',
            body,
        })
        return response.json()
    }
    async function patchFollowActionColor(body: IFollowAction): Promise<IFollowAction> {
        const response = await defaultApi.authRequest(`/user/follow`, {
            method: 'PATCH',
            body,
        })
        return response.json()
    }
    async function deleteFollowAction(params: IFollowAction) {
        const response = await defaultApi.authRequest(`/user/follow`, {
            method: 'DELETE',
            params,
        })
        return response.json()
    }
    return {
        getFollowAction,
        getFollowActionList,
        postFollowAction,
        patchFollowActionColor,
        deleteFollowAction,
    }
})