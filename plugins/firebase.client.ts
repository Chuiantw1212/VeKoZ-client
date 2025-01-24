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
        apiKey: "AIzaSyCqdGY6WPX0qk-KteFhjp3dfz1bdAwNMuM",
        authDomain: "votion-d92bc.firebaseapp.com",
        projectId: "votion-d92bc",
        storageBucket: "votion-d92bc.firebasestorage.app",
        messagingSenderId: "83032571165",
        appId: "1:83032571165:web:fea97d2ec25be93b1a75f4",
        measurementId: "G-6PBRFGGVJ2"
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
