"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { authFetch } from "@/lib/authClient";

type Branch = { id: number; handle: string; name: string };
type Mystery = { id: number; handle: string; question: string };
type Entry = {
  id: number;
  research_prompt_id: number | null;
  title: string | null;
  raw_text: string;
  edited_text: string | null;
  summary: string | null;
  why_it_matters: string | null;
  research_branch_id: number | null;
  research_mystery_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const STATUS_OPTIONS = [
  "raw",
  "edited",
  "placed",
  "synthesis_candidate",
  "draft_public",
  "published",
];

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function EntryListItem({
  entry,
  branches,
  mysteries,
  isSelected,
  onSelect,
}: {
  entry: Entry;
  branches: Branch[];
  mysteries: Mystery[];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const branch = branches.find((b) => b.id === entry.research_branch_id);
  const mystery = mysteries.find((m) => m.id === entry.research_mystery_id);
  const missingBranch = !entry.research_branch_id;
  const missingMystery = !entry.research_mystery_id;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
        isSelected
          ? "border-zinc-400 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800"
          : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-foreground truncate flex-1">
          {entry.title || "Untitled"}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
          {formatDate(entry.created_at)}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
        {missingBranch && (
          <span className="text-amber-600 dark:text-amber-400" title="Branch not assigned">
            ⚠ Branch
          </span>
        )}
        {branch && <span>Branch: {branch.name}</span>}
        {missingMystery && (
          <span className="text-amber-600 dark:text-amber-400" title="Mystery not assigned">
            ⚠ Mystery
          </span>
        )}
        {mystery && <span>Mystery: {mystery.question}</span>}
      </div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Status: {entry.status}
      </div>
      {entry.summary && (
        <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {entry.summary}
        </p>
      )}
    </button>
  );
}

function EntriesPageInner() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [mysteries, setMysteries] = useState<Mystery[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState<string>("");
  const [filterMystery, setFilterMystery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const searchParams = useSearchParams();

  const loadEntries = useCallback(async () => {
    const res = await authFetch("/api/entries");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to load entries");
    }
    const data = await res.json();
    setEntries(data.entries || []);
    return data.entries;
  }, []);

  const loadBranches = useCallback(async () => {
    const res = await authFetch("/api/branches");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to load branches");
    }
    const data = await res.json();
    setBranches(data.branches || []);
    return data.branches;
  }, []);

  const loadMysteries = useCallback(async () => {
    const res = await authFetch("/api/mysteries");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to load mysteries");
    }
    const data = await res.json();
    setMysteries(data.mysteries || []);
    return data.mysteries;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        await Promise.all([loadEntries(), loadBranches(), loadMysteries()]);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadEntries, loadBranches, loadMysteries]);

  const idFromUrl = searchParams.get("id");
  useEffect(() => {
    if (idFromUrl) {
      const n = parseInt(idFromUrl, 10);
      if (!Number.isNaN(n)) setSelectedId(n);
    }
  }, [idFromUrl]);

  const filteredEntries = entries.filter((e) => {
    if (filterBranch && String(e.research_branch_id) !== filterBranch) return false;
    if (filterMystery && String(e.research_mystery_id) !== filterMystery) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    return true;
  });

  const selectedEntry = selectedId ? entries.find((e) => e.id === selectedId) : null;

  if (loading) {
    return (
      <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
        <PageHeader title="Entries" />
        <p className="text-zinc-600 dark:text-zinc-400">Loading entries…</p>
      </article>
    );
  }

  if (error) {
    return (
      <article className="space-y-5 text-zinc-700 dark:text-zinc-300">
        <PageHeader title="Entries" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 text-zinc-700 dark:text-zinc-300">
      <div className="-mb-4">
        <PageHeader title="Entries" />
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Filters
        </span>
        <label className="flex items-center gap-2 text-sm">
          Branch
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {branches.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          Mystery
          <select
            value={filterMystery}
            onChange={(e) => setFilterMystery(e.target.value)}
            className="rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 px-2 py-1 text-sm min-w-[180px]"
          >
            <option value="">All</option>
            {mysteries.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.question}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          Status
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Sort: Newest first
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <section
          className="lg:col-span-1 flex flex-col min-h-[320px]"
          aria-label="Entry list"
        >
          <h2 className="sr-only">Entry list</h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2">
            {filteredEntries.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 p-2">
                No entries yet. Write from the Today page.
              </p>
            ) : (
              filteredEntries.map((entry) => (
                <EntryListItem
                  key={entry.id}
                  entry={entry}
                  branches={branches}
                  mysteries={mysteries}
                  isSelected={selectedId === entry.id}
                  onSelect={() => setSelectedId(entry.id)}
                />
              ))
            )}
          </div>
        </section>

        <section
          className="lg:col-span-2 flex flex-col min-h-[320px] border border-zinc-200 dark:border-zinc-700 rounded-lg p-4"
          aria-label="Entry editor"
        >
          <h2 className="sr-only">Entry editor</h2>
          {selectedEntry ? (
            <EntryEditor
              entry={selectedEntry}
              branches={branches}
              mysteries={mysteries}
              onSave={loadEntries}
              onRefreshBranches={loadBranches}
              onRefreshMysteries={loadMysteries}
              setSaving={setSaving}
              setSaved={setSaved}
              setError={setError}
            />
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Select an entry from the list to view and edit.
            </p>
          )}
        </section>
      </div>

      {saving && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Saving…</p>
      )}
      {saved && (
        <p className="text-sm text-green-600 dark:text-green-400">Saved.</p>
      )}
    </article>
  );
}

