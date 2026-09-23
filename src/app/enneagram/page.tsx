"use client";

import { useState } from "react";
import { ENNEAGRAM_TYPES, GROUP_ONE, GROUP_TWO, resolveType } from "@/lib/enneagram";

export default function EnneagramPage() {
  const [groupOne, setGroupOne] = useState<string | null>(null);
  const [groupTwo, setGroupTwo] = useState<string | null>(null);

  const result = groupOne && groupTwo ? resolveType(groupOne, groupTwo) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Enneagram Quick Sort</h1>
        <p className="text-sm text-[#7a6f61] max-w-2xl mx-auto leading-relaxed">
          The Enneagram describes 9 core personality types, each built around a different core fear
          and desire. This quick sort narrows things down in two steps instead of a long
          questionnaire — pick whichever description in each group fits you best, most of the time.
        </p>
        <p className="text-xs text-[#b3a794] max-w-2xl mx-auto leading-relaxed">
          This is a fast self-sort, not a clinical assessment — it won't capture your wing or how
          strongly other types show up in you. Read the matched type below and see if it actually
          resonates; if not, the neighboring types are worth a look too.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-3">Group I — pick the closest fit</h2>
          <div className="grid gap-3">
            {GROUP_ONE.map((opt) => (
              <label
                key={opt.key}
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  groupOne === opt.key ? "border-[#7a2e2e] bg-[#fbf7f0]" : "border-[#e3d5c0] bg-white hover:bg-[#fbf7f0]/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="groupOne"
                    className="mt-1"
                    checked={groupOne === opt.key}
                    onChange={() => setGroupOne(opt.key)}
                  />
                  <div>
                    <div className="font-medium text-sm mb-1">{opt.title}</div>
                    <p className="text-sm text-[#241c15] leading-relaxed">{opt.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3">Group II — pick the closest fit</h2>
          <div className="grid gap-3">
            {GROUP_TWO.map((opt) => (
              <label
                key={opt.key}
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  groupTwo === opt.key ? "border-[#7a2e2e] bg-[#fbf7f0]" : "border-[#e3d5c0] bg-white hover:bg-[#fbf7f0]/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="groupTwo"
                    className="mt-1"
                    checked={groupTwo === opt.key}
                    onChange={() => setGroupTwo(opt.key)}
                  />
                  <div>
                    <div className="font-medium text-sm mb-1">{opt.title}</div>
                    <p className="text-sm text-[#241c15] leading-relaxed">{opt.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-[#7a2e2e] bg-white p-6 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-[#7a6f61] mb-1">Your likely type</div>
          <h2 className="text-xl font-semibold text-[#7a2e2e] mb-3">
            Type {result.number} — {result.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-[#7a2e2e] mb-1">Core desire</div>
              <p>{result.coreDesire}</p>
            </div>
            <div>
              <div className="font-medium text-[#7a2e2e] mb-1">Core fear</div>
              <p>{result.coreFear}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p>{result.traits}</p>
            <p>
              <span className="font-medium text-[#7a2e2e]">At their best: </span>
              {result.atBest}
            </p>
            <p>
              <span className="font-medium text-[#7a2e2e]">Watch for: </span>
              {result.watchFor}
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4 text-center">The Nine Types</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {ENNEAGRAM_TYPES.map((t) => (
            <div key={t.number} className="rounded-2xl border border-[#e3d5c0] bg-white p-5 space-y-2">
              <div className="font-medium">
                {t.number}. {t.name}
              </div>
              <p className="text-xs text-[#7a6f61]">
                <span className="font-medium text-[#7a2e2e]">Desire: </span>
                {t.coreDesire}
                {" · "}
                <span className="font-medium text-[#7a2e2e]">Fear: </span>
                {t.coreFear}
              </p>
              <p className="text-sm leading-relaxed">{t.traits}</p>
              <p className="text-xs text-[#7a6f61] leading-relaxed">
                <span className="font-medium text-[#7a2e2e]">At their best: </span>
                {t.atBest}
              </p>
              <p className="text-xs text-[#7a6f61] leading-relaxed">
                <span className="font-medium text-[#7a2e2e]">Watch for: </span>
                {t.watchFor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
