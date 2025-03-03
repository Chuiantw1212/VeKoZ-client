// Firebase
import firebase from 'firebase/compat/app'
import "firebase/compat/performance";
import "firebase/compat/auth";
(window as any).firebase = firebase

// FirebaseUI
await import(`@/public/firebase/firebase-ui-auth__zh_tw.js`)
await import(`@/public/firebase/firebase-ui-auth.css`)

export default defineNuxtPlugin(() => {
    // Create App
    let firebaseConfig = {
        apiKey: "AIzaSyAcRHG9H_fZiLHJBNrv-IqjSJIqOzHPaSg",
        authDomain: "vekoz-dev-170fa.firebaseapp.com",
        projectId: "vekoz-dev-170fa",
        storageBucket: "vekoz-dev-170fa.firebasestorage.app",
        messagingSenderId: "216703103429",
        appId: "1:216703103429:web:cba49ca3bcae9886765bac",
        measurementId: "G-Y1TZBZ67N1"
    }
    firebase.initializeApp(firebaseConfig)
    try {
        // getAnalytics(app)
    } catch (error: any) {
        console.log('getAnalytics', error.message);
    }
    return {
        provide: {
            firebase,
            storageBucket: firebaseConfig.storageBucket
        }
    }
})
