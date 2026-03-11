"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function StudioPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = `/sign-in?from=${encodeURIComponent("/studio/today")}`;
      } else {
        router.replace("/studio/today");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="max-w-md mx-auto text-zinc-600 dark:text-zinc-400">
      Loading…
    </div>
  );
}
