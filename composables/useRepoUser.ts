import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVenoniaApi from './useVenoniaApi'
import type { IUser, IUserPreference, UserType } from '~/types/user'
import type { IUserDesign } from '~/types/userDesign'

export default defineStore('user', () => {
    const defaultApi = useVenoniaApi()
    const route = useRoute()
    const router = useRouter()
    const userType = ref<UserType>('attendee') // 為了網址簡單，捨棄organizer改用host，並且用這個欄位驗證是否成功登入(isSignedIn)
    const userInfo = ref<IUser>({})
    const userPreference = ref<IUserPreference>({
        event: {

        },
        userType: '',
        isFullScreen: false,
    })
    /**
     * 抓用戶自己的資料專用
     * @returns 
     */
    async function getUser(): Promise<IUser> {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'GET',
        })
        const user = await response.json() as IUser
        userInfo.value = user
        userPreference.value = user.preference as IUserPreference
        if (String(route.name).includes('host')) {
            setUserType('host')
        } else {
            setUserType('attendee')
        }
        return userInfo.value
    }
    async function getPublicUser(seoName: string) {
        const response = await defaultApi.authRequest(`/user/${seoName}`, {
            method: 'GET',
        })
        return response.json()
    }
    async function setUserType(newUserType: UserType) {
        userType.value = newUserType
        if (newUserType) {
            // 除了非登入狀態，紀錄登錄狀態
            patchUserPreference('userType', newUserType)
        }
        if (newUserType === 'host') {
            if (route.name === 'signIn') {
                router.push({
                    name: 'host-event'
                })
            }
            // if (!route.path.includes('host')) {
            // }
        }
        if (newUserType === 'attendee') {
            if (route.name === 'signIn') {
                router.push('/events')
            }
        }
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
    async function patchUser(user: IUser): Promise<boolean> {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'PATCH',
            body: user,
        })
        return response
    }
    async function patchUserSeoName(user: IUser): Promise<any> {
        const result = await defaultApi.authRequest(`/user/seo-name`, {
            method: 'PATCH',
            body: user,
        })
        return result
    }
    async function patchUserPreference(fieldName: string, newValue: any) {
        if (!userPreference.value || !userInfo.value.id) {
            return
        }
        if (newValue === Object(newValue)) {
            const field = userPreference.value[fieldName]
            Object.assign(field, newValue)
        } else {
            userPreference.value[fieldName] = newValue
        }
        const newPatch: { [key: string]: any } = {}
        newPatch[fieldName] = userPreference.value[fieldName]
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
        userType,
        userInfo,
        userPreference,
        getUser,
        getPublicUser,
        setUserType,
        deleteUser,
        postUser,
        patchUserSeoName,
        patchUser,
        putUserPhoto,
        // User preference
        patchUserPreference,
    }
})