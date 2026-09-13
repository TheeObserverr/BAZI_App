"use client";

import { useState } from "react";
import type { BirthInput, Gender } from "@/lib/bazi";

interface Props {
  onSubmit: (input: BirthInput) => void;
}

const GMT_OFFSETS = [
  -12, -11, -10, -9.5, -9, -8, -7, -6, -5, -4.5, -4, -3.5, -3, -2, -1, 0, 1, 2, 3, 3.5, 4, 4.5, 5,
  5.5, 5.75, 6, 6.5, 7, 8, 8.75, 9, 9.5, 10, 10.5, 11, 12, 12.75, 13, 14,
];

function fmtOffset(v: number) {
  const sign = v >= 0 ? "+" : "-";
  const abs = Math.abs(v);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `GMT${sign}${h}${m ? `:${m.toString().padStart(2, "0")}` : ""}`;
}

export default function BirthForm({ onSubmit }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear() - 25);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<Gender>("female");
  const [gmtOffset, setGmtOffset] = useState(8);

  const daysInMonth = new Date(year, month, 0).getDate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      year,
      month,
      day: Math.min(day, daysInMonth),
      hour: timeUnknown ? null : hour,
      minute: timeUnknown ? 0 : minute,
      gender,
      gmtOffset,
      timeUnknown,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-[#e3d5c0] p-6 shadow-sm">
      <div className="grid grid-cols-3 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[#7a6f61]">Year</span>
          <input
            type="number"
            required
            min={1900}
            max={now.getFullYear()}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border border-[#e3d5c0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[#7a6f61]">Month</span>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-lg border border-[#e3d5c0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[#7a6f61]">Day</span>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="rounded-lg border border-[#e3d5c0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl bg-[#fbf7f0] border border-[#e3d5c0] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Time of birth</span>
          <label className="flex items-center gap-2 text-xs text-[#7a6f61]">
            <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} />
            I don&apos;t know my birth time
          </label>
        </div>

        {!timeUnknown && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-[#7a6f61]">Hour (24h)</span>
                <select
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                  className="rounded-lg border border-[#e3d5c0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-[#7a6f61]">Minute</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                  className="rounded-lg border border-[#e3d5c0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-xs text-[#7a6f61] leading-relaxed">
              For your privacy, we&apos;d rather you not enter your exact minute of birth — use the
              closest few minutes instead (e.g. if you were born at 12:45, entering 12:58 is close
              enough to give the same reading). Nothing is stored either way.
            </p>
          </>
        )}
        {timeUnknown && (
          <p className="text-xs text-[#7a6f61] leading-relaxed">
            We&apos;ll skip the Hour Pillar and give you the Year, Month, and Day Pillars only. The
            reading will be noted as roughly <strong>72% as precise</strong> as one with a known
            birth time.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[#7a6f61]">Gender</span>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="rounded-lg border border-[#e3d5c0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[#7a6f61]">Birth location (time zone)</span>
          <select
            value={gmtOffset}
            onChange={(e) => setGmtOffset(Number(e.target.value))}
            className="rounded-lg border border-[#e3d5c0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a2e2e]/40"
          >
            {GMT_OFFSETS.map((o) => (
              <option key={o} value={o}>
                {fmtOffset(o)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#7a2e2e] text-white font-medium py-3 hover:bg-[#5f2323] transition-colors"
      >
        Calculate my Ba Zi
      </button>
    </form>
  );
}
