import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User } from "../types/auth";
import { authApi } from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  signup: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("mailflow_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem("mailflow_token");
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("mailflow_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const signup = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("mailflow_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadMe() {
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (isMounted) {
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        }
      } catch {
        if (isMounted) logout();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMe();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
