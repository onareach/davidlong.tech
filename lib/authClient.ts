/**
 * Auth client for davidlong.tech / Research Studio.
 * Stores JWT for Authorization header; supports cookie or Bearer.
 */

const JWT_STORAGE_KEY = "davidlong_tech_jwt";

function getApiBase(): string {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_API_URL || "";
  const origin = window.location.origin;
  // Use same-origin (rewrites proxy to Heroku) for: production, Vercel previews, localhost
  if (origin === "https://davidlong.tech" || origin === "https://www.davidlong.tech") return "";
  if (origin.includes("davidlong.tech") || origin.includes("vercel.app")) return "";
  if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) return "";
  return process.env.NEXT_PUBLIC_API_URL || "";
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(JWT_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") sessionStorage.setItem(JWT_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window !== "undefined") sessionStorage.removeItem(JWT_STORAGE_KEY);
}

export function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const base = getApiBase();
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
}
