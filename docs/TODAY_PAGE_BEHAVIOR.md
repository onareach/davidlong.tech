# Today page: what controls “new prompt + blank” vs “last thing written”

## Short answer

- **Blank writing field** → Either (1) the backend found **no entry for “today”** (UTC), or (2) you clicked **“New prompt”** to start a fresh session. You see a random prompt and an empty draft.
- **Last thing written + matching prompt** → The backend found **one entry for “today”** (UTC). That entry’s **own prompt** (the one that generated it) is shown, and its `raw_text` is loaded into the draft.
- **“New prompt”** (link next to the Today heading) → Fetches a new random prompt and clears the editor so you can write on another topic; the previous entry stays saved and appears under Entries.

---

## 1. What controls the **writing field** (blank vs filled)

**Backend:** `GET /api/entries/today`  
(`davidlong-tech-backend/app.py`)

- Selects the **most recent entry** for the current user where the **date of the entry (in UTC)** equals **current date in UTC**:
  - `DATE(research_entries_timestamp AT TIME ZONE 'UTC') = CURRENT_DATE`
- Returns either `{ "entry": null }` or `{ "entry": { ... } }` with that row.

**Frontend:** `app/studio/today/page.tsx`

- On load it calls `loadTodayEntry()`, which calls `GET /api/entries/today`.
- If `data.entry` is **null** → `setEntry(null)` and **draft is never set** → it stays the initial `""` → **blank field**.
- If `data.entry` is set → `setDraft(data.entry.raw_text)` → **you see the last thing written** (for that “today” entry).

So: **the writing field is blank when there is no entry for today (UTC); it’s filled when there is such an entry.**

---

## 2. What controls the **prompt** (which prompt you see)

**Backend:** `GET /api/entries/today` (single source of truth for the Today page)

- When **an entry for today exists**: the response includes that entry **and** the **prompt that generated it** (lookup by `research_prompt_id`). So the prompt shown is the entry’s actual prompt.
- When **no entry for today exists**: the response includes `entry: null` and a **random fallback prompt** so the user can start writing. So you see a new random prompt and a blank field.

**Backend:** `GET /api/prompts/today`

- Still used when the user clicks **“New prompt”**: returns a new random fallback prompt. The frontend then sets that as the current prompt, clears the current entry and draft, so the user can write on another topic (the previous entry remains saved).

**Frontend**

- On load it calls **only** `GET /api/entries/today`. It sets `entry`, `prompt`, and `draft` from that response. So when a today entry exists, the prompt shown is always that entry’s prompt.
- **“New prompt”** (link next to the Today heading) calls `GET /api/prompts/today`, then sets the new prompt, `entry = null`, and `draft = ""`.

---

## 3. “Today” = UTC date

“Today” is defined as **the current date in UTC**, not your local timezone.

- After **UTC midnight**, a new “today” starts: no entry for that new date yet → blank field + new random prompt (until you save).
- Before **UTC midnight**, you still have “today’s” entry → you see last thing written.
- So in US timezones, “today” can flip in the afternoon/evening (e.g. 4–8 PM PST), which can feel like the page “sometimes has a new prompt and blank, sometimes the last thing written.”

---

## 4. “New prompt” link

The **“New prompt”** link next to the Today heading lets the user start a **new session** with a new random prompt and a blank editor, so they can write on more than one topic in a day. The previous entry (if any) is not deleted; it remains in the database and appears in the Entries list.
