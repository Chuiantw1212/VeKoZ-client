<template>
    <div>
        <div id="firebaseui-auth-container"></div>
    </div>
</template>
<script setup lang="ts">
import firebase from 'firebase/compat/app'
import "firebase/compat/auth";

function initializeFirebaseUI() {
    console.log({
        firebase
    })
    // https://firebase.google.com/docs/auth/web/firebaseui
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult: any, redirectUrl: string) {
                return false;
            },
        },
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        signInFlow: 'popup',
        // Terms of service url.
        tosUrl: 'https://storage.googleapis.com/public.econ-sense.com/Terms%20of%20Use.pdf',
        // Privacy policy url.
        privacyPolicyUrl: 'https://storage.googleapis.com/public.econ-sense.com/Privacy%20Policy%20for%20Econ-Sense.com.pdf'
    };

    const firebaseui = (window as any).firebaseui
    try {
        if (firebaseui.auth.AuthUI.getInstance()) {
            const ui = firebaseui.auth.AuthUI.getInstance()
            ui?.start('#firebaseui-auth-container', uiConfig)
        } else {
            const ui = new firebaseui.auth.AuthUI(firebase.auth())
            ui?.start('#firebaseui-auth-container', uiConfig)
        }

    } catch (error) {
        console.log(error)
    }
    return
}

onMounted(() => {
    if (import.meta.client) {
        initializeFirebaseUI()
    }
})
</script>