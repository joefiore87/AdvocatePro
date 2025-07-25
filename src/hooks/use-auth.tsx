'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface UserRole {
  role: 'admin' | 'user' | null;
  hasAccess: boolean;
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'none';
  expiresAt?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  hasAccess: boolean;
  roleLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>({
    role: null,
    hasAccess: false,
    subscriptionStatus: 'none'
  });
  const [roleLoading, setRoleLoading] = useState(true);

  // Parse custom claims from Firebase token
  const parseCustomClaims = (token: any): UserRole => {
    return {
      role: token.role || null,
      hasAccess: token.hasAccess || false,
      subscriptionStatus: token.subscriptionStatus || 'none',
      expiresAt: token.expiresAt || undefined
    };
  };
  // Listen for auth state changes and token refresh
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        try {
          // Get fresh token with custom claims
          const tokenResult = await user.getIdTokenResult(true);
          const claims = parseCustomClaims(tokenResult.claims);
          setUserRole(claims);
        } catch (error) {
          console.error('Error getting token claims:', error);
          setUserRole({
            role: null,
            hasAccess: false,
            subscriptionStatus: 'none'
          });
        }
      } else {
        setUserRole({
          role: null,
          hasAccess: false,
          subscriptionStatus: 'none'
        });
      }
      
      setRoleLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh user claims (call after subscription change)
  const refreshUserClaims = async () => {
    if (user) {
      setRoleLoading(true);
      try {
        // Force token refresh to get updated custom claims
        const tokenResult = await user.getIdTokenResult(true);
        const claims = parseCustomClaims(tokenResult.claims);
        setUserRole(claims);
      } catch (error) {
        console.error('Error refreshing claims:', error);
      } finally {
        setRoleLoading(false);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Create user profile if it doesn't exist
    if (result.user) {
      await createUserProfile(result.user);
    }
  };

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile
    if (result.user) {
      await createUserProfile(result.user);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };
  // Create user profile in Firestore
  const createUserProfile = async (user: User) => {
    try {
      const token = await user.getIdToken();
      
      await fetch('/api/user/create-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          displayName: user.displayName,
          uid: user.uid
        })
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userRole,
      isAdmin: userRole.role === 'admin',
      hasAccess: userRole.hasAccess,
      roleLoading,
      signIn,
      signUp,
      signOut,
      refreshUserClaims
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
