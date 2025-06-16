// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/* ⚠  These must exist in Railway Variables at build-time:
      NEXT_PUBLIC_FIREBASE_API_KEY
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  (frontend-metal-production.up.railway.app)
*/
const firebaseConfig = {
  apiKey:      process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:   'backbase-460408',
};

console.log('[Firebase] authDomain at runtime →', firebaseConfig.authDomain);

const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth      = getAuth(app);
export const provider  = new GoogleAuthProvider();
