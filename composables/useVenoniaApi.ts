// import axios from 'axios'
import { getAuth, } from "firebase/auth"
import type { Auth } from "firebase/auth"
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

interface requestOptions {
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH',
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
            const { method, body, headers, responseType = 'json' } = options
            // Retrieve token
            await this.setToken()

            let urlSearchParams: URLSearchParams = null as any
            if (options.params) {
                urlSearchParams = new URLSearchParams({
                    ...options.params
                })
                url += `?${urlSearchParams}`
            }

            // Build Headers
            const headersFinale: any = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
                ...headers
            }

            // Complete config
            const fetchConfig: { [key: string]: any } = {
                method,
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
                // console.log('???', error)
                // alert(error.message)
            } finally {
                if (axiosResponse?.status === 500) {
                    const statusErrorMessage = axiosResponse.statusText
                    const serverThrowMessage = await axiosResponse.text()
                    ElMessageBox.alert(serverThrowMessage, `${statusErrorMessage}`, {
                        confirmButtonText: '確認',
                    })
                }
                // console.log('axiosResponse', axiosResponse)
                return axiosResponse as any
            }
        },
    },
})
