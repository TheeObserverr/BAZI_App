"use client";

import { useEffect, useState } from "react";
import type { BirthInput } from "@/lib/bazi";

export interface Reading {
  personality: string;
  career: string;
  wealthLuck: string;
  health: string;
  currentCyclePrediction: string;
}

export function readingToSummary(reading: Reading): string {
  return [
    `Personality: ${reading.personality}`,
    `Career: ${reading.career}`,
    `Wealth & Luck: ${reading.wealthLuck}`,
    `Health: ${reading.health}`,
    `Current cycle: ${reading.currentCyclePrediction}`,
  ].join("\n");
}

export default function ReadingPanel({ input, onLoaded }: { input: BirthInput; onLoaded?: (reading: Reading | null) => void }) {
  const [reading, setReading] = useState<Reading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setReading(null);

    fetch("/api/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Something went wrong.");
          onLoaded?.(null);
        } else {
          setReading(data.reading);
          onLoaded?.(data.reading);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not reach the reading service.");
          onLoaded?.(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, retryCount]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e3d5c0] bg-white p-6 animate-pulse space-y-3">
        <div className="h-4 bg-[#f0e6d6] rounded w-1/3" />
        <div className="h-3 bg-[#f0e6d6] rounded w-full" />
        <div className="h-3 bg-[#f0e6d6] rounded w-5/6" />
        <div className="h-3 bg-[#f0e6d6] rounded w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 text-red-800 p-6 text-sm space-y-3">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => setRetryCount((c) => c + 1)}
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!reading) return null;

  const sections: { title: string; body: string }[] = [
    { title: "Personality", body: reading.personality },
    { title: "Career", body: reading.career },
    { title: "Wealth & Luck", body: reading.wealthLuck },
    { title: "Health", body: reading.health },
    { title: "Your Current 10-Year Cycle", body: reading.currentCyclePrediction },
  ];

  return (
    <div className="rounded-2xl border border-[#e3d5c0] bg-white p-6 space-y-5">
      <h2 className="font-semibold text-lg">Your Reading</h2>
      {sections.map((s) => (
        <div key={s.title}>
          <h3 className="text-sm font-medium text-[#7a2e2e] mb-1">{s.title}</h3>
          <p className="text-sm leading-relaxed text-[#241c15]">{s.body}</p>
        </div>
      ))}
      <p className="text-xs text-[#b3a794] pt-2 border-t border-[#f0e6d6]">
        Generated for reflection and entertainment purposes — not professional advice.
      </p>
    </div>
  );
}
