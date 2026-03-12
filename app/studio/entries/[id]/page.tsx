"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * MVP route /studio/entries/[id]: redirect to list with ?id= so the
 * main Entries page can open that entry in the editor.
 */
export default function EntryByIdPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (id) router.replace(`/studio/entries?id=${encodeURIComponent(id)}`);
  }, [id, router]);

  return (
    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
      Opening entry…
    </p>
  );
}
