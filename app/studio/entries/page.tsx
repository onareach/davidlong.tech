import { PageHeader } from "@/components/PageHeader";

export default function EntriesPage() {
  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="Entries" />
      <p className="text-zinc-600 dark:text-zinc-400">
        Browse and manage your research entries. Coming soon.
      </p>
    </article>
  );
}
