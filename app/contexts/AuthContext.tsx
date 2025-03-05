import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCurrentUser, signOut as firebaseSignOut } from '../services/firebase';

type AuthContextType = {
  user: { uid: string; displayName: string | null; photoURL: string | null; email: string | null } | null;
  loading: boolean;
  setUser: (user: { uid: string; displayName: string | null; photoURL: string | null; email: string | null } | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  setUser: () => {}, 
  logout: async () => {} 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ uid: string; displayName: string | null; photoURL: string | null; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore/RTDB
        try {
          const userData = await getCurrentUser();
          setUser({
            uid: firebaseUser.uid,
            displayName: userData?.username || firebaseUser.displayName,
            photoURL: userData?.avatar || firebaseUser.photoURL,
            email: userData?.email || firebaseUser.email,
          });
        } catch (error) {
          console.error('Error getting user data:', error);
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            email: firebaseUser.email,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut();
      console.log('User logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);