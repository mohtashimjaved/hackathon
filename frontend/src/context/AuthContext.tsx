'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser, fetchMe } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  location?: string;
  trustScore?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    skills: string[];
    interests: string[];
    location: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    const initialize = async () => {
      const stored = getCurrentUser();
      if (stored) {
        setUser(stored);
        // Silently refresh user data from server
        try {
          const freshUser = await fetchMe();
          const mappedUser = {
            id: freshUser._id,
            name: freshUser.name,
            email: freshUser.email,
            role: freshUser.role,
            avatar: freshUser.avatar,
            bio: freshUser.bio,
            skills: freshUser.skills,
            interests: freshUser.interests,
            location: freshUser.location,
            trustScore: freshUser.trustScore
          };
          setUser(mappedUser);
        } catch (err) {
          console.error('Failed to refresh user session', err);
        }
      }
      setLoading(false);
    };
    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setUser(data.user);
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    skills: string[];
    interests: string[];
    location: string;
  }) => {
    const data = await registerUser(payload);
    setUser(data.user);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const freshUser = await fetchMe();
      const mappedUser = {
        id: freshUser._id,
        name: freshUser.name,
        email: freshUser.email,
        role: freshUser.role,
        avatar: freshUser.avatar,
        bio: freshUser.bio,
        skills: freshUser.skills,
        interests: freshUser.interests,
        location: freshUser.location,
        trustScore: freshUser.trustScore
      };
      setUser(mappedUser);
    } catch (err) {
      console.error('Refresh user failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
