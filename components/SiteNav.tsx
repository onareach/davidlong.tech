"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicNavItems = [
  { href: "/about", label: "About" },
  { href: "/philosophy", label: "Teaching Philosophy" },
  { href: "/implementation", label: "Teaching with Technology" },
] as const;

const studioNavItems = [
  { href: "/studio/today", label: "Today" },
  { href: "/studio/entries", label: "Entries" },
  { href: "/studio/branches", label: "Branches" },
  { href: "/studio/mysteries", label: "Mysteries" },
  { href: "/studio/abc", label: "ABCs of AI" },
  { href: "/studio/account", label: "Account" },
] as const;

function navLinkClass(isActive: boolean) {
  return isActive
    ? "font-medium text-foreground underline decoration-2 underline-offset-4"
    : "text-zinc-600 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100";
}

export function SiteNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <nav
      className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
      aria-label="Main navigation"
    >
      {!loading &&
        (user ? (
          <>
            {studioNavItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} className={navLinkClass(isActive)}>
                  {label}
                </Link>
              );
            })}
            {user?.is_admin && (
              <Link
                href="/studio/admin"
                className={navLinkClass(pathname === "/studio/admin")}
              >
                Admin
              </Link>
            )}
            <Link
              href="/sign-out"
              className={`${navLinkClass(false)} inline-flex items-center gap-1.5`}
            >
              Sign out
              <Image
                src="/logo-studio.png"
                alt=""
                width={84}
                height={84}
                className="h-[4.5rem] w-auto"
              />
            </Link>
          </>
        ) : (
          <>
            {publicNavItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} className={navLinkClass(isActive)}>
                  {label}
                </Link>
              );
            })}
            <Link
              href="/sign-in"
              className={`${navLinkClass(false)} inline-flex items-center gap-1.5`}
            >
              Sign in
              <Image
                src="/logo-studio.png"
                alt=""
                width={84}
                height={84}
                className="h-[4.5rem] w-auto"
              />
            </Link>
          </>
        ))}
    </nav>
  );
}
