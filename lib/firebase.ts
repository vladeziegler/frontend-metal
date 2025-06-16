// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';

/* ⚠  These must exist in Railway Variables at build-time:
      NEXT_PUBLIC_FIREBASE_API_KEY
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  (frontend-metal-production.up.railway.app)
*/
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

console.log('[Firebase] authDomain at runtime →', firebaseConfig.authDomain);

const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth      = getAuth(app);
export const provider  = new GoogleAuthProvider();
export const db        = getFirestore(app, firebaseConfig.projectId);
