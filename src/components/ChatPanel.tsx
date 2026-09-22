"use client";

import { useState } from "react";
import type { BirthInput } from "@/lib/bazi";

const MAX_QUESTIONS = 10;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel({ input, readingSummary }: { input: BirthInput; readingSummary: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionsUsed = messages.filter((m) => m.role === "user").length;
  const remaining = MAX_QUESTIONS - questionsUsed;
  const limitReached = remaining <= 0;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading || limitReached) return;

    setPendingQuestion(trimmed);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, readingSummary, history: messages, question: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Don't consume a question slot or lose the draft on failure.
        setError(data.error ?? "Something went wrong.");
        setQuestion(trimmed);
      } else {
        setMessages([...messages, { role: "user", content: trimmed }, { role: "assistant", content: data.answer }]);
      }
    } catch {
      setError("Could not reach the chat service.");
      setQuestion(trimmed);
    } finally {
      setPendingQuestion(null);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#e3d5c0] bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Ask About Your Reading</h2>
        <span className="text-xs text-[#7a6f61]">
          {limitReached ? "Question limit reached" : `${remaining} of ${MAX_QUESTIONS} questions left`}
        </span>
      </div>

      {(messages.length > 0 || pendingQuestion) && (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm rounded-xl px-3 py-2 max-w-[85%] ${
                m.role === "user" ? "bg-[#7a2e2e] text-white ml-auto" : "bg-[#fbf7f0] border border-[#e3d5c0]"
              }`}
            >
              {m.content}
            </div>
          ))}
          {pendingQuestion && (
            <div className="text-sm rounded-xl px-3 py-2 max-w-[85%] bg-[#7a2e2e]/70 text-white ml-auto">
              {pendingQuestion}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {limitReached ? (
        <p className="text-xs text-[#7a6f61]">
          You&apos;ve used all {MAX_QUESTIONS} questions for this reading. Refresh and recalculate to
          start a new one.
        </p>
      ) : (
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What should I focus on at work this year?"
            className="flex-1 rounded-lg border border-[#e3d5c0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-lg bg-[#7a2e2e] text-white text-sm font-medium px-4 py-2 hover:bg-[#5f2323] transition-colors disabled:opacity-50"
          >
            {loading ? "…" : "Ask"}
          </button>
        </form>
      )}
    </div>
  );
}
