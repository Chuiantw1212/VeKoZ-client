import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'

export default defineStore('user', () => {
    const defaultApi = useVenoniaApi()

    async function postUser(data: any) {
        const response = await defaultApi.request(`/user`, {
            method: 'post',
            data,
        })
        return response
    }
    async function deleteUser() {
        const auth = getAuth()
        if (!auth.currentUser) {
            return
        }
        const response = await defaultApi.request(`/user`, {
            method: 'delete',
        })
        return response
    }
    async function patchUserProfile(data: any) {
        const response = await defaultApi.request(`/user`, {
            method: 'patch',
            data
        })
        return response
    }
    async function putUserPhoto(data: any) {
        const response = await defaultApi.request(`/user/photo`, {
            method: 'put',
            data,
        })
        return response.data
    }
    return {
        deleteUser,
        postUser,
        patchUserProfile,
        putUserPhoto,
    }
})