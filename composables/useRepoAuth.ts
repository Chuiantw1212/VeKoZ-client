import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
/**
 * 大量使用Setup store
 * https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores
 */
export default defineStore('auth', () => {
    // State
    const defaultApi = useVenoniaApi()
    const user = ref(null)
    const isSigningInProgress = ref(false)
    // Actions
    async function postSignin(data: any) {
        if (isSigningInProgress.value) {
            return
        }
        isSigningInProgress.value = true
        const response = await defaultApi.request(`/auth/signIn`, {
            method: 'post',
            data,
        })
        // state.isSigningInProgress = false
        return response
    }
    async function postVerificationEmail(data: any) {
        const response = await defaultApi.request(`/auth/verificationEmail`, {
            method: 'post',
            data
        })
        return response
    }
    async function getReauthResult(data: any) {
        const response = await defaultApi.request(`/auth/password`, {
            method: 'get',
            data
        })
        return response
    }
    async function userSignout() {
        try {
            localStorage.removeItem("user")
            const auth = getAuth()
            if (auth) {
                await auth.signOut()
            }
            // repoJobApplication.state.userJobs = {}
            setUser(null)
            return true
        } catch (error: any) {
            alert(error.message || error)
        }
    }
    function setUser(user: any) {
        // 在多數程式碼，一旦user非null就視為登入，故這邊不可更動
        user.value = user
        isSigningInProgress.value = false
    }
    // function setCompany(company) {
    //     state.company = company
    // }
    return {
        user,
        postSignin,
        postVerificationEmail,
        getReauthResult,
        userSignout,
    }
})