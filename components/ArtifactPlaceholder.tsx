type ArtifactPlaceholderProps = {
  label: string;
};

export function ArtifactPlaceholder({ label }: ArtifactPlaceholderProps) {
  return (
    <div className="my-6 rounded-lg border border-zinc-300 bg-zinc-50 px-6 py-8 text-center dark:border-zinc-600 dark:bg-zinc-800/50">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
        Screenshot or video placeholder
      </p>
    </div>
  );
}
