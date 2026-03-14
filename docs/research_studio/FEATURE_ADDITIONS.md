# Feature Additions (Design Record)

This document records additions to Research Studio functionality and the reasons they were added. It supports design continuity and ties behavior to user needs.

**Related:** `00_RESEARCH_STUDIO_SPEC.md`, `ARCHITECTURE.md`, `FUNCTIONAL_SPEC_TESTS.md`, `TODAY_PAGE_BEHAVIOR.md`

---

## 1. Entries Page: Add Branch / Add Mystery

### What was added

- **UI:** Under the Branch and Mystery dropdowns in the entry editor, buttons **"Add branch"** and **"Add mystery"**. Each opens a dialog to enter the name (branch) or question (mystery) of the new item.
- **Backend:** `POST /api/branches` (body: `{ "name": "..." }`), `POST /api/mysteries` (body: `{ "question": "..." }`). Both derive a unique handle from the input (slugified); handle is stable for transfer between dev and prod where IDs differ.
- **Flow:** User selects an entry, clicks "Add branch" or "Add mystery", enters text, submits; the new item is created, the list refreshes, and the new item is selected in the dropdown.

### Why it was added

- Users need to create branches and mysteries from the entry workflow instead of leaving the page.
- Branches and mysteries have **text handles** in the schema (`research_branch_handle`, `research_mystery_handle`), so data can be synced or moved between environments even when numeric IDs differ.

---

## 2. Today Page: Replace Prompt

### What was added

- **UI:** Under "Today's prompt", a **"Replace prompt"** link that opens a dialog. User can choose another prompt from a list (from `GET /api/prompts`) or add a **custom prompt** (free text).
- **Backend:** `GET /api/prompts` (list), `POST /api/prompts` (create custom; body: `{ "text": "..." }`). Entry update already supported `research_prompt_id`; no backend change for PATCH.
- **Flow:** If there is a today entry, its `research_prompt_id` is updated to the chosen prompt so the database does not tie the writing to the wrong prompt.

### Why it was added

- When the user writes on a different topic than the prompt, the database should not record a misleading link between that prompt and the entry. Replacing the prompt corrects the association.

---

## 3. Today Page: Show the Prompt That Generated the Entry

### What was added

- **Backend:** `GET /api/entries/today` now returns both the today entry (when present) and the **prompt that generated it** (lookup by `research_prompt_id`). When there is no entry, it returns a random fallback prompt so the page always has a prompt to show.
- **Frontend:** Single load from `/api/entries/today`; when an entry exists, the displayed prompt is that entry’s prompt, not a new random one.

### Why it was added

- If a previous entry is displayed, the prompt shown should be the one that generated it, not a different random prompt. This keeps the UI consistent and avoids confusion.

---

## 4. Today Page: New Prompt Link

### What was added

- **UI:** A **"New prompt"** link next to the "Today" heading. Clicking it fetches a new random prompt (`GET /api/prompts/today`) and clears the editor (sets entry to null, draft to empty).
- **Flow:** The previous entry (if any) remains saved; the user can write on another topic and the next save creates a new entry with the new prompt.

### Why it was added

- Users should be able to write on more than one topic per day. "New prompt" starts a fresh session without losing the existing entry.

---

## 5. Today Page: Edit Prompt

### What was added

- **UI:** An **"Edit"** link under "Today's prompt" (next to "Replace prompt"). It opens a dialog with the current prompt text in a textarea; user can edit and save or cancel.
- **Backend:** `PATCH /api/prompts/<id>` (body: `{ "text": "..." }`). Updates the prompt’s text and returns the updated prompt.

### Why it was added

- Users need to tweak the wording of the current prompt without replacing it with a different prompt.

---

## Summary Table

| Feature | Location | Reason |
|--------|----------|--------|
| Add branch / Add mystery | Entries (entry editor) | Create branches and mysteries in context; handles support dev/prod portability. |
| Replace prompt | Today (under prompt box) | Avoid wrong prompt–entry links when writing on another topic. |
| Entry’s prompt displayed | Today (load behavior) | Show the prompt that generated the current entry. |
| New prompt | Today (next to heading) | Allow multiple topics per day without losing previous entry. |
| Edit prompt | Today (under prompt box) | Edit current prompt text without replacing it. |

---

## API Additions (Backend)

| Method | Path | Purpose |
|--------|------|--------|
| POST | /api/branches | Create branch; body `{ "name" }`; handle derived. |
| POST | /api/mysteries | Create mystery; body `{ "question" }`; handle derived. |
| GET | /api/prompts | List prompts (for replacement dialog). |
| POST | /api/prompts | Create custom prompt; body `{ "text" }`. |
| PATCH | /api/prompts/<id> | Update prompt text; body `{ "text" }`. |
| GET | /api/entries/today | Now returns `{ entry, prompt }`; prompt is entry’s prompt when entry exists, else random fallback. |

**PATCH /api/entries/<id>** already supported `research_prompt_id`; used when replacing the prompt for an existing today entry.
