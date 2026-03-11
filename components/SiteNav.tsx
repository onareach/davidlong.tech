"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/philosophy", label: "Teaching Philosophy" },
  { href: "/implementation", label: "Teaching with Technology Example" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <nav
      className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
      aria-label="Main navigation"
    >
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? "font-medium text-foreground underline decoration-2 underline-offset-4"
                : "text-zinc-600 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100"
            }
          >
            {label}
          </Link>
        );
      })}
      {!loading && (
        user ? (
          <>
            <Link
              href="/studio"
              className={
                pathname?.startsWith("/studio")
                  ? "font-medium text-foreground underline decoration-2 underline-offset-4"
                  : "text-zinc-600 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100"
              }
            >
              Studio
            </Link>
            <Link
              href="/sign-out"
              className="text-zinc-600 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Sign out
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="text-zinc-600 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Sign in
          </Link>
        )
      )}
    </nav>
  );
}
