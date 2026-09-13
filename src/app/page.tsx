"use client";

import { useState } from "react";
import BirthForm from "@/components/BirthForm";
import PillarsCard from "@/components/PillarsCard";
import LuckCycleTimeline from "@/components/LuckCycleTimeline";
import ReadingPanel, { readingToSummary, type Reading } from "@/components/ReadingPanel";
import ChatPanel from "@/components/ChatPanel";
import { calculateBazi, type BaziResult, type BirthInput } from "@/lib/bazi";

export default function Home() {
  const [input, setInput] = useState<BirthInput | null>(null);
  const [result, setResult] = useState<BaziResult | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);

  function handleSubmit(newInput: BirthInput) {
    setInput(newInput);
    setResult(calculateBazi(newInput));
    setReading(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Ba Zi Birth Chart Calculator</h1>
        <p className="text-sm text-[#7a6f61] max-w-xl mx-auto">
          Enter a birth date, time, and location to calculate a Four Pillars (Ba Zi) chart, see the
          10-year luck cycles, and get an AI-generated reading of personality, career, wealth, and
          health.
        </p>
      </div>

      <BirthForm onSubmit={handleSubmit} />

      {result && (
        <div className="space-y-6">
          <PillarsCard result={result} />
          <LuckCycleTimeline result={result} />
          {input && <ReadingPanel input={input} onLoaded={setReading} />}
          {input && reading && <ChatPanel input={input} readingSummary={readingToSummary(reading)} />}
        </div>
      )}
    </div>
  );
}
