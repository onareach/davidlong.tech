"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authFetch, setStoredToken, clearStoredToken } from "@/lib/authClient";

export type User = {
  id: number;
  email: string;
  display_name: string | null;
  is_admin: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
  updateProfile: (body: {
    email?: string;
    display_name?: string | null;
    new_password?: string;
    current_password?: string;
  }) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/** Tab-scoped flag cleared when the tab/window closes (unlike the auth cookie). Matches LinguaFormula. */
const SESSION_KEY = "davidlong_tech_auth_session";

function hasSessionStorageSession(): boolean {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem(SESSION_KEY);
}

function setSessionStorageSession() {
  if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
}

function clearSessionStorageSession() {
  if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      // sessionStorage is cleared when the tab/window is closed. If there's no sessionStorage key,
      // treat as "last tab was closed" and log out (clear cookie + JWT) so a new tab doesn't restore the session.
      if (!hasSessionStorageSession()) {
        clearStoredToken();
        setUser(null);
        await authFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        return;
      }
      const res = await authFetch("/api/auth/me");
      const data = await res.json().catch(() => ({}));
      const u = data.user;
      if (u) {
        setUser({
          id: u.id,
          email: u.email,
          display_name: u.display_name ?? null,
          is_admin: Boolean(u.is_admin),
        });
        setSessionStorageSession();
      } else {
        setUser(null);
        clearSessionStorageSession();
        clearStoredToken();
        await authFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      }
    } catch {
      setUser(null);
      clearSessionStorageSession();
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
    const u = data.user;
    if (u) {
      setUser({
        id: u.id,
        email: u.email,
        display_name: u.display_name ?? null,
        is_admin: Boolean(u.is_admin),
      });
      setSessionStorageSession();
    }
    return {};
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    let res: Response;
    try {
      res = await authFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          display_name: displayName?.trim() || undefined,
        }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { error: `Request failed: ${msg}. Is the backend reachable?` };
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: data?.error || `Registration failed (${res.status})` };
    }
    if (data.token) setStoredToken(data.token);
    const u = data.user;
    if (u) {
      setUser({
        id: u.id,
        email: u.email,
        display_name: u.display_name ?? null,
        is_admin: Boolean(u.is_admin),
      });
      setSessionStorageSession();
    }
    return {};
  }, []);

  const updateProfile = useCallback(
    async (body: {
      email?: string;
      display_name?: string | null;
      new_password?: string;
      current_password?: string;
    }) => {
      try {
        const res = await authFetch("/api/auth/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { error: data?.error || `Update failed (${res.status})` };
        }
        const u = data.user;
        if (u) {
          setUser({
            id: u.id,
            email: u.email,
            display_name: u.display_name ?? null,
            is_admin: Boolean(u.is_admin),
          });
        }
        return {};
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { error: msg };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    clearSessionStorageSession();
    clearStoredToken();
    setUser(null);
    try {
      await authFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Still signed out locally; backend cookie clear may have failed (e.g. network)
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refetch, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
