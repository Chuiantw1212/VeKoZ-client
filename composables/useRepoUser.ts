import { defineStore } from 'pinia'
import { getAuth, } from "firebase/auth"
import useVekozApi from './useVekozApi'
import type { IUser, IUserPreference, UserType } from '~/types/user'

export default defineStore('user', () => {
    const defaultApi = useVekozApi()
    const route = useRoute()
    const router = useRouter()
    const userInfo = ref<IUser>({})
    const preference = ref<IUserPreference>({
        event: {},
        eventTemplate: {
            organizerId: '',
            templateId: '',
        },
        menuType: '', // 預設需要是空字串
        isFullScreen: false,
    })
    /**
     * 抓用戶自己的資料專用
     * @returns 
     */
    async function getUser(): Promise<IUser | undefined> {
        try {
            const response = await defaultApi.authRequest(`/user`, {
                method: 'GET',
            })
            const user = await response.json() as IUser
            userInfo.value = user
            preference.value = user.preference as IUserPreference ?? {}
            if (String(route.name).includes('host')) {
                preference.value.menuType = 'host'
            } else {
                // 首頁強制轉換，不然會跑版
                preference.value.menuType = 'attendee'
            }
            return userInfo.value
        } catch (error: any) {
            console.log(error.message)
        }
    }
    async function getUserPublicInfo(userId: string): Promise<IUser> {
        const response = await defaultApi.authRequest(`/user/${userId}`, {
            method: 'GET',
        })
        return response.json()
    }
    async function getUserSeoInfo(seoName: string): Promise<IUser> {
        const response = await defaultApi.authRequest(`/user/seo/${seoName}`, {
            method: 'GET',
        })
        return response.json()
    }
    async function setUserType(newUserType: UserType) {
        // menuType.value = newUserType
        if (newUserType) {
            // 除了非登入狀態，紀錄登錄狀態
            patchUserPreference('menuType', newUserType)
        }
        if (newUserType === 'host') {
            if (route.name === 'signIn') {
                router.push({
                    name: 'host-event'
                })
            }
        }
        if (newUserType === 'attendee') {
            if (route.name === 'signIn') {
                router.push('/events')
            }
        }
    }
    async function postNewUser(): Promise<IUser> {
        const response = await defaultApi.authRequest(`/user`, {
            method: 'POST',
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
    async function patchUserPreference(fieldName: string, newValue: any) {
        console.log({
            fieldName,
            newValue,
        })
        if (!preference.value || !userInfo.value.id) {
            return
        }
        if (newValue === Object(newValue)) {
            // 物件合併原有偏好，避免覆蓋掉其他既有偏好資料
            const field = preference.value[fieldName]
            try {
                Object.assign(field, newValue)
            } catch (error) {
                delete preference.value[fieldName]
                preference.value[fieldName] = newValue
            }
        } else {
            preference.value[fieldName] = newValue
        }
        const newPatch: { [key: string]: any } = {}
        newPatch[fieldName] = preference.value[fieldName]
        const response = await defaultApi.authRequest(`/user/preference`, {
            method: 'PATCH',
            body: newPatch
        })
        return response
    }
    async function putUserAvatar(body: any) {
        const response = await defaultApi.authRequest(`/user/avatar`, {
            method: 'PUT',
            body,
        })
        return response.text()
    }
    return {
        userInfo,
        preference,
        getUser,
        getUserPublicInfo,
        getUserSeoInfo,
        setUserType,
        deleteUser,
        postNewUser,
        patchUser,
        putUserAvatar,
        // User preference
        patchUserPreference,
    }
})