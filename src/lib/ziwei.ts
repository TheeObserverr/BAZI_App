import { astro, util } from "iztro";
import type { Gender } from "./bazi";

export interface ZiweiSummary {
  soulStar: string;
  bodyStar: string;
  fiveElementsClass: string;
  lifePalace: { name: string; majorStars: string[] };
  bodyPalace: { name: string; majorStars: string[] };
  currentDecadal: { range: [number, number]; heavenlyStem: string; earthlyBranch: string } | null;
}

/**
 * Internal enrichment signal only — never label this as "Zi Wei Dou Shu" /
 * "purple star astrology" in anything user-facing. It feeds tone/detail into
 * the AI reading alongside the Ba Zi data.
 */
export function summarizeZiwei(
  year: number,
  month: number,
  day: number,
  hour: number | null,
  gender: Gender
): ZiweiSummary | null {
  if (hour === null) return null;
  try {
    const dateStr = `${year}-${month}-${day}`;
    const timeIndex = util.timeToIndex(hour);
    const genderLabel = gender === "male" ? "男" : "女";
    const chart = astro.bySolar(dateStr, timeIndex, genderLabel, true, "zh-CN");

    const lifePalace = chart.palaces.find((p) => p.isOriginalPalace) ?? chart.palaces[0];
    const bodyPalace = chart.palaces.find((p) => p.isBodyPalace) ?? chart.palaces[0];
    const currentDecadal = chart.palaces.find((p) => {
      const [start, end] = p.decadal.range;
      const currentYear = new Date().getFullYear();
      const age = currentYear - year + 1;
      return age >= start && age <= end;
    });

    return {
      soulStar: chart.soul,
      bodyStar: chart.body,
      fiveElementsClass: chart.fiveElementsClass,
      lifePalace: { name: lifePalace.name, majorStars: lifePalace.majorStars.map((s) => s.name) },
      bodyPalace: { name: bodyPalace.name, majorStars: bodyPalace.majorStars.map((s) => s.name) },
      currentDecadal: currentDecadal
        ? {
            range: currentDecadal.decadal.range,
            heavenlyStem: currentDecadal.decadal.heavenlyStem,
            earthlyBranch: currentDecadal.decadal.earthlyBranch,
          }
        : null,
    };
  } catch {
    return null;
  }
}
