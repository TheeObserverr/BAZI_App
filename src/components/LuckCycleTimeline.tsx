import type { BaziResult } from "@/lib/bazi";
import { ELEMENT_COLOR } from "@/lib/elements";

export default function LuckCycleTimeline({ result }: { result: BaziResult }) {
  const { luckCycles, currentLuckCycle, luckStartAge } = result;

  if (luckCycles.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#e3d5c0] bg-[#fbf7f0] p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-lg">10-Year Luck Cycles</h2>
        <span className="text-xs text-[#7a6f61]">First cycle begins at age {luckStartAge}</span>
      </div>
      <p className="text-xs text-[#7a6f61] mb-4">
        Each pillar governs roughly ten years of life, layering its own stem and branch element over
        your base chart.
      </p>

      <div className="overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-2">
          {luckCycles.map((cycle) => (
            <div
              key={cycle.index}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 min-w-[92px] ${
                cycle.isCurrent ? "border-[#7a2e2e] bg-white shadow-md" : "border-[#e3d5c0] bg-white/60"
              }`}
            >
              {cycle.isCurrent && (
                <span className="text-[10px] uppercase tracking-wide font-semibold text-[#7a2e2e]">Now</span>
              )}
              <span className="font-serif text-xl">{cycle.ganZhi}</span>
              <span className="text-[11px] text-[#7a6f61] text-center">
                {cycle.stemElement && (
                  <span style={{ color: ELEMENT_COLOR[cycle.stemElement] }}>{cycle.stemElement}</span>
                )}
                {cycle.stemElement && cycle.branchElement ? " / " : ""}
                {cycle.branchElement && (
                  <span style={{ color: ELEMENT_COLOR[cycle.branchElement] }}>{cycle.branchElement}</span>
                )}
              </span>
              <span className="text-[11px] text-[#7a6f61]">ages {cycle.startAge}–{cycle.endAge}</span>
              <span className="text-[10px] text-[#b3a794]">
                {cycle.startYear}–{cycle.endYear}
              </span>
            </div>
          ))}
        </div>
      </div>

      {currentLuckCycle ? (
        <p className="mt-4 text-sm">
          You are currently in the <strong>{currentLuckCycle.ganZhi}</strong> cycle (
          {currentLuckCycle.startYear}–{currentLuckCycle.endYear}), carrying a{" "}
          <span style={{ color: currentLuckCycle.stemElement ? ELEMENT_COLOR[currentLuckCycle.stemElement] : undefined }}>
            {currentLuckCycle.stemElement}
          </span>{" "}
          /{" "}
          <span style={{ color: currentLuckCycle.branchElement ? ELEMENT_COLOR[currentLuckCycle.branchElement] : undefined }}>
            {currentLuckCycle.branchElement}
          </span>{" "}
          influence.
        </p>
      ) : (
        <p className="mt-4 text-sm text-[#7a6f61]">
          You haven&apos;t entered your first 10-year cycle yet, or the calculated range doesn&apos;t
          cover the current year.
        </p>
      )}
    </div>
  );
}
