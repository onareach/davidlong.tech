"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, user } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get("from")?.startsWith("/") ? searchParams.get("from")! : "/studio/today";

  useEffect(() => {
    if (user) {
      window.location.replace(from);
    }
  }, [user, from]);

  if (user) {
    return (
      <div className="max-w-md mx-auto text-zinc-600 dark:text-zinc-400">Redirecting…</div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { error: err } = await register(email, password, displayName || undefined);
      if (err) {
        setError(err);
        return;
      }
      window.location.href = from;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(50vh+4rem)] max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-1">
            Display name <span className="text-zinc-500 font-normal">(optional)</span>
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-3 py-2 pr-11 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? (
                <img src="/icons/eye-open.svg" alt="" className="w-5 h-5" />
              ) : (
                <img src="/icons/eye-close.svg" alt="" className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">At least 8 characters.</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Register"}
        </button>
      </form>
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline hover:no-underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
