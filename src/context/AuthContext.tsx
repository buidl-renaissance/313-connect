import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDPoP } from '@/hooks/useDPoP';

interface User {
  id: string;
  walletAddress: string;
  identity?: {
    number: string;
  };
  profile?: {
    displayName: string | null;
    region: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  challengeId: string | null;
  challenge: string | null;
  publicKey: string | null;
  requestChallenge: () => Promise<void>;
  verifySignature: (signature: string, walletAddress: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);

  const { publicKey, isReady, clearKeys } = useDPoP();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Request authentication challenge
  const requestChallenge = useCallback(async () => {
    if (!publicKey) {
      console.error('Public key not ready');
      return;
    }

    try {
      const response = await fetch('/api/auth/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey }),
      });

      const data = await response.json();

      if (data.success) {
        setChallengeId(data.challengeId);
        setChallenge(data.challenge);
      } else {
        console.error('Failed to request challenge:', data.error);
      }
    } catch (error) {
      console.error('Error requesting challenge:', error);
    }
  }, [publicKey]);

  // Verify signature from mobile app
  const verifySignature = useCallback(
    async (signature: string, walletAddress: string): Promise<boolean> => {
      if (!challengeId) {
        console.error('No challenge ID');
        return false;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            challengeId,
            signature,
            walletAddress,
          }),
        });

        const data = await response.json();

        if (data.success && data.token && data.user) {
          // Store token and user
          localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

          setToken(data.token);
          setUser(data.user);
          setChallengeId(null);
          setChallenge(null);

          return true;
        } else {
          console.error('Verification failed:', data.error);
          return false;
        }
      } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
      }
    },
    [challengeId]
  );

  // Refresh authentication
  const refreshAuth = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    }
  }, [token]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    clearKeys();
    setToken(null);
    setUser(null);
    setChallengeId(null);
    setChallenge(null);
  }, [clearKeys]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    challengeId,
    challenge,
    publicKey,
    requestChallenge,
    verifySignature,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

