'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore/lite';
import { auth, provider, db } from '../lib/firebase';

type AuthStatus = 'loading' | 'checking-permissions' | 'authorized' | 'unauthorized';

interface AuthContextType {
  user: User | null;
  authStatus: AuthStatus;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  // Effect 1: Listen ONLY for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAuthStatus('checking-permissions');
      } else {
        setAuthStatus('unauthorized');
      }
    });
    return () => unsubscribe();
  }, []);

  // Effect 2: Check permissions only when we have a user
  useEffect(() => {
    if (user && authStatus === 'checking-permissions') {
      const checkPermissions = async () => {
        try {
          const userDocRef = doc(db, 'allowed_users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setAuthStatus('authorized');
          } else {
            setAuthStatus('unauthorized');
          }
        } catch (error) {
          console.error("Firestore permission check failed:", error);
          setAuthStatus('unauthorized');
        }
      };
      checkPermissions();
    }
  }, [user, authStatus]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle the rest
    } catch (err) {
      // Catch potential popup-closed-by-user errors, etc.
      if ((err as Error).message.includes('popup-closed-by-user')) {
        console.log('Sign-in cancelled by user.');
      } else {
        console.error('❌ Firebase sign-in error:', (err as Error).message);
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, authStatus, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 