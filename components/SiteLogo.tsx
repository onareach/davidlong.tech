"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function SiteLogo() {
  const { user, loading } = useAuth();
  const href = !loading && user ? "/studio/today" : "/about";

  return (
    <Link
      href={href}
      className="text-lg font-semibold text-foreground no-underline"
    >
      davidlong.tech
    </Link>
  );
}
