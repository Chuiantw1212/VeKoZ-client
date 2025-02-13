import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
import type { IUserPreference } from '~/types/user'

export default defineStore('user', () => {
    const defaultApi = useVenoniaApi()
    async function getUser() {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'GET',
        })
        return response.json()
    }
    async function postUser(body: any) {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'POST',
            body,
        })
        return response
    }
    async function deleteUser() {
        const auth = getAuth()
        if (!auth.currentUser) {
            return
        }
        const response = await defaultApi.authRequest(`/user`, {
            method: 'DELETE',
        })
        return response
    }
    async function patchUserPreference(preference: IUserPreference) {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'PATCH',
            body: preference
        })
        return response
    }
    async function patchUserProfile(body: any) {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'PATCH',
            body
        })
        return response
    }
    async function putUserPhoto(body: any) {
        const response = await defaultApi.authRequest(`/user/photo`, {
            method: 'PUT',
            body,
        })
        return response.body
    }
    return {
        getUser,
        deleteUser,
        postUser,
        patchUserProfile,
        patchUserPreference,
        putUserPhoto,
    }
})