"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authFetch } from "@/lib/authClient";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing reset token. Open the link from your email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Reset failed");
        return;
      }
      setDone(true);
    } catch {
      setError("Request failed. Is the backend reachable?");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          This page needs a valid <code className="text-xs">token</code> in the URL. Request a new
          link from{" "}
          <Link href="/forgot-password" className="underline">
            forgot password
          </Link>
          .
        </p>
        <Link href="/sign-in" className="text-sm underline text-zinc-600 dark:text-zinc-400">
          Sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Password updated</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          You can sign in with your new password.
        </p>
        <Link
          href="/sign-in"
          className="inline-block py-2 px-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Set new password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
          />
        </div>
        <div>
          <label htmlFor="password2" className="block text-sm font-medium mb-1">
            Confirm password
          </label>
          <input
            id="password2"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
