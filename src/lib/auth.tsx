import { createContext, useContext, useState, type ReactNode } from 'react';

export type AccessLevel = 1 | 2 | 3;

export interface User {
  email: string;
  name: string;
  level: AccessLevel;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasAccess: (minLevel: AccessLevel) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users
const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@abran.system',
    password: 'Admin@1404',
    user: { email: 'admin@abran.system', name: 'مدیر کل', level: 1 },
  },
  {
    email: 'manager@abran.system',
    password: 'Manager@1404',
    user: { email: 'manager@abran.system', name: 'مدیر عملیات', level: 2 },
  },
  {
    email: 'viewer@abran.system',
    password: 'Viewer@1404',
    user: { email: 'viewer@abran.system', name: 'مشاهده‌گر', level: 3 },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('abran.user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): boolean => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found.user);
      localStorage.setItem('abran.user', JSON.stringify(found.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('abran.user');
  };

  const hasAccess = (minLevel: AccessLevel): boolean => {
    if (!user) return false;
    return user.level <= minLevel;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
