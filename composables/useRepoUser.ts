import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'

export default defineStore('user', () => {
    const defaultApi = useVenoniaApi()

    async function postUser(body: any) {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'post',
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
            method: 'delete',
        })
        return response
    }
    async function patchUserProfile(body: any) {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'patch',
            body
        })
        return response
    }
    async function putUserPhoto(body: any) {
        const response = await defaultApi.authRequest(`/user/photo`, {
            method: 'put',
            body,
        })
        return response.body
    }
    return {
        deleteUser,
        postUser,
        patchUserProfile,
        putUserPhoto,
    }
})