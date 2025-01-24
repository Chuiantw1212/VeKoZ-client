// import axios from 'axios'
import { getAuth, } from "firebase/auth"
import type { Auth } from "firebase/auth"

export default defineStore('api', {
    state: () => {
        return {
            token: ''
        }
    },
    actions: {
        async request(url: string, options: any) {
            let auth: Auth = null as any
            if (import.meta.client) {
                auth = await new Promise((resolve) => {
                    const step = function () {
                        try {
                            const auth = getAuth()
                            resolve(auth)
                        } catch (error) {
                            window.requestAnimationFrame(step)
                        }
                    }
                    step()
                })
            }
            const { method, data, params = {}, headers, responseType = 'json' } = options
            const baseHeaders: {
                [key: string]: string
            } = {
                'Content-Type': 'application/json',
            }
            // if (auth && auth.currentUser) {
            //     this.token = await auth.currentUser.getIdToken()
            // }
            // if (this.token) {
            //     baseHeaders.Authorization = `Bearer ${this.token}`
            // }
            const headersFinale = Object.assign(baseHeaders, headers)
            // Complete config
            const axiosConfig: { [key: string]: string } = {
                url,
                method,
                params,
                headers: headersFinale,
                // timeout,
                responseType,
            }
            if (data) {
                axiosConfig.body = JSON.stringify(data)
            }

            let axiosResponse = null
            try {
                const apiBase = useRuntimeConfig().public.apiBase
                console.log({
                    test: useRuntimeConfig()
                })
                axiosResponse = await fetch(`${apiBase}${url}`, axiosConfig)
            } catch (error) {

            } finally {
                console.log(axiosResponse)
                return axiosResponse as any
            }
        },
    },
})
