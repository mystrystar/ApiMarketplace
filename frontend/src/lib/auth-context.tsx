"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { API_PATHS, ROUTES } from "@/constants";
import { apiRequest } from "./api-client";
import { clearAuth, getStoredUser, getToken, setAuth } from "./storage";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const data = await apiRequest<{ user: User }>(API_PATHS.me);
      setUser(data.user);
      setAuth(token, data.user);
    } catch {
      clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser<User>();
    if (stored) setUser(stored);
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiRequest<{ user: User; token: string }>(
        API_PATHS.login,
        { method: "POST", body: { email, password }, auth: false },
      );
      setAuth(data.token, data.user);
      setUser(data.user);
      router.push(data.user.role === "ADMIN" ? ROUTES.admin : ROUTES.marketplace);
    },
    [router],
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      const data = await apiRequest<{ user: User; token: string }>(
        API_PATHS.register,
        { method: "POST", body: { email, password, name }, auth: false },
      );
      setAuth(data.token, data.user);
      setUser(data.user);
      router.push(data.user.role === "ADMIN" ? ROUTES.admin : ROUTES.marketplace);
    },
    [router],
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.push(ROUTES.login);
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
