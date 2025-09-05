import { appwriteAccount } from '@/services/appWrite';
import { Models } from 'appwrite';
import React, { createContext, useEffect, useState } from 'react';

// Define AuthContext type
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  login: (email: string, password: string) => Promise<Models.Session>;
  logout: () => Promise<void>;
}

// Create Auth Context
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  login: async () => ({} as Models.Session),
  logout: async () => {},
});

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await appwriteAccount.get();
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string): Promise<Models.Session> => {
    try {
      const response = await appwriteAccount.createEmailPasswordSession(email, password);
      setIsLoggedIn(true);
      return response;
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await appwriteAccount.deleteSession('current');
      setIsLoggedIn(false);
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};