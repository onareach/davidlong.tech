"use client";

import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/SiteLogo";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Narrow content (~25% margins) for public reading pages; wide for studio
  const narrow = !pathname?.startsWith("/studio");
  const maxClass = narrow ? "max-w-3xl" : "max-w-6xl";
  const pxClass = narrow ? "px-4" : "px-3";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div
          className={`mx-auto flex ${maxClass} flex-col gap-4 ${pxClass} py-6 sm:flex-row sm:items-center sm:justify-between`}
        >
          <SiteLogo />
          <SiteNav />
        </div>
      </header>
      <main className={`mx-auto w-full ${maxClass} flex-1 ${pxClass} py-8`}>
        {children}
      </main>
      <Footer contentWidthClass={maxClass} paddingClass={pxClass} />
    </div>
  );
}
