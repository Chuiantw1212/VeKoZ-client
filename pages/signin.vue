<template>
    <div>
        <el-card>
            <div id="firebaseui-auth-container"></div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import type { AdditionalUserInfo, Auth, AuthCredential, User } from 'firebase/auth/web-extension';
const { $firebase } = useNuxtApp()

const router = useRouter()
const repoUser = useRepoUser()

function initializeFirebaseUI() {
    const nuxtAppFirebase = $firebase as any
    /**
     * 需要的權限
     * Make secondary Google calendars, and see, create, change, and delete events on them.
     * 一個組織一個月曆
     * https://developers.google.com/calendar/api/auth
     */
    /**
     * Firebase既有的登入UI套件
     * https://firebase.google.com/docs/auth/web/firebaseui
     */
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: async function (authResult: any, redirectUrl: string) {
                /**
                 * 只有用戶第一次登入成功會走這裡
                 */
                const additionalUserInfo: AdditionalUserInfo = authResult.additionalUserInfo
                const credential: AuthCredential = authResult.credential
                const user: User = authResult.user
                await repoUser.postNewUser()
                await repoUser.getUser()
                repoUser.setUserType('attendee')
                router.push('/')
                return false;
            },
        },
        signInOptions: [
            {
                provider: nuxtAppFirebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: ['https://www.googleapis.com/auth/calendar.app.created'],
            },
            {
                provider: nuxtAppFirebase.auth.EmailAuthProvider.PROVIDER_ID,
            }
        ],
        /**
         * redirect 時，onAuthStateChanged總是回傳null，必須使用popup才有可能登入成功。
         * popoup 則可能觸發 Cross-Origin-Opener-Policy policy would block the window.closed call.導致登入失敗。
         */
        signInFlow: 'popup',
        // Terms of service url.
        tosUrl: 'https://storage.googleapis.com/public.econ-sense.com/Terms%20of%20Use.pdf',
        // Privacy policy url.
        privacyPolicyUrl: 'https://storage.googleapis.com/public.econ-sense.com/Privacy%20Policy%20for%20Econ-Sense.com.pdf'
    };

    const firebaseui = (window as any).firebaseui
    if (firebaseui.auth.AuthUI.getInstance()) {
        const ui = firebaseui.auth.AuthUI.getInstance()
        ui?.start('#firebaseui-auth-container', uiConfig)
    } else {
        const ui = new firebaseui.auth.AuthUI(nuxtAppFirebase.auth())
        ui?.start('#firebaseui-auth-container', uiConfig)
    }
    return
}

onMounted(() => {
    if (import.meta.client) {
        initializeFirebaseUI()
    }
})
</script>