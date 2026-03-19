"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { authFetch } from "@/lib/authClient";
import { formatInlineMarkdown } from "@/lib/formatInlineMarkdown";
import { useAuth } from "@/context/AuthContext";

const MODELS = [
  { value: "gpt-4o-mini", label: "gpt-4o-mini (default)" },
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "gpt-4-turbo", label: "gpt-4-turbo" },
  { value: "gpt-4", label: "gpt-4" },
  { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
  { value: "o1-mini", label: "o1-mini" },
  { value: "o1", label: "o1" },
];

const TEMPERATURE_OPTIONS = [
  { value: "default", label: "Default (1.0)", send: 1.0 },
  { value: "0", label: "0", send: 0 },
  { value: "0.3", label: "0.3", send: 0.3 },
  { value: "0.5", label: "0.5", send: 0.5 },
  { value: "0.7", label: "0.7", send: 0.7 },
  { value: "1.0", label: "1.0", send: 1.0 },
  { value: "1.5", label: "1.5", send: 1.5 },
  { value: "2", label: "2", send: 2 },
];

const MAX_TOKENS_OPTIONS = [
  { value: "default", label: "Default (4096)", send: 4096 },
  { value: "256", label: "256", send: 256 },
  { value: "512", label: "512", send: 512 },
  { value: "1024", label: "1024", send: 1024 },
  { value: "2048", label: "2048", send: 2048 },
  { value: "4096", label: "4096", send: 4096 },
  { value: "8192", label: "8192", send: 8192 },
];

const TOP_P_OPTIONS = [
  { value: "default", label: "Default (1.0)", send: 1.0 },
  { value: "0.1", label: "0.1", send: 0.1 },
  { value: "0.5", label: "0.5", send: 0.5 },
  { value: "0.9", label: "0.9", send: 0.9 },
  { value: "1.0", label: "1.0", send: 1.0 },
];

const PENALTY_OPTIONS = [
  { value: "default", label: "Default (0)", send: 0 },
  { value: "0", label: "0", send: 0 },
  { value: "0.3", label: "0.3", send: 0.3 },
  { value: "0.5", label: "0.5", send: 0.5 },
  { value: "0.7", label: "0.7", send: 0.7 },
  { value: "1.0", label: "1.0", send: 1.0 },
];

const STREAM_OPTIONS = [
  { value: "false", label: "false (default)", send: false },
  { value: "true", label: "true (not supported in this UI)", send: true },
];

/** Personas feed into the system message (role). Each sets how the model responds. */
const PERSONAS = [
  { value: "", label: "None", systemPrompt: "" },
  {
    value: "editor",
    label: "Editor",
    systemPrompt:
      "You are an editor. Improve clarity and flow without changing the author's voice. When asked to edit, output only the revised text with no commentary.",
  },
  {
    value: "linguistics_expert",
    label: "Linguistics expert",
    systemPrompt:
      "You are a linguistics expert. Analyze language, grammar, structure, and usage with precision. Explain terminology, variants, and conventions clearly.",
  },
  {
    value: "expert_software_developer",
    label: "Expert software developer",
    systemPrompt:
      "You are an expert software developer. Focus on code quality, architecture, best practices, and clear technical explanation. Prefer concrete examples and idiomatic solutions.",
  },
  {
    value: "historian",
    label: "Historian",
    systemPrompt:
      "You are a historian. Emphasize context, sources, and narrative accuracy. Flag uncertainty and anachronisms; distinguish evidence from interpretation.",
  },
  {
    value: "science_communicator",
    label: "Science communicator",
    systemPrompt:
      "You are a science communicator. Explain complex ideas in accessible language. Use analogies and clear structure; avoid unnecessary jargon.",
  },
  {
    value: "teacher",
    label: "Teacher",
    systemPrompt:
      "You are a supportive teacher. Be pedagogical and step-by-step. Check understanding, invite questions, and suggest follow-up practice where useful.",
  },
  {
    value: "critical_reviewer",
    label: "Critical reviewer",
    systemPrompt:
      "You are a constructive critical reviewer. Identify strengths and weaknesses clearly. Offer specific, actionable improvements and alternative angles.",
  },
  {
    value: "storyteller",
    label: "Storyteller",
    systemPrompt:
      "You are a storyteller. Focus on narrative, engagement, pacing, and vivid detail. Shape content so it holds attention and lands with impact.",
  },
  {
    value: "diplomat",
    label: "Diplomat",
    systemPrompt:
      "You are a diplomat. Be balanced, neutral, and careful with wording. Acknowledge different views; avoid provocation or one-sided framing.",
  },
  {
    value: "data_analyst",
    label: "Data analyst",
    systemPrompt:
      "You are a data analyst. Lead with evidence and numbers. Use clear logical structure and state conclusions and caveats explicitly.",
  },
];

