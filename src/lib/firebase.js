import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCwxR5pEIg4gjh2VAe4gUHIMpbmZvg-gQ8",
  authDomain: "copa-parrillero.firebaseapp.com",
  projectId: "copa-parrillero",
  storageBucket: "copa-parrillero.firebasestorage.app",
  messagingSenderId: "108525168842",
  appId: "1:108525168842:web:90e26c282b354e1026ec33"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
