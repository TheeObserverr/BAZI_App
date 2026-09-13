import { DAY_MASTERS } from "@/lib/dayMasters";
import { ELEMENT_COLOR } from "@/lib/elements";

export const metadata = {
  title: "Day Masters — Ba Zi Calculator",
};

export default function DayMastersPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">What Is a Day Master?</h1>
        <p className="text-sm text-[#7a6f61] max-w-2xl mx-auto leading-relaxed">
          Your Day Master is the Heavenly Stem of your Day Pillar — the character sitting in the
          &quot;Day&quot; column of your Four Pillars chart. It&apos;s treated as the core symbol of{" "}
          <em>you</em> in the chart: everything else (the other seven characters, and the 10-year
          luck cycles) is read in relation to it. There are ten possible Day Masters, one for each
          combination of the five elements (Wood, Fire, Earth, Metal, Water) with a Yin or Yang
          polarity.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {DAY_MASTERS.map((dm) => (
          <div key={dm.char} className="rounded-2xl border border-[#e3d5c0] bg-white p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="font-serif text-3xl rounded-lg px-3 py-1"
                style={{ backgroundColor: `${ELEMENT_COLOR[dm.element as keyof typeof ELEMENT_COLOR]}1a`, color: ELEMENT_COLOR[dm.element as keyof typeof ELEMENT_COLOR] }}
              >
                {dm.char}
              </span>
              <div>
                <div className="font-medium">
                  {dm.pinyin} · {dm.polarity} {dm.element}
                </div>
                <div className="text-xs text-[#7a6f61] italic">{dm.nickname}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{dm.summary}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="font-medium text-[#7a2e2e] mb-1">Strengths</div>
                <ul className="list-disc list-inside space-y-0.5 text-[#241c15]">
                  {dm.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium text-[#7a2e2e] mb-1">Watch out for</div>
                <ul className="list-disc list-inside space-y-0.5 text-[#241c15]">
                  {dm.watchOuts.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
