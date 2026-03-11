"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authFetch, setStoredToken, clearStoredToken } from "@/lib/authClient";

export type User = { id: number; email: string; display_name: string | null };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await authFetch("/api/auth/me");
      const data = await res.json().catch(() => ({}));
      setUser(data.user || null);
      if (!data.user) {
        clearStoredToken();
      }
    } catch {
      setUser(null);
      clearStoredToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const login = useCallback(async (email: string, password: string) => {
    let res: Response;
    try {
      res = await authFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { error: `Request failed: ${msg}. Is the backend reachable?` };
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error || `Sign in failed (${res.status})`;
      return { error: msg };
    }
    if (data.token) setStoredToken(data.token);
    setUser(data.user);
    return {};
  }, []);

  const logout = useCallback(async () => {
    clearStoredToken();
    await authFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
