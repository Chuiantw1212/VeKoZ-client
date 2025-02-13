import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
import type { IUserPreference } from '~/types/user'
import type { IUser } from '~/types/user'

export default defineStore('user', () => {
    const defaultApi = useVenoniaApi()
    const userInfo = ref<IUser>({
        preference: {
            event: {

            }
        }
    })

    /**
     * 抓用戶自己的資料專用
     * @returns 
     */
    async function getUser(): Promise<IUser> {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'GET',
        })
        userInfo.value = await response.json() as IUser
        return userInfo.value
    }
    async function postUser(body: IUser): Promise<IUser> {
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
    async function patchUserProfile(body: any) {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'PATCH',
            body
        })
        return response
    }
    async function patchUserPreference(fieldName: string, newValue: any) {
        if (!userInfo.value.preference || !userInfo.value.id) {
            return
        }
        if (newValue === Object(newValue)) {
            const field = userInfo.value.preference[fieldName]
            Object.assign(field, newValue)
        } else {
            userInfo.value.preference[fieldName] = newValue
        }
        const newPatch: { [key: string]: any } = {}
        newPatch[fieldName] = userInfo.value.preference[fieldName]
        const response = await defaultApi.authRequest(`/user/preference`, {
            method: 'PATCH',
            body: newPatch
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
        putUserPhoto,
        // User preference
        patchUserPreference,
    }
})