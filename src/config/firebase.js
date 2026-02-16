import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDzowbS7o-XrXRcYxKKL-SDPT_heJSLIII',
  authDomain: 'proyectsend.firebaseapp.com',
  projectId: 'proyectsend',
  storageBucket: 'proyectsend.firebasestorage.app',
  messagingSenderId: '590115016237',
  appId: '1:590115016237:web:86ba57363fd2644325b2a4',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send')
