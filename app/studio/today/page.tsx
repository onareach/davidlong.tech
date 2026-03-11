import { PageHeader } from "@/components/PageHeader";

export default function TodayPage() {
  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="Today" />
      <p className="text-zinc-600 dark:text-zinc-400">
        Today&apos;s workspace. Coming soon: writing prompts, AI reflection, and
        entry creation.
      </p>
    </article>
  );
}