export default function EntriesPage() {
  return (
    <Suspense fallback={
      <article className="space-y-5">
        <PageHeader title="Entries" />
        <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
      </article>
    }>
      <EntriesPageInner />
    </Suspense>
  );
}

function EntryEditor({
  entry,
  branches,
  mysteries,
  onSave,
  onRefreshBranches,
  onRefreshMysteries,
  setSaving,
  setSaved,
  setError,
}: {
  entry: Entry;
  branches: Branch[];
  mysteries: Mystery[];
  onSave: () => void;
  onRefreshBranches: () => Promise<void>;
  onRefreshMysteries: () => Promise<void>;
  setSaving: (v: boolean) => void;
  setSaved: (v: boolean) => void;
  setError: (v: string | null) => void;
}) {
  const [title, setTitle] = useState(entry.title ?? "");
  const [rawText, setRawText] = useState(entry.raw_text);
  const [editedText, setEditedText] = useState(entry.edited_text ?? "");
  const [summary, setSummary] = useState(entry.summary ?? "");
  const [whyItMatters, setWhyItMatters] = useState(entry.why_it_matters ?? "");
  const [branchId, setBranchId] = useState<string>(
    entry.research_branch_id ? String(entry.research_branch_id) : ""
  );
  const [mysteryId, setMysteryId] = useState<string>(
    entry.research_mystery_id ? String(entry.research_mystery_id) : ""
  );
  const [status, setStatus] = useState(entry.status);
  const [lightEditLoading, setLightEditLoading] = useState(false);
  const [lightEdited, setLightEdited] = useState(false);
  const [addBranchOpen, setAddBranchOpen] = useState(false);
  const [addBranchName, setAddBranchName] = useState("");
  const [addBranchLoading, setAddBranchLoading] = useState(false);
  const [addMysteryOpen, setAddMysteryOpen] = useState(false);
  const [addMysteryQuestion, setAddMysteryQuestion] = useState("");
  const [addMysteryLoading, setAddMysteryLoading] = useState(false);

  useEffect(() => {
    setTitle(entry.title ?? "");
    setRawText(entry.raw_text);
    setEditedText(entry.edited_text ?? "");
    setSummary(entry.summary ?? "");
    setWhyItMatters(entry.why_it_matters ?? "");
    setBranchId(entry.research_branch_id ? String(entry.research_branch_id) : "");
    setMysteryId(entry.research_mystery_id ? String(entry.research_mystery_id) : "");
    setStatus(entry.status);
  }, [entry.id, entry.title, entry.raw_text, entry.edited_text, entry.summary, entry.why_it_matters, entry.research_branch_id, entry.research_mystery_id, entry.status]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await authFetch(`/api/entries/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || null,
          raw_text: rawText,
          edited_text: editedText || null,
          summary: summary || null,
          why_it_matters: whyItMatters || null,
          research_branch_id: branchId ? Number(branchId) : null,
          research_mystery_id: mysteryId ? Number(mysteryId) : null,
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      setSaved(true);
      onSave();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleLightEdit = async () => {
    setLightEditLoading(true);
    setError(null);
    try {
      const res = await authFetch(`/api/entries/${entry.id}/light-edit`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "AI edit failed");
      setEditedText(data.entry?.edited_text ?? "");
      onSave();
      setLightEdited(true);
      setTimeout(() => setLightEdited(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI edit failed. Try again.");
    } finally {
      setLightEditLoading(false);
    }
  };

  const handleAddBranch = async () => {
    const name = addBranchName.trim();
    if (!name) return;
    setAddBranchLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to create branch");
      setBranchId(String(data.id));
      await onRefreshBranches();
      setAddBranchName("");
      setAddBranchOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create branch");
    } finally {
      setAddBranchLoading(false);
    }
  };

  const handleAddMystery = async () => {
    const question = addMysteryQuestion.trim();
    if (!question) return;
    setAddMysteryLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/mysteries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to create mystery");
      setMysteryId(String(data.id));
      await onRefreshMysteries();
      setAddMysteryQuestion("");
      setAddMysteryOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create mystery");
    } finally {
      setAddMysteryLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm";
  const labelClass = "block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300";

  return (
    <div className="space-y-4 overflow-y-auto">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded text-sm font-medium"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleLightEdit}
          disabled={lightEditLoading || !rawText.trim()}
          className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {lightEditLoading ? "Editing…" : "Edit for clarity"}
        </button>
        {lightEdited && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Edited.</span>
        )}
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Date: {formatDate(entry.created_at)}
        </span>
      </div>

      <div>
        <label htmlFor="entry-title" className={labelClass}>
          Title
        </label>
        <input
          id="entry-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Untitled"
        />
      </div>

      <div>
        <label htmlFor="entry-raw" className={labelClass}>
          Raw draft
        </label>
        <textarea
          id="entry-raw"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="entry-edited" className={labelClass}>
          Edited version
        </label>
        <textarea
          id="entry-edited"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="entry-summary" className={labelClass}>
          Summary
        </label>
        <textarea
          id="entry-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className={inputClass}
          placeholder="Short summary"
        />
      </div>

      <div>
        <label htmlFor="entry-why" className={labelClass}>
          Why it matters
        </label>
        <textarea
          id="entry-why"
          value={whyItMatters}
          onChange={(e) => setWhyItMatters(e.target.value)}
          rows={2}
          className={inputClass}
          placeholder="Why this idea matters"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-700">
        <div>
          <label htmlFor="entry-branch" className={labelClass}>
            Branch
          </label>
          <select
            id="entry-branch"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className={inputClass}
          >
            <option value="">—</option>
            {branches.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAddBranchOpen(true)}
            className="mt-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Add branch
          </button>
        </div>
        <div>
          <label htmlFor="entry-mystery" className={labelClass}>
            Mystery
          </label>
          <select
            id="entry-mystery"
            value={mysteryId}
            onChange={(e) => setMysteryId(e.target.value)}
            className={inputClass}
          >
            <option value="">—</option>
            {mysteries.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.question}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAddMysteryOpen(true)}
            className="mt-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Add mystery
          </button>
        </div>
        <div>
          <label htmlFor="entry-status" className={labelClass}>
            Status
          </label>
          <select
            id="entry-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {addBranchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="add-branch-title">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-900">
            <h2 id="add-branch-title" className="text-lg font-medium text-foreground">Add branch</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Enter the name of the new branch. A unique handle will be generated from it.</p>
            <input
              type="text"
              value={addBranchName}
              onChange={(e) => setAddBranchName(e.target.value)}
              placeholder="Branch name"
              className="mt-3 w-full rounded border border-zinc-300 px-3 py-2 text-foreground dark:border-zinc-600 dark:bg-zinc-800"
              onKeyDown={(e) => e.key === "Enter" && handleAddBranch()}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setAddBranchOpen(false); setAddBranchName(""); }}
                className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddBranch}
                disabled={addBranchLoading || !addBranchName.trim()}
                className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {addBranchLoading ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {addMysteryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="add-mystery-title">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-900">
            <h2 id="add-mystery-title" className="text-lg font-medium text-foreground">Add mystery</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Enter the question for the new mystery. A unique handle will be generated from it.</p>
            <input
              type="text"
              value={addMysteryQuestion}
              onChange={(e) => setAddMysteryQuestion(e.target.value)}
              placeholder="The question?"
              className="mt-3 w-full rounded border border-zinc-300 px-3 py-2 text-foreground dark:border-zinc-600 dark:bg-zinc-800"
              onKeyDown={(e) => e.key === "Enter" && handleAddMystery()}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setAddMysteryOpen(false); setAddMysteryQuestion(""); }}
                className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMystery}
                disabled={addMysteryLoading || !addMysteryQuestion.trim()}
                className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {addMysteryLoading ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
