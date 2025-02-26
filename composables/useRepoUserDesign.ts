import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
import type { IUser, IUserPreference, UserType } from '~/types/user'
import type { IUserDesign } from '~/types/userDesign'

export default defineStore('userDesign', () => {
    const defaultApi = useVenoniaApi()
    async function postUserDesigns(designs: IUserDesign[]) {
        const response = await defaultApi.authRequest(`/user-design/list`, {
            method: 'POST',
            body: designs,
        })
        return response.body
    }
    async function patchUserDesign(design: IUserDesign) {
        const response = await defaultApi.authRequest(`/user-design/${design.id}`, {
            method: 'PATCH',
            body: design,
        })
        return response.body
    }
    return {
        postUserDesigns,
        patchUserDesign,
    }
})