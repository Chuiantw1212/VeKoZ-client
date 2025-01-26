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
            const { method, body, params = {}, headers, responseType = 'json' } = options
            const baseHeaders: any = {
                'Content-Type': 'application/json'
            }
            if (auth && auth.currentUser) {
                this.token = await auth.currentUser.getIdToken()
            }
            if (this.token) {
                baseHeaders.Authorization = `Bearer ${this.token}`
            }
            console.log({
                baseHeaders
            })
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
            if (body) {
                axiosConfig.body = JSON.stringify(body)
            }
            
            console.log({
                axiosConfig
            })

            let axiosResponse = null
            try {
                const apiBase = useRuntimeConfig().public.apiBase
                axiosResponse = await fetch(`${apiBase}${url}`, axiosConfig)
            } catch (error) {

            } finally {
                console.log(axiosResponse)
                return axiosResponse as any
            }
        },
    },
})
