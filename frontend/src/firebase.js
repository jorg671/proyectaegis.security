import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA7KEVIDqF9Hyfe6Jmr8QyFKqTeBBWbjEY',
  authDomain: 'admin-login-aegis.firebaseapp.com',
  projectId: 'admin-login-aegis',
  storageBucket: 'admin-login-aegis.firebasestorage.app',
  messagingSenderId: '820828814717',
  appId: '1:820828814717:web:35d1b20980d6e8f7d6e014',
  measurementId: 'G-9Q7B8938QS',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const auth = getAuth(app)
