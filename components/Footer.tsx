type FooterProps = {
  contentWidthClass?: string;
  paddingClass?: string;
};

export function Footer({
  contentWidthClass = "max-w-6xl",
  paddingClass = "px-3",
}: FooterProps) {
  return (
    <footer className="mt-16 border-t border-zinc-200 py-6 dark:border-zinc-700">
      <div
        className={`mx-auto ${contentWidthClass} ${paddingClass} text-center text-sm text-zinc-500 dark:text-zinc-400`}
      >
        <p>davidlong.tech — Professional portfolio</p>
      </div>
    </footer>
  );
}
