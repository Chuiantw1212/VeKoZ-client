<template>
    <div>
        <el-card>
            <div id="firebaseui-auth-container"></div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import type { OAuthCredentialOptions } from 'firebase/auth/web-extension';
const { $firebase } = useNuxtApp()

function initializeFirebaseUI() {
    const nuxtAppFirebase = $firebase as any
    // https://firebase.google.com/docs/auth/web/firebaseui
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult: any, redirectUrl: string) {
                return false;
            },
        },
        signInOptions: [
            {
                provider: nuxtAppFirebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: ['https://www.googleapis.com/auth/calendar.settings.readonly'],
            },
            {
                provider: nuxtAppFirebase.auth.EmailAuthProvider.PROVIDER_ID,
            }
        ],
        signInFlow: 'popup', // redirect開發時，onAuthStateChanged總是回傳null，必須使用popup才有可能登入成功。
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