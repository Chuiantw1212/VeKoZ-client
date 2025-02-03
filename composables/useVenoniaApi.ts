// import axios from 'axios'
import { getAuth, } from "firebase/auth"
import type { Auth } from "firebase/auth"
interface requestOptions {
    method: 'get' | 'put' | 'post' | 'delete' | 'patch',
    body?: any,
    params?: object,
    headers?: object,
    responseType?: string,
}

export default defineStore('api', {
    state: () => {
        return {
            token: ''
        }
    },
    actions: {
        async setToken() {
            let auth: Auth = null as any
            if (import.meta.client) {
                auth = await new Promise((resolve) => {
                    const step = function () {
                        try {
                            const auth = getAuth()
                            if (auth && auth.currentUser) {
                                resolve(auth)
                            } else {
                                window.requestAnimationFrame(step)
                            }
                        } catch (error: any) {
                            alert(error.message)
                            console.log(error)
                            window.requestAnimationFrame(step)
                        }
                    }
                    step()
                })
                if (auth && auth.currentUser) {
                    this.token = await auth.currentUser.getIdToken()
                }
            }
        },
        async authRequest(url: string, options: requestOptions) {
            const { method, body, params = {}, headers, responseType = 'json' } = options
            // Retrieve token
            await this.setToken()

            // Build Headers
            const headersFinale: any = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
                ...headers
            }

            // Complete config
            const fetchConfig: { [key: string]: any } = {
                url,
                method,
                params,
                headers: headersFinale,
                responseType,
            }
            if (body) {
                fetchConfig.body = JSON.stringify(body)
            }
            let axiosResponse = null
            try {
                const apiBase = useRuntimeConfig().public.apiBase
                axiosResponse = await fetch(`${apiBase}${url}`, fetchConfig)
            } catch (error: any) {
                alert(error.message)
            } finally {
                return axiosResponse as any
            }
        },
    },
})
