import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
import type { IUser, UserType } from '~/types/user'
/**
 * 大量使用Setup store
 * https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores
 */
export default defineStore('auth', () => {
    // State
    const defaultApi = useVenoniaApi()
    const userInfo = ref<IUser>()
    const userType = ref<UserType>('') // 為了網址簡單，捨棄organizer改用host，並且用這個欄位驗證是否成功登入(isSignedIn)
    // Actions
    function getUserType() {
        return userType.value
    }
    function setUserType(userTypeValue: UserType) {
        userType.value = userTypeValue
    }
    function setUserInfo(loggedInUser: IUser) {
        userInfo.value = loggedInUser
    }
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
        userType,
        getUserType,
        setUserInfo,
        setUserType,
        postVerificationEmail,
        getReauthResult,
    }
})