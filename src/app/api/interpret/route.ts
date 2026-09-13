import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateBazi, type BirthInput } from "@/lib/bazi";
import { summarizeZiwei } from "@/lib/ziwei";

export const runtime = "nodejs";

interface RequestBody {
  input: BirthInput;
}

function buildPrompt(bazi: ReturnType<typeof calculateBazi>, ziwei: ReturnType<typeof summarizeZiwei>) {
  const pillarLine = (label: string, p: (typeof bazi.pillars)["year"]) =>
    p.known
      ? `${label}: ${p.ganZhi} (stem ${p.stem?.char} ${p.stem?.element}/${p.stem?.polarity}, branch ${p.branch?.char} ${p.branch?.element})`
      : `${label}: unknown`;

  const cycle = bazi.currentLuckCycle;
  const cycleLine = cycle
    ? `Current 10-year cycle: ${cycle.ganZhi} (${cycle.stemElement}/${cycle.branchElement}), covering ${cycle.startYear}-${cycle.endYear}, ages ${cycle.startAge}-${cycle.endAge}.`
    : "No current 10-year cycle could be determined (birth year may be in the future or the pre-cycle childhood period).";

  const elementSummary = Object.entries(bazi.elementCounts)
    .map(([el, n]) => `${el}: ${n}`)
    .join(", ");

  const secondarySignal = ziwei
    ? `Additional chart signal (do not name the technique used to derive this; weave it in as general insight only): dominant inner temperament marker "${ziwei.soulStar}", outward expression marker "${ziwei.bodyStar}", constitution class "${ziwei.fiveElementsClass}", core life-focus themes: ${ziwei.lifePalace.majorStars.join(", ") || "none prominent"}, current decade themes: ${ziwei.currentDecadal ? `stem ${ziwei.currentDecadal.heavenlyStem}, branch ${ziwei.currentDecadal.earthlyBranch}` : "n/a"}.`
    : "No secondary chart signal available (birth hour unknown).";

  return `You are an expert Chinese metaphysics consultant blending Four Pillars (Ba Zi) analysis with subtle, unnamed cross-referencing from a secondary destiny-chart technique for extra nuance. Never mention the names of the techniques themselves (do not say "Ba Zi", "Four Pillars", "Zi Wei Dou Shu", "Purple Star Astrology", or similar labels) — just speak directly about the person's personality, tendencies, and outlook, as a warm, insightful reading.

Birth chart data:
- Day Master: ${bazi.dayMaster.char} (${bazi.dayMaster.element}, ${bazi.dayMaster.polarity})
- ${pillarLine("Year pillar", bazi.pillars.year)}
- ${pillarLine("Month pillar", bazi.pillars.month)}
- ${pillarLine("Day pillar", bazi.pillars.day)}
- ${pillarLine("Hour pillar", bazi.pillars.hour)}
- Element balance across the chart: ${elementSummary}
- ${cycleLine}
- Gender: ${bazi.input.gender}
- ${bazi.input.timeUnknown ? "Birth time was not provided — treat hour-based detail as lower confidence and lean on the other three pillars." : ""}
- ${secondarySignal}

Write a warm, specific, non-generic reading in second person ("you"). Avoid hedge-everything language; give a clear read while noting genuine uncertainty only where the data is actually incomplete (e.g. unknown birth time). Ground the "currentCyclePrediction" field specifically in the current 10-year cycle above, describing what this particular window in their life tends to emphasize and how to work with it.

Respond ONLY with JSON matching this exact shape, no markdown fences:
{
  "personality": "2-4 sentences on core personality and temperament",
  "career": "2-4 sentences on career strengths and suitable directions",
  "wealthLuck": "2-4 sentences on money habits, luck patterns, and how to work with them",
  "health": "2-3 sentences on constitutional tendencies and practical health advice",
  "currentCyclePrediction": "3-5 sentences overlaying the current 10-year cycle onto the above, i.e. what this specific period of their life is likely to bring and how to navigate it"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is not configured with a GEMINI_API_KEY. Add one in your deployment's environment variables." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as RequestBody;
    const { input } = body;

    if (
      typeof input?.year !== "number" ||
      typeof input?.month !== "number" ||
      typeof input?.day !== "number" ||
      (input.gender !== "male" && input.gender !== "female")
    ) {
      return NextResponse.json({ error: "Invalid birth input." }, { status: 400 });
    }

    const bazi = calculateBazi(input);
    const ziwei = summarizeZiwei(input.year, input.month, input.day, input.timeUnknown ? null : input.hour, input.gender);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = buildPrompt(bazi, ziwei);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Could not parse AI response." }, { status: 502 });
    }

    return NextResponse.json({ reading: parsed });
  } catch (err) {
    console.error("interpret route error", err);
    return NextResponse.json({ error: "Something went wrong generating the reading." }, { status: 500 });
  }
}
