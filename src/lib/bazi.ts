import { Solar } from "lunar-javascript";
import { ganZhiElements, generatorOf, stemInfo, tenGodLabel, type Element } from "./elements";
import { findBranchInteractions, findStemInteractions, type Interaction } from "./interactions";
import { findSymbolicStars, type SymbolicStar } from "./shenSha";

export type Gender = "male" | "female";

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute: number;
  gender: Gender;
  /** Degrees longitude, +east, of the birth location. */
  longitude: number;
  /** Standard (non-DST) UTC offset in hours used to interpret the entered clock time. */
  utcOffset: number;
  locationLabel: string;
  timeUnknown: boolean;
}

export interface Pillar {
  label: "Year" | "Month" | "Day" | "Hour";
  ganZhi: string;
  stem: { char: string; pinyin: string; element: Element; polarity: string } | null;
  branch: { char: string; pinyin: string; element: Element; zodiac: string } | null;
  hidden: string[];
  tenGod: string | null;
  known: boolean;
}

export interface LuckCycle {
  index: number;
  startYear: number;
  endYear: number;
  startAge: number;
  endAge: number;
  ganZhi: string;
  stemElement: Element | null;
  branchElement: Element | null;
  isCurrent: boolean;
}

export interface BaziResult {
  input: BirthInput;
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  dayMaster: { char: string; pinyin: string; element: Element; polarity: string };
  elementCounts: Record<Element, number>;
  dominantElement: Element;
  dayMasterStrength: "Strong" | "Balanced" | "Weak";
  supportivePercent: number;
  luckStartAge: number;
  luckCycles: LuckCycle[];
  currentLuckCycle: LuckCycle | null;
  accuracyPercent: number;
  lunarDateLabel: string;
  solarTimeCorrectionMinutes: number | null;
  interactions: Interaction[];
  luckInteractions: Interaction[];
  symbolicStars: SymbolicStar[];
}

/**
 * Equation of time, in minutes: the gap between apparent (sundial) solar
 * time and mean solar time, caused by Earth's elliptical orbit and axial
 * tilt. Ranges roughly -14 to +16 minutes over the year. Approximation per
 * Spencer's formula.
 */
function equationOfTimeMinutes(year: number, month: number, day: number): number {
  const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000) + 1;
  const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
  const b = (2 * Math.PI * (dayOfYear - 81)) / daysInYear;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

/**
 * Shifts entered civil clock time to true (apparent) solar time: the gap
 * between the birth location's longitude and its time zone's standard
 * meridian (utcOffset * 15°), plus the equation of time for that date.
 * Ignores DST. Returns null when the birth hour is unknown, since there's
 * nothing meaningful to shift.
 */
function applyTrueSolarTime(input: BirthInput): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  correctionMinutes: number | null;
} {
  if (input.timeUnknown || input.hour === null) {
    return { year: input.year, month: input.month, day: input.day, hour: 12, minute: 0, correctionMinutes: null };
  }

  const standardMeridian = input.utcOffset * 15;
  const longitudeCorrection = (input.longitude - standardMeridian) * 4;
  const eot = equationOfTimeMinutes(input.year, input.month, input.day);
  const correctionMinutes = Math.round(longitudeCorrection + eot);

  const base = new Date(Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute));
  base.setUTCMinutes(base.getUTCMinutes() + correctionMinutes);

  return {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
    day: base.getUTCDate(),
    hour: base.getUTCHours(),
    minute: base.getUTCMinutes(),
    correctionMinutes,
  };
}

function buildPillar(
  label: Pillar["label"],
  ganZhi: string,
  hidden: string[],
  known: boolean,
  tenGodChar: string | null
): Pillar {
  const els = ganZhiElements(ganZhi);
  return {
    label,
    ganZhi: known ? ganZhi : "?",
    stem: known && els ? { char: els.stem.char, pinyin: els.stem.pinyin, element: els.stem.element, polarity: els.stem.polarity } : null,
    branch: known && els ? { char: els.branch.char, pinyin: els.branch.pinyin, element: els.branch.element, zodiac: els.branch.zodiac } : null,
    hidden,
    tenGod: known && tenGodChar ? tenGodLabel(tenGodChar) : null,
    known,
  };
}

