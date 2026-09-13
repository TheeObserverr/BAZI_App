import { Solar } from "lunar-javascript";
import { ganZhiElements, stemInfo, tenGodLabel, type Element } from "./elements";

export type Gender = "male" | "female";

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute: number;
  gender: Gender;
  gmtOffset: number;
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
  luckStartAge: number;
  luckCycles: LuckCycle[];
  currentLuckCycle: LuckCycle | null;
  accuracyPercent: number;
  lunarDateLabel: string;
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
  const hour = input.timeUnknown || input.hour === null ? 12 : input.hour;
  const minute = input.timeUnknown ? 0 : input.minute;

  const solar = Solar.fromYmdHms(input.year, input.month, input.day, hour, minute, 0);
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

  return {
    input,
    pillars: { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar },
    dayMaster,
    elementCounts,
    luckStartAge: yun.getStartYear(),
    luckCycles,
    currentLuckCycle,
    accuracyPercent,
    lunarDateLabel: `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
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
