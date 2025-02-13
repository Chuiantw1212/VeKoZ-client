import { defineStore } from 'pinia'
// import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
import type { IUser, UserType } from '~/types/user'
/**
 * 大量使用Setup store
 * https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores
 */
export default defineStore('auth', () => {
    // State
    const defaultApi = useVenoniaApi()
    // Actions
    async function postVerificationEmail(body: any) {
        const response = await defaultApi.authRequest(`/auth/verificationEmail`, {
            method: 'POST',
            body
        })
        return response
    }
    async function getReauthResult(body: any) {
        const response = await defaultApi.authRequest(`/auth/password`, {
            method: 'GET',
            body
        })
        return response
    }
    return {
        postVerificationEmail,
        getReauthResult,
    }
})