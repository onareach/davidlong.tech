# Backend: Parameters Sent to the AI

This document lists all parameters the backend sends to the AI (OpenAI Chat Completions API) for the "Edit for clarity" (light-edit) feature, what each setting controls, and what options are available.

---

## 1. OpenAI client initialization

### `api_key`

- **What it controls:** Authenticates your app with OpenAI so the API accepts the request. Not sent in the request body; used only when creating the client.
- **Options:** A valid OpenAI API key string (e.g. `sk-...`). No other values; invalid or missing keys result in 401 from the API.
- **In this app:** From environment variable `OPENAI_API_KEY`.

---

## 2. `client.chat.completions.create(...)` — request parameters

### `model`

- **What it controls:** Which OpenAI model runs the request. Different models differ in cost, speed, and capability (reasoning, instruction-following, languages).
- **Options (most commonly used):**
  - **`gpt-4o`** — Flagship multimodal model; strong for complex tasks.
  - **`gpt-4o-mini`** — Lighter, faster, cheaper; good for straightforward editing and simple tasks. **Used by this app by default.**
  - **`gpt-4-turbo`** — High capability, good for long context.
  - **`gpt-4`** — Previous generation GPT-4.
  - **`gpt-3.5-turbo`** — Cheapest and fastest; adequate for simple edits.
  - **`o1`** / **`o1-mini`** — Reasoning-oriented models (different pricing and behavior).
- **Full list:** [OpenAI model list](https://platform.openai.com/docs/models); names and availability change over time.
- **In this app:** From env `OPENAI_EDIT_MODEL`, fallback `"gpt-4o-mini"`.

---

### `messages`

- **What it controls:** The conversation passed to the model. The model responds based on this sequence of who said what.
- **Options:** An array of message objects. Each object has:
  - **`role`** (required) — See “Role” below.
  - **`content`** (required for non-tool messages) — See “Content” below.
- **In this app:** Exactly two messages: one system, one user.

---

## 3. Message object settings

### `role`

- **What it controls:** Who “speaks” in that message. The API uses role to apply the right rules (e.g. system = instructions, user = human input).
- **Options:**
  - **`system`** — Instructions, persona, or constraints for the whole conversation. Typically one at the start. Our app uses this for the editing instructions.
  - **`user`** — Human (or end-user) input. Our app uses this for the raw draft text.
  - **`assistant`** — Previous model replies. Used in multi-turn chats; we don’t send any here.
  - **`tool`** — Result of a tool/function call (used with function calling only; we don’t use it).
- **In this app:** First message `"system"`, second message `"user"`.

---

### `content`

- **What it controls:** The actual text (or media) in that message.
- **Options:**
  - **String** — Plain text. Our app uses strings for both system and user messages.
  - **Array of content parts** — For multimodal input (e.g. text + image blocks). Not used in this app.
- **In this app:**
  - System: fixed string `LIGHT_EDIT_SYSTEM_PROMPT` (see below).
  - User: the entry’s `research_entry_raw_text` from the database, trimmed.

**System prompt text used in this app:**

```
You are an editor. Improve clarity and flow without changing the author's voice. Output only the revised text, no commentary or meta-comment.
```

---

## 4. Parameters not set (API defaults)

These are not passed by our backend, so OpenAI’s defaults apply. You can add them in code or via config if you want to tune behavior.

### `temperature`

- **What it controls:** Randomness of the output. Higher = more varied and creative; lower = more deterministic and stable.
- **Options:** Number from **0** to **2**.
  - **0** — Deterministic; same input usually gives same output (good for editing, factuality).
  - **0.3–0.7** — Common for general tasks.
  - **1.0** — Default in many docs.
  - **> 1** — More creative/random.
- **Default (when omitted):** Model-dependent (often 1.0). For editing, 0 or low (e.g. 0.3) is often best.

---

### `max_tokens`

- **What it controls:** Maximum length of the model’s reply (in tokens). Prevents runaway long responses.
- **Options:** Positive integer. Depends on model (e.g. 128000 context models allow large `max_tokens`).
- **Default (when omitted):** Model-dependent; model may use a large cap. For editing, setting something like 4096 or 8192 is often enough.

---

### `top_p` (nucleus sampling)

- **What it controls:** Alternative to temperature: consider only the smallest set of tokens whose cumulative probability exceeds `top_p`. Can make output more focused.
- **Options:** Number from **0** to **1** (e.g. 0.9, 1.0).
- **Default (when omitted):** Usually 1.0. Most apps use `temperature` and leave `top_p` default.

---

### `frequency_penalty`

- **What it controls:** Discourages repeating the same phrases. Higher = more penalty for repetition.
- **Options:** Number from **-2** to **2**. Typical range **0** to **1** (e.g. 0.5 to reduce repetition).
- **Default (when omitted):** 0.

---

### `presence_penalty`

- **What it controls:** Encourages the model to mention new topics; penalizes tokens that have already appeared.
- **Options:** Number from **-2** to **2**. Often **0** or small positive.
- **Default (when omitted):** 0.

---

### `stream`

- **What it controls:** Whether the reply is streamed (chunks over time) or returned in one response body.
- **Options:** **`true`** (stream) or **`false`** (non-stream).
- **Default (when omitted):** `false`. Our app uses non-stream so we get one full edited text to save.

---

## 5. Summary

- **Sent to the API:** `model` plus `messages` (one system message with the editing instructions, one user message with the raw draft).
- **From environment:** `OPENAI_API_KEY` (client), `OPENAI_EDIT_MODEL` (model name).
- **From the database:** Only `research_entry_raw_text` for that entry. No title, summary, branch, mystery, or other fields are sent to the AI.

**Backend implementation:** `davidlong-tech-backend/app.py` — route `POST /api/entries/<id>/light-edit`, and constants `LIGHT_EDIT_SYSTEM_PROMPT`, `OPENAI_EDIT_MODEL`, `OPENAI_API_KEY`.

---

## ABCs of AI playground

The **ABCs of AI** page (`/studio/abc`) uses a separate endpoint: **`POST /api/abc`**. That route does **not** use `OPENAI_EDIT_MODEL` from the environment. The client sends `model` (and other parameters) in the request body, and the backend uses those values. So you do **not** need to remove the model setting from `.env` or Heroku for the playground: the selected model is used because it is passed in the request. The env var `OPENAI_EDIT_MODEL` remains for the "Edit for clarity" (light-edit) feature only.
