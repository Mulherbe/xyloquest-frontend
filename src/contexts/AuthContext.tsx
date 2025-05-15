import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/axios'; // utilise ton instance configurée

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const res = await api.post('/login', { email, password }); // plus d'URL en dur
      localStorage.setItem('token', res.data.token); // ✅ stocke le token

    setUser(res.data.user);
  };
  
const logout = () => {
  api.post('/logout');
  localStorage.removeItem('token'); // ✅ on nettoie
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