function SettingRow({
  title,
  explanation,
  dropdown,
  valueBox,
}: {
  title: string;
  explanation: string;
  dropdown: React.ReactNode;
  valueBox: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="font-medium text-foreground">{title}</div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{explanation}</p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[140px]">{dropdown}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Value used:</span>
          <span className="rounded border border-zinc-300 bg-zinc-50 px-2 py-1 text-sm font-mono text-foreground dark:border-zinc-600 dark:bg-zinc-800">
            {valueBox}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AbcPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [persona, setPersona] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [temperature, setTemperature] = useState(1.0);
  const [temperatureSelect, setTemperatureSelect] = useState("default");
  const [maxTokens, setMaxTokens] = useState(4096);
  const [maxTokensSelect, setMaxTokensSelect] = useState("default");
  const [topP, setTopP] = useState(1.0);
  const [topPSelect, setTopPSelect] = useState("default");
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [frequencyPenaltySelect, setFrequencyPenaltySelect] = useState("default");
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [presencePenaltySelect, setPresencePenaltySelect] = useState("default");
  const [stream, setStream] = useState(false);
  const [streamSelect, setStreamSelect] = useState("false");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const temperatureOptions = user
    ? TEMPERATURE_OPTIONS
    : TEMPERATURE_OPTIONS.filter((o) => o.value !== "2");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    if (!prompt.trim()) {
      setError("Enter a prompt.");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/api/abc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          system: PERSONAS.find((p) => p.value === persona)?.systemPrompt ?? "",
          model,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty,
          stream,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`);
        return;
      }
      setResponse(data.content ?? "");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      const isNetworkError =
        msg === "Failed to fetch" ||
        msg.toLowerCase().includes("network") ||
        msg.toLowerCase().includes("load failed");
      setError(
        isNetworkError
          ? "Network error: the request didn’t reach the server. If you’re on localhost, ensure the backend is running (e.g. on port 5000) and that NEXT_PUBLIC_API_URL in .env.local points to it, or remove it to use the proxied backend."
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title="The ABCs of AI" />
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Enter a prompt and choose model and parameters. The value used is shown next to each dropdown; it only changes when you select a different option. The selected model and settings are sent with each request (they are not read from server env).
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="mb-1 block font-medium text-foreground">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-foreground placeholder-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:placeholder-zinc-500"
            placeholder="Ask the model anything…"
          />
        </div>

        <div className="space-y-6 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
          <SettingRow
            title="Persona (role)"
            explanation="System role the model adopts before answering. Sent as a system message; shapes tone, expertise, and style."
            dropdown={
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {PERSONAS.map((p) => (
                  <option key={p.value || "none"} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            }
            valueBox={PERSONAS.find((p) => p.value === persona)?.label ?? "None"}
          />

          <SettingRow
            title="Model"
            explanation="Which OpenAI model runs the request. Affects cost, speed, and capability."
            dropdown={
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            }
            valueBox={model}
          />

          <SettingRow
            title="Temperature"
            explanation="Randomness of the output. Lower = more deterministic; higher = more creative."
            dropdown={
              <select
                value={temperatureSelect}
                onChange={(e) => {
                  const opt = TEMPERATURE_OPTIONS.find((o) => o.value === e.target.value)!;
                  setTemperatureSelect(opt.value);
                  setTemperature(opt.send);
                }}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {temperatureOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
            valueBox={String(temperature)}
          />

          <SettingRow
            title="Max tokens"
            explanation="Maximum length of the model’s reply in tokens. Caps response size."
            dropdown={
              <select
                value={maxTokensSelect}
                onChange={(e) => {
                  const opt = MAX_TOKENS_OPTIONS.find((o) => o.value === e.target.value)!;
                  setMaxTokensSelect(opt.value);
                  setMaxTokens(opt.send);
                }}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {MAX_TOKENS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
            valueBox={String(maxTokens)}
          />

          <SettingRow
            title="Top P (nucleus sampling)"
            explanation="Consider only tokens whose cumulative probability is within this fraction. Often left at 1.0."
            dropdown={
              <select
                value={topPSelect}
                onChange={(e) => {
                  const opt = TOP_P_OPTIONS.find((o) => o.value === e.target.value)!;
                  setTopPSelect(opt.value);
                  setTopP(opt.send);
                }}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {TOP_P_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
            valueBox={String(topP)}
          />

          <SettingRow
            title="Frequency penalty"
            explanation="Discourages repeating the same phrases. Higher = less repetition."
            dropdown={
              <select
                value={frequencyPenaltySelect}
                onChange={(e) => {
                  const opt = PENALTY_OPTIONS.find((o) => o.value === e.target.value)!;
                  setFrequencyPenaltySelect(opt.value);
                  setFrequencyPenalty(opt.send);
                }}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {PENALTY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
            valueBox={String(frequencyPenalty)}
          />

          <SettingRow
            title="Presence penalty"
            explanation="Encourages new topics; penalizes tokens that have already appeared."
            dropdown={
              <select
                value={presencePenaltySelect}
                onChange={(e) => {
                  const opt = PENALTY_OPTIONS.find((o) => o.value === e.target.value)!;
                  setPresencePenaltySelect(opt.value);
                  setPresencePenalty(opt.send);
                }}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {PENALTY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
            valueBox={String(presencePenalty)}
          />

          <SettingRow
            title="Stream"
            explanation="If true, the API streams the reply in chunks. This UI only supports false."
            dropdown={
              <select
                value={streamSelect}
                onChange={(e) => {
                  const opt = STREAM_OPTIONS.find((o) => o.value === e.target.value)!;
                  setStreamSelect(opt.value);
                  setStream(opt.send);
                }}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              >
                {STREAM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            }
            valueBox={String(stream)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? "Sending…" : "Send prompt"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      {response !== null && (
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-medium text-foreground">Response</h2>
          <div className="rounded border border-zinc-200 bg-white p-4 text-foreground dark:border-zinc-700 dark:bg-zinc-900">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {formatInlineMarkdown(response)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
