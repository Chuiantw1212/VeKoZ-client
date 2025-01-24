import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
export default defineStore('user', () => {
    const defaultApi = useVenoniaApi()
    async function deleteUser() {
        const auth = getAuth()
        if (!auth.currentUser) {
            return
        }
        const response = await defaultApi.request('/user', {
            method: 'delete',
        })
        return response
    }
    async function postUser(data: any) {
        const response = await defaultApi.request('/user', {
            method: 'post',
            data,
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
    async function getUserCertificate(data: any) {
        const response = await defaultApi.request(`/user/certificate/${data.fileName}`, {
            method: 'get',
            responseType: 'blob',
        })
        return response
    }
    async function getUserResume(data: any) {
        const response = await defaultApi.request(`/user/resume/${data.fileName}`, {
            method: 'get',
            responseType: 'blob',
        })
        return response
    }
    async function putUserResumes(data: any) {
        const response = await defaultApi.request(`/user/resumes`, {
            method: 'put',
            data,
        })
        return response
    }
    async function putUserCertificates(data: any) {
        const response = await defaultApi.request(`/user/certificates`, {
            method: 'put',
            data,
        })
        return response
    }
    async function putUserPhoto(data: any) {
        const response = await defaultApi.request(`/user/photo`, {
            method: 'put',
            data,
        })
        return response?.data
    }
    async function patchUserPreference(data: any) {
        const response = await defaultApi.request(`/user/preference`, {
            method: 'patch',
            data
        })
        return response
    }
    return {
        deleteUser,
        postUser,
        patchUserProfile,
        putUserResumes,
        putUserCertificates,
        putUserPhoto,
        patchUserPreference,
        getUserResume,
        getUserCertificate,
    }
})