export function calculateBazi(input: BirthInput): BaziResult {
  const adjusted = applyTrueSolarTime(input);

  const solar = Solar.fromYmdHms(adjusted.year, adjusted.month, adjusted.day, adjusted.hour, adjusted.minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearPillar = buildPillar("Year", eightChar.getYear(), safeHidden(() => eightChar.getYearHideGan()), true, safeString(() => eightChar.getYearShiShenGan()));
  const monthPillar = buildPillar("Month", eightChar.getMonth(), safeHidden(() => eightChar.getMonthHideGan()), true, safeString(() => eightChar.getMonthShiShenGan()));
  const dayPillar = buildPillar("Day", eightChar.getDay(), safeHidden(() => eightChar.getDayHideGan()), true, safeString(() => eightChar.getDayShiShenGan()));
  const hourKnown = !input.timeUnknown && input.hour !== null;
  const hourPillar = buildPillar(
    "Hour",
    eightChar.getTime(),
    safeHidden(() => eightChar.getTimeHideGan()),
    hourKnown,
    hourKnown ? safeString(() => eightChar.getTimeShiShenGan()) : null
  );

  const dayMasterChar = eightChar.getDayGan();
  const dayMaster = { char: dayMasterChar, pinyin: stemInfo(dayMasterChar).pinyin, element: stemInfo(dayMasterChar).element, polarity: stemInfo(dayMasterChar).polarity };

  const elementCounts: Record<Element, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const p of [yearPillar, monthPillar, dayPillar, hourPillar]) {
    if (!p.known) continue;
    if (p.stem) elementCounts[p.stem.element]++;
    if (p.branch) elementCounts[p.branch.element]++;
  }

  const dominantElement = (Object.keys(elementCounts) as Element[]).reduce((best, el) =>
    elementCounts[el] > elementCounts[best] ? el : best
  , dayMaster.element);

  const supportiveElements = new Set<Element>([dayMaster.element, generatorOf(dayMaster.element)]);
  const totalCount = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const supportiveCount = (Object.keys(elementCounts) as Element[])
    .filter((el) => supportiveElements.has(el))
    .reduce((sum, el) => sum + elementCounts[el], 0);
  const supportivePercent = totalCount > 0 ? Math.round((supportiveCount / totalCount) * 100) : 50;
  const dayMasterStrength: BaziResult["dayMasterStrength"] =
    supportivePercent >= 55 ? "Strong" : supportivePercent <= 45 ? "Weak" : "Balanced";

  const genderCode = input.gender === "male" ? 1 : 0;
  const yun = eightChar.getYun(genderCode);
  const rawCycles = yun.getDaYun();

  const currentYear = new Date().getFullYear();
  const luckCycles: LuckCycle[] = rawCycles
    .filter((dy: any) => dy.getIndex() > 0)
    .map((dy: any) => {
      const ganZhi = dy.getGanZhi();
      const els = ganZhiElements(ganZhi);
      const startYear = dy.getStartYear();
      const endYear = dy.getEndYear();
      return {
        index: dy.getIndex(),
        startYear,
        endYear,
        startAge: dy.getStartAge(),
        endAge: dy.getEndAge(),
        ganZhi: ganZhi || "—",
        stemElement: els?.stem.element ?? null,
        branchElement: els?.branch.element ?? null,
        isCurrent: currentYear >= startYear && currentYear <= endYear,
      };
    });

  const currentLuckCycle = luckCycles.find((c) => c.isCurrent) ?? null;

  let accuracyPercent = 95;
  if (input.timeUnknown) accuracyPercent = 72;

  const knownPillars = [yearPillar, monthPillar, dayPillar, hourPillar].filter((p) => p.known);
  const natalStems = knownPillars.filter((p) => p.stem).map((p) => ({ pillarLabel: p.label, char: p.stem!.char }));
  const natalBranches = knownPillars.filter((p) => p.branch).map((p) => ({ pillarLabel: p.label, char: p.branch!.char }));

  const interactions: Interaction[] = [...findStemInteractions(natalStems), ...findBranchInteractions(natalBranches)];

  let luckInteractions: Interaction[] = [];
  if (currentLuckCycle) {
    const luckGanZhi = ganZhiElements(currentLuckCycle.ganZhi);
    if (luckGanZhi) {
      const luckStem = { pillarLabel: "Luck Cycle", char: luckGanZhi.stem.char };
      const luckBranch = { pillarLabel: "Luck Cycle", char: luckGanZhi.branch.char };
      luckInteractions = [
        ...findStemInteractions([...natalStems, luckStem]).filter((i) => i.participants.includes("Luck Cycle")),
        ...findBranchInteractions([...natalBranches, luckBranch]).filter((i) => i.participants.includes("Luck Cycle")),
      ];
    }
  }

  const symbolicStars = findSymbolicStars(dayMasterChar, natalBranches);

  return {
    input,
    pillars: { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar },
    dayMaster,
    elementCounts,
    dominantElement,
    dayMasterStrength,
    supportivePercent,
    luckStartAge: yun.getStartYear(),
    luckCycles,
    currentLuckCycle,
    accuracyPercent,
    lunarDateLabel: `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    solarTimeCorrectionMinutes: adjusted.correctionMinutes,
    interactions,
    luckInteractions,
    symbolicStars,
  };
}

function safeHidden(fn: () => string[]): string[] {
  try {
    return fn() ?? [];
  } catch {
    return [];
  }
}

function safeString(fn: () => string): string | null {
  try {
    return fn() ?? null;
  } catch {
    return null;
  }
}
