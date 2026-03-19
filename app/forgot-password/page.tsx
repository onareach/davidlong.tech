"use client";

import { useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/authClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await authFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Request failed");
        return;
      }
      setMessage(data?.message || "Check your email for reset instructions.");
    } catch {
      setError("Request failed. Is the backend reachable?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Forgot password</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Enter your email address. If an account exists, we will send a reset link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {message && (
          <p className="text-sm text-green-700 dark:text-green-400" role="status">
            {message}
          </p>
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
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="mt-6 text-sm">
        <Link href="/sign-in" className="underline hover:no-underline text-zinc-600 dark:text-zinc-400">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
