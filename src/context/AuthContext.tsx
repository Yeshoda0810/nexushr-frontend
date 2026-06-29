import { createContext, useContext, useState, type ReactNode } from 'react';
import apiClient from '../api/client';
import type { AuthResponse, CurrentUser } from '../types';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthContextType {
  user: CurrentUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadUserFromStorage(): CurrentUser | null {
  const stored = localStorage.getItem('nexushr_user');
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(loadUserFromStorage());

  function saveSession(data: AuthResponse) {
    localStorage.setItem('nexushr_token', data.token);
    const currentUser: CurrentUser = {
      employeeId: data.employeeId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem('nexushr_user', JSON.stringify(currentUser));
    setUser(currentUser);
  }

  async function login(email: string, password: string) {
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    saveSession(res.data);
  }

  async function signup(data: SignupData) {
    const res = await apiClient.post<AuthResponse>('/auth/signup', data);
    saveSession(res.data);
  }

  function logout() {
    localStorage.removeItem('nexushr_token');
    localStorage.removeItem('nexushr_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}