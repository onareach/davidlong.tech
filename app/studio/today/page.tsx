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
  const [replacePromptOpen, setReplacePromptOpen] = useState(false);
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [replacePromptLoading, setReplacePromptLoading] = useState(false);
  const [customPromptText, setCustomPromptText] = useState("");
  const [customPromptLoading, setCustomPromptLoading] = useState(false);
  const [editPromptOpen, setEditPromptOpen] = useState(false);
  const [editPromptText, setEditPromptText] = useState("");
  const [editPromptLoading, setEditPromptLoading] = useState(false);

  const loadToday = useCallback(async () => {
    const res = await authFetch("/api/entries/today");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Failed to load today (${res.status})`);
    }
    const data = await res.json();
    setEntry(data.entry);
    setPrompt(data.prompt ?? null);
    setDraft(data.entry ? data.entry.raw_text : "");
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        await loadToday();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadToday]);

  const handleNewPrompt = useCallback(async () => {
    setError(null);
    try {
      const res = await authFetch("/api/prompts/today");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load new prompt");
      }
      const data = await res.json();
      setPrompt(data.prompt);
      setEntry(null);
      setDraft("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load new prompt");
    }
  }, []);

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

  const openReplacePrompt = useCallback(async () => {
    setReplacePromptOpen(true);
    setError(null);
    try {
      const res = await authFetch("/api/prompts");
      if (!res.ok) throw new Error("Failed to load prompts");
      const data = await res.json();
      setPromptList(data.prompts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load prompts");
    }
  }, []);

  const usePrompt = useCallback(
    async (newPrompt: Prompt) => {
      setReplacePromptLoading(true);
      setError(null);
      try {
        if (entry) {
          const res = await authFetch(`/api/entries/${entry.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ research_prompt_id: newPrompt.id }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to update entry");
          }
          const data = await res.json();
          setEntry(data.entry);
        }
        setPrompt(newPrompt);
        setReplacePromptOpen(false);
        setCustomPromptText("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to replace prompt");
      } finally {
        setReplacePromptLoading(false);
      }
    },
    [entry]
  );

  const openEditPrompt = useCallback(() => {
    if (prompt) {
      setEditPromptText(prompt.text);
      setEditPromptOpen(true);
    }
  }, [prompt]);

  const handleSaveEditPrompt = useCallback(async () => {
    if (!prompt || !editPromptText.trim()) return;
    setEditPromptLoading(true);
    setError(null);
    try {
      const res = await authFetch(`/api/prompts/${prompt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editPromptText.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update prompt");
      setPrompt({ id: data.id, text: data.text, is_fallback: data.is_fallback ?? false });
      setEditPromptOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update prompt");
    } finally {
      setEditPromptLoading(false);
    }
  }, [prompt, editPromptText]);

  const handleCustomPrompt = useCallback(async () => {
    const text = customPromptText.trim();
    if (!text) return;
    setCustomPromptLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to create prompt");
      const newPrompt: Prompt = { id: data.id, text: data.text, is_fallback: data.is_fallback ?? false };
      await usePrompt(newPrompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create prompt");
    } finally {
      setCustomPromptLoading(false);
    }
  }, [customPromptText, usePrompt]);

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
      <div className="mb-6 flex flex-nowrap items-baseline gap-3 [&>header]:mb-0">
        <PageHeader title="Today" />
        <button
          type="button"
          onClick={handleNewPrompt}
          className="shrink-0 text-sm text-zinc-600 hover:text-zinc-900 underline dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          New prompt
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {prompt && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Today&apos;s prompt
          </p>
          <p className="mt-1 text-zinc-800 dark:text-zinc-200">{prompt.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              onClick={openReplacePrompt}
              className="text-sm text-zinc-600 hover:text-zinc-900 underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Replace prompt
            </button>
            <button
              type="button"
              onClick={openEditPrompt}
              className="text-sm text-zinc-600 hover:text-zinc-900 underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {replacePromptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="replace-prompt-title"
        >
          <div className="mx-4 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-900">
            <h2 id="replace-prompt-title" className="text-lg font-medium text-foreground">
              Replace prompt
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Choose a different prompt so this writing isn’t linked to the wrong one.
            </p>
            <div className="mt-3 space-y-2">
              {promptList.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => usePrompt(p)}
                  disabled={replacePromptLoading}
                  className="w-full rounded border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {p.text}
                </button>
              ))}
            </div>
            <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-700">
              <label htmlFor="custom-prompt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Or add a custom prompt
              </label>
              <input
                id="custom-prompt"
                type="text"
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
                placeholder="e.g. Freewrite on teaching"
                className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-foreground dark:border-zinc-600 dark:bg-zinc-800"
                onKeyDown={(e) => e.key === "Enter" && handleCustomPrompt()}
              />
              <button
                type="button"
                onClick={handleCustomPrompt}
                disabled={customPromptLoading || !customPromptText.trim()}
                className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {customPromptLoading ? "Adding…" : "Add and use this prompt"}
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setReplacePromptOpen(false);
                  setCustomPromptText("");
                }}
                className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editPromptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-prompt-title"
        >
          <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-900">
            <h2 id="edit-prompt-title" className="text-lg font-medium text-foreground">
              Edit prompt
            </h2>
            <textarea
              value={editPromptText}
              onChange={(e) => setEditPromptText(e.target.value)}
              rows={4}
              className="mt-3 w-full rounded border border-zinc-300 px-3 py-2 text-foreground dark:border-zinc-600 dark:bg-zinc-800"
              placeholder="Prompt text"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditPromptOpen(false);
                }}
                className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditPrompt}
                disabled={editPromptLoading || !editPromptText.trim()}
                className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {editPromptLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
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
