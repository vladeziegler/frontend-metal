// frontend/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDvj8smPctWDKk5wnHY6MHYBABDkVMjbFE',
    authDomain: 'frontend-metal-production.up.railway.app', // hard-coded
    projectId: 'backbase-460408',
  };  
console.log('[Firebase] authDomain at runtime →', firebaseConfig.authDomain);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
