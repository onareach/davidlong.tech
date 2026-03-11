"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignOutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout().then(() => router.replace("/"));
  }, [logout, router]);

  return (
    <div className="max-w-md mx-auto text-zinc-600 dark:text-zinc-400">
      Signing out…
    </div>
  );
}
