"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = `/sign-in?from=${encodeURIComponent(
        pathname || "/studio/today"
      )}`;
    }
  }, [user, loading, pathname]);

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

  return <div className="w-full">{children}</div>;
}
