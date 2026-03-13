"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { authFetch } from "@/lib/authClient";
import { formatInlineMarkdown } from "@/lib/formatInlineMarkdown";

type Prompt = { id: number; text: string; is_fallback: boolean };
type Entry = {
  id: number;
  research_prompt_id: number | null;
  raw_text: string;
  edited_text: string | null;
  title: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const AUTOSAVE_DELAY_MS = 1500;

export default function TodayPage() {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrompt = useCallback(async () => {
    const res = await authFetch("/api/prompts/today");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to load prompt");
    }
    const data = await res.json();
    setPrompt(data.prompt);
    return data.prompt;
  }, []);

  const loadTodayEntry = useCallback(async () => {
    const res = await authFetch("/api/entries/today");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Failed to load today's entry (${res.status})`);
    }
    const data = await res.json();
    setEntry(data.entry);
    if (data.entry) {
      setDraft(data.entry.raw_text);
    }
    return data.entry;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        await Promise.all([loadPrompt(), loadTodayEntry()]);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadPrompt, loadTodayEntry]);

  const saveDraft = useCallback(
    async (text: string, showSaved = false) => {
      if (!prompt) return;
      setSaving(true);
      setError(null);
      try {
        if (entry) {
          const res = await authFetch(`/api/entries/${entry.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ raw_text: text }),
          });
          if (!res.ok) throw new Error("Failed to save");
          const data = await res.json();
          setEntry(data.entry);
        } else {
          const res = await authFetch("/api/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              raw_text: text,
              research_prompt_id: prompt.id,
            }),
          });
          if (!res.ok) throw new Error("Failed to create entry");
          const data = await res.json();
          setEntry(data.entry);
        }
        if (showSaved) {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      } finally {
        setSaving(false);
      }
    },
    [prompt, entry]
  );

  const handleSave = useCallback(() => {
    if (draft.trim() === "") return;
    saveDraft(draft, true);
  }, [draft, saveDraft]);

  useEffect(() => {
    if (loading || draft.trim() === "" || draft === (entry?.raw_text ?? "")) return;
    const t = setTimeout(() => saveDraft(draft), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [draft, loading, entry?.raw_text, saveDraft]);

  if (loading) {
    return (
      <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
        <PageHeader title="Today" />
        <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
      </article>
    );
  }

  return (
    <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
      <PageHeader title="Today" />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {prompt && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Today&apos;s prompt
          </p>
          <p className="mt-1 text-zinc-800 dark:text-zinc-200">{prompt.text}</p>
        </div>
      )}
      <div>
        <label htmlFor="today-editor" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          Your writing
        </label>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
          Use <strong>**bold**</strong> and <em>*italic*</em> for formatting.
        </p>
        <textarea
          id="today-editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Start writing…"
          rows={12}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        {draft.trim() !== "" && (
          <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Preview</p>
            <div className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {formatInlineMarkdown(draft, "today-preview")}
            </div>
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{draft.split(/\s+/).filter(Boolean).length} words</span>
          {saving && <span>Saving…</span>}
          {saved && <span className="text-green-600 dark:text-green-400 font-medium">Saved.</span>}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || draft.trim() === ""}
              className="px-4 py-2 rounded bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Save
            </button>
            {entry && (
              <Link
                href={`/studio/entries?id=${entry.id}`}
                className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Review and classify entry
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
