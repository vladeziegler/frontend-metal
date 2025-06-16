'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';

export function SignIn() {
  const handleSignIn = async () => {
    console.log('[👆 Click] Sign-in button clicked');

    try {
      console.log('[🚀 Firebase] Starting signInWithPopup...');
      const cred = await signInWithPopup(auth, provider);
      console.log('[✅ Firebase] signInWithPopup resolved');

      const token = await cred.user.getIdToken();
      console.log('✅ Signed in as:', cred.user.email);
      console.log('🔐 ID token:', token);
    } catch (err) {
      console.error('❌ Firebase error:', (err as Error).message);
    }
  };

  return (
    <button onClick={handleSignIn} style={{ padding: '1rem', fontSize: '1rem' }}>
      Sign in with Google
    </button>
  );
}
