"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get("from")?.startsWith("/") ? searchParams.get("from")! : "/studio/today";

  useEffect(() => {
    if (user) {
      window.location.replace(from);
    }
  }, [user, from]);

  if (user) {
    return (
      <div className="max-w-md mx-auto text-zinc-600 dark:text-zinc-400">
        Redirecting…
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { error: err } = await login(email, password);
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
    <div className="flex flex-col min-h-[calc(50vh+4rem)]">
      <div className="flex flex-row gap-8 items-start max-w-4xl mx-auto w-full">
        <div className="shrink-0 hidden sm:block">
          <Image
            src="/logo-studio.png"
            alt="Quality Research Studio"
            width={320}
            height={320}
            className="h-48 w-auto"
          />
        </div>
        <div className="min-w-0 flex-1 max-w-md">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            The Institute of Quality Science studies symbolic and semantic intelligence and explores how the concept of Quality sheds light on scientific and social fields.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Quality Research Studio is a research application used to record, refine, and publish insights related to Quality.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Access is currently limited to participating researchers. If you are interested in access, please contact support@linguaformula.com.
          </p>
          <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
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
                  autoComplete="current-password"
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
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded disabled:opacity-50"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/about" className="underline hover:no-underline">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto">Loading…</div>}>
      <SignInForm />
    </Suspense>
  );
}
