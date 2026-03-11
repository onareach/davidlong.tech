"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function StudioPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = `/sign-in?from=${encodeURIComponent("/studio")}`;
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto text-zinc-600 dark:text-zinc-400">
        Loading…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Research Studio</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Signed in as {user.email}{" "}
        <Link href="/sign-out" className="underline hover:no-underline">
          (sign out)
        </Link>
      </p>
      <div className="space-y-2 text-sm">
        <p>
          <Link href="/studio/today" className="underline hover:no-underline">
            Today
          </Link>
        </p>
        <p>
          <Link href="/studio/entries" className="underline hover:no-underline">
            Entries
          </Link>
        </p>
        <p>
          <Link href="/studio/branches" className="underline hover:no-underline">
            Branches
          </Link>
        </p>
        <p>
          <Link href="/studio/mysteries" className="underline hover:no-underline">
            Mysteries
          </Link>
        </p>
      </div>
      <p className="mt-8 text-zinc-500 dark:text-zinc-500 text-sm">
        Coming soon: writing workspace, prompts, AI reflection.
      </p>
    </div>
  );
}
