import type { BaziResult, Pillar } from "@/lib/bazi";
import { ELEMENT_COLOR } from "@/lib/elements";

function PillarColumn({ pillar }: { pillar: Pillar }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col items-center gap-2 rounded-xl border border-[#e3d5c0] bg-white p-3">
      <span className="text-xs uppercase tracking-wide text-[#7a6f61]">{pillar.label}</span>
      {pillar.known ? (
        <>
          {pillar.tenGod && (
            <span className="text-[10px] text-[#b3a794] -mb-1">{pillar.tenGod}</span>
          )}
          <div
            className="w-full text-center rounded-lg py-2 font-serif text-2xl"
            style={{ backgroundColor: pillar.stem ? `${ELEMENT_COLOR[pillar.stem.element]}1a` : undefined, color: pillar.stem ? ELEMENT_COLOR[pillar.stem.element] : undefined }}
          >
            {pillar.stem?.char}
          </div>
          <div
            className="w-full text-center rounded-lg py-2 font-serif text-2xl"
            style={{ backgroundColor: pillar.branch ? `${ELEMENT_COLOR[pillar.branch.element]}1a` : undefined, color: pillar.branch ? ELEMENT_COLOR[pillar.branch.element] : undefined }}
          >
            {pillar.branch?.char}
          </div>
          <span className="text-[11px] text-[#7a6f61] text-center leading-tight">
            {pillar.stem?.pinyin} {pillar.stem?.element} · {pillar.branch?.pinyin} {pillar.branch?.element}
          </span>
        </>
      ) : (
        <div className="w-full text-center rounded-lg py-6 text-[#b3a794] text-sm border border-dashed border-[#e3d5c0]">
          unknown
        </div>
      )}
    </div>
  );
}

export default function PillarsCard({ result }: { result: BaziResult }) {
  return (
    <div className="rounded-2xl border border-[#e3d5c0] bg-[#fbf7f0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Your Four Pillars</h2>
        <span className="text-xs text-[#7a6f61]">{result.lunarDateLabel}</span>
      </div>
      <div className="flex gap-3">
        <PillarColumn pillar={result.pillars.year} />
        <PillarColumn pillar={result.pillars.month} />
        <PillarColumn pillar={result.pillars.day} />
        <PillarColumn pillar={result.pillars.hour} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-[#7a6f61]">Day Master:</span>
        <span
          className="font-serif text-xl px-3 py-1 rounded-lg"
          style={{ backgroundColor: `${ELEMENT_COLOR[result.dayMaster.element]}1a`, color: ELEMENT_COLOR[result.dayMaster.element] }}
        >
          {result.dayMaster.char}
        </span>
        <span className="text-[#7a6f61]">
          {result.dayMaster.pinyin} · {result.dayMaster.polarity} {result.dayMaster.element}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-xs text-[#7a6f61]">Element balance</span>
        <div className="mt-1 flex gap-2 flex-wrap">
          {Object.entries(result.elementCounts).map(([el, count]) => (
            <span
              key={el}
              className="text-xs rounded-full px-2.5 py-1 border"
              style={{
                borderColor: ELEMENT_COLOR[el as keyof typeof ELEMENT_COLOR],
                color: ELEMENT_COLOR[el as keyof typeof ELEMENT_COLOR],
                backgroundColor: el === result.dominantElement ? `${ELEMENT_COLOR[el as keyof typeof ELEMENT_COLOR]}1a` : undefined,
                fontWeight: el === result.dominantElement ? 600 : undefined,
              }}
            >
              {el} × {count}
              {el === result.dominantElement && " (dominant)"}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-white border border-[#e3d5c0] p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>
            Day Master is <strong>{result.dayMasterStrength}</strong>
          </span>
          <span className="text-xs text-[#7a6f61]">{result.supportivePercent}% supportive influence</span>
        </div>
        <div className="h-2 rounded-full bg-[#f0e6d6] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${result.supportivePercent}%`, backgroundColor: ELEMENT_COLOR[result.dayMaster.element] }}
          />
        </div>
        <p className="mt-2 text-xs text-[#7a6f61] leading-relaxed">
          {result.dayMasterStrength === "Strong" &&
            "Your chart leans on your own element and what feeds it — you likely draw on inner reserves easily and may need outlets to release excess energy."}
          {result.dayMasterStrength === "Balanced" &&
            "Your chart is fairly even between what supports and what draws on your core element — a flexible baseline that can lean either way depending on circumstances."}
          {result.dayMasterStrength === "Weak" &&
            "Your chart leans on elements that challenge or drain your core element — you likely do best drawing on external support and allies rather than pushing solo."}
        </p>
      </div>

      {result.solarTimeCorrectionMinutes !== null && Math.abs(result.solarTimeCorrectionMinutes) >= 1 && (
        <p className="mt-3 text-xs text-[#7a6f61]">
          Adjusted {result.solarTimeCorrectionMinutes > 0 ? "+" : ""}
          {result.solarTimeCorrectionMinutes} min for true solar time at {result.input.locationLabel}.
        </p>
      )}

      {result.input.timeUnknown && (
        <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Birth time unknown — Hour Pillar omitted. Reading accuracy estimated at{" "}
          <strong>{result.accuracyPercent}%</strong> of a full chart.
        </p>
      )}
    </div>
  );
}
