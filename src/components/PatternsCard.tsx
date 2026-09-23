import type { BaziResult } from "@/lib/bazi";
import type { Interaction } from "@/lib/interactions";
import type { SymbolicStar } from "@/lib/shenSha";

function InteractionRow({ interaction }: { interaction: Interaction }) {
  return (
    <details className="group rounded-lg border border-[#e3d5c0] bg-white open:bg-[#fbf7f0]">
      <summary className="cursor-pointer list-none px-3 py-2 flex items-center justify-between gap-2 text-sm">
        <span>
          <span className="font-medium text-[#7a2e2e]">{interaction.label}</span>{" "}
          <span className="text-[#7a6f61]">
            {interaction.chars} ({interaction.participants.join(" & ")})
          </span>
        </span>
        <span className="text-[#b3a794] text-xs group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <p className="px-3 pb-3 text-sm text-[#241c15] leading-relaxed">
        {interaction.meaning}
        {interaction.resultElement && (
          <span className="text-[#7a6f61]"> (leans {interaction.resultElement}.)</span>
        )}
      </p>
    </details>
  );
}

function StarRow({ star }: { star: SymbolicStar }) {
  return (
    <details className="group rounded-lg border border-[#e3d5c0] bg-white open:bg-[#fbf7f0]">
      <summary className="cursor-pointer list-none px-3 py-2 flex items-center justify-between gap-2 text-sm">
        <span>
          <span className="font-medium text-[#7a2e2e]">{star.name}</span>{" "}
          <span className="text-[#7a6f61]">
            ({star.chineseName}) — in {star.foundIn.join(", ")}
          </span>
        </span>
        <span className="text-[#b3a794] text-xs group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <p className="px-3 pb-3 text-sm text-[#241c15] leading-relaxed">{star.meaning}</p>
    </details>
  );
}

export default function PatternsCard({ result }: { result: BaziResult }) {
  return (
    <div className="rounded-2xl border border-[#e3d5c0] bg-[#fbf7f0] p-6 space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-1">Pillar Interactions</h2>
        <p className="text-xs text-[#7a6f61] mb-3">
          How your stems and branches combine, clash, or reinforce each other — this matters as much
          as the Day Master on its own. Tap any row for what it means.
        </p>
        {result.interactions.length > 0 ? (
          <div className="space-y-2">
            {result.interactions.map((i, idx) => (
              <InteractionRow key={idx} interaction={i} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#7a6f61]">No notable combinations, clashes, or harmonies detected between your pillars.</p>
        )}
      </div>

      {result.currentLuckCycle && (
        <div>
          <h2 className="font-semibold text-lg mb-1">Current Cycle Interactions</h2>
          <p className="text-xs text-[#7a6f61] mb-3">
            How your current 10-year cycle ({result.currentLuckCycle.ganZhi}) interacts with your base
            chart.
          </p>
          {result.luckInteractions.length > 0 ? (
            <div className="space-y-2">
              {result.luckInteractions.map((i, idx) => (
                <InteractionRow key={idx} interaction={i} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#7a6f61]">No notable interactions between this cycle and your base chart.</p>
          )}
        </div>
      )}

      <div>
        <h2 className="font-semibold text-lg mb-1">Symbolic Stars</h2>
        <p className="text-xs text-[#7a6f61] mb-3">
          Traditional markers layered on top of the core chart — supplementary flavor, not the main
          read.
        </p>
        {result.symbolicStars.length > 0 ? (
          <div className="space-y-2">
            {result.symbolicStars.map((s, idx) => (
              <StarRow key={idx} star={s} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#7a6f61]">No notable symbolic stars detected.</p>
        )}
      </div>
    </div>
  );
}
