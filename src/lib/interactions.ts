import type { Element } from "./elements";

export type InteractionCategory =
  | "stem-combination"
  | "stem-clash"
  | "branch-combination"
  | "branch-trine"
  | "branch-clash"
  | "branch-harm"
  | "branch-destruction"
  | "branch-punishment";

export interface Interaction {
  category: InteractionCategory;
  label: string;
  participants: string[];
  chars: string;
  resultElement?: Element;
  meaning: string;
}

interface NamedChar {
  pillarLabel: string;
  char: string;
}

const LIFE_AREA: Record<string, string> = {
  Year: "your background and early life",
  Month: "your career environment and formative relationships",
  Day: "you and your closest partner",
  Hour: "your later years and children",
  "Luck Cycle": "this decade of your life",
};

function areas(labels: string[]): string {
  return labels.map((l) => LIFE_AREA[l] ?? l).join(" and ");
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("");
}

// --- Stem tables ---
const STEM_COMBOS: Record<string, Element> = {
  [pairKey("甲", "己")]: "Earth",
  [pairKey("乙", "庚")]: "Metal",
  [pairKey("丙", "辛")]: "Water",
  [pairKey("丁", "壬")]: "Wood",
  [pairKey("戊", "癸")]: "Fire",
};

const STEM_CLASHES = new Set([pairKey("甲", "庚"), pairKey("乙", "辛"), pairKey("丙", "壬"), pairKey("丁", "癸")]);

// --- Branch tables ---
const BRANCH_LIUHE: Record<string, Element | null> = {
  [pairKey("子", "丑")]: "Earth",
  [pairKey("寅", "亥")]: "Wood",
  [pairKey("卯", "戌")]: "Fire",
  [pairKey("辰", "酉")]: "Metal",
  [pairKey("巳", "申")]: "Water",
  [pairKey("午", "未")]: null,
};

const SANHE_SETS: { branches: string[]; element: Element }[] = [
  { branches: ["申", "子", "辰"], element: "Water" },
  { branches: ["亥", "卯", "未"], element: "Wood" },
  { branches: ["寅", "午", "戌"], element: "Fire" },
  { branches: ["巳", "酉", "丑"], element: "Metal" },
];

const BRANCH_CHONG = new Set([
  pairKey("子", "午"),
  pairKey("丑", "未"),
  pairKey("寅", "申"),
  pairKey("卯", "酉"),
  pairKey("辰", "戌"),
  pairKey("巳", "亥"),
]);

const BRANCH_HAI = new Set([
  pairKey("子", "未"),
  pairKey("丑", "午"),
  pairKey("寅", "巳"),
  pairKey("卯", "辰"),
  pairKey("申", "亥"),
  pairKey("酉", "戌"),
]);

// Overlaps with liuhe (寅亥, 巳申) are intentionally excluded — when a pair
// combines, the combination is treated as dominant and the destruction isn't
// separately flagged.
const BRANCH_PO = new Set([pairKey("子", "酉"), pairKey("午", "卯"), pairKey("辰", "丑"), pairKey("未", "戌")]);

const XING_GROUPS: { branches: string[]; label: string; meaning: string }[] = [
  {
    branches: ["寅", "巳", "申"],
    label: "Punishment (Ingratitude)",
    meaning: "a pattern where support given isn't reciprocated the way it was expected — one-sided effort or a falling-out after having helped someone",
  },
  {
    branches: ["丑", "戌", "未"],
    label: "Punishment (Overreach)",
    meaning: "a pattern of pushing too hard on power, position, or leverage, which tends to backfire",
  },
];

const SELF_PUNISH_BRANCHES = new Set(["辰", "午", "酉", "亥"]);

function categoryLabel(category: InteractionCategory): string {
  switch (category) {
    case "stem-combination":
      return "Stem Combination";
    case "stem-clash":
      return "Stem Clash";
    case "branch-combination":
      return "Branch Combination";
    case "branch-trine":
      return "Branch Trine";
    case "branch-clash":
      return "Branch Clash";
    case "branch-harm":
      return "Branch Harm";
    case "branch-destruction":
      return "Branch Destruction";
    case "branch-punishment":
      return "Branch Punishment";
  }
}

export function findStemInteractions(stems: NamedChar[]): Interaction[] {
  const results: Interaction[] = [];
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      const a = stems[i];
      const b = stems[j];
      const key = pairKey(a.char, b.char);
      const participants = [a.pillarLabel, b.pillarLabel];

      if (key in STEM_COMBOS) {
        const element = STEM_COMBOS[key];
        results.push({
          category: "stem-combination",
          label: categoryLabel("stem-combination"),
          participants,
          chars: `${a.char}-${b.char}`,
          resultElement: element,
          meaning: `A quiet pull toward compromise or a change of direction between ${areas(participants)}, tinged with ${element}. Combinations often soften a stated position rather than fight it head-on.`,
        });
      }
      if (STEM_CLASHES.has(key)) {
        results.push({
          category: "stem-clash",
          label: categoryLabel("stem-clash"),
          participants,
          chars: `${a.char}-${b.char}`,
          meaning: `An open friction point between ${areas(participants)} — competing priorities or a direct disagreement rather than something that stays beneath the surface.`,
        });
      }
    }
  }
  return results;
}

export function describeInteractionsForPrompt(interactions: Interaction[]): string {
  if (interactions.length === 0) return "None detected.";
  return interactions
    .map((i) => `${i.label} between ${i.participants.join(" & ")} (${i.chars}${i.resultElement ? `, leans ${i.resultElement}` : ""}): ${i.meaning}`)
    .join(" ");
}

export function findBranchInteractions(branches: NamedChar[]): Interaction[] {
  const results: Interaction[] = [];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const a = branches[i];
      const b = branches[j];
      const key = pairKey(a.char, b.char);
      const participants = [a.pillarLabel, b.pillarLabel];

      if (key in BRANCH_LIUHE) {
        const element = BRANCH_LIUHE[key];
        results.push({
          category: "branch-combination",
          label: categoryLabel("branch-combination"),
          participants,
          chars: `${a.char}-${b.char}`,
          resultElement: element ?? undefined,
          meaning: `A smoothing, cooperative bond between ${areas(participants)}${element ? `, leaning ${element}` : ""} — tension here tends to resolve quietly rather than boil over.`,
        });
        continue;
      }
      if (BRANCH_CHONG.has(key)) {
        results.push({
          category: "branch-clash",
          label: categoryLabel("branch-clash"),
          participants,
          chars: `${a.char}-${b.char}`,
          meaning: `A direct clash between ${areas(participants)} — abrupt change, restlessness, or upheaval rather than a slow build.`,
        });
        continue;
      }
      if (BRANCH_HAI.has(key)) {
        results.push({
          category: "branch-harm",
          label: categoryLabel("branch-harm"),
          participants,
          chars: `${a.char}-${b.char}`,
          meaning: `A quiet, undermining friction between ${areas(participants)} — not open conflict, more a recurring sense of being let down or overlooked.`,
        });
        continue;
      }
      if (BRANCH_PO.has(key)) {
        results.push({
          category: "branch-destruction",
          label: categoryLabel("branch-destruction"),
          participants,
          chars: `${a.char}-${b.char}`,
          meaning: `A slow-wearing erosion between ${areas(participants)} — things drifting apart gradually rather than one clean break.`,
        });
      }
    }
  }

  // Three-harmony trines: full (all 3 present) and half (2 of 3, at least one
  // strong adjacency) — reported once per matching set, not per pair.
  const branchByChar = new Map<string, NamedChar[]>();
  for (const b of branches) {
    const list = branchByChar.get(b.char) ?? [];
    list.push(b);
    branchByChar.set(b.char, list);
  }

  for (const set of SANHE_SETS) {
    const present = set.branches.filter((ch) => branchByChar.has(ch));
    if (present.length < 2) continue;
    const participantsList = present.flatMap((ch) => branchByChar.get(ch)!.map((b) => b.pillarLabel));
    const isFull = present.length === 3;
    results.push({
      category: "branch-trine",
      label: isFull ? "Full Trine" : "Partial Trine",
      participants: participantsList,
      chars: present.join("-"),
      resultElement: set.element,
      meaning: isFull
        ? `A complete, unified alliance across ${areas(participantsList)} around a strong ${set.element} theme — one of the more significant structural features in the chart.`
        : `Two of the three pieces of a ${set.element} alliance are present across ${areas(participantsList)} — a leaning in that direction, though not the full effect.`,
    });
  }

  // Punishments: 寅巳申 / 丑戌未 groups (2+ present), 子卯 pair, self-punishment.
  for (const group of XING_GROUPS) {
    const present = group.branches.filter((ch) => branchByChar.has(ch));
    if (present.length < 2) continue;
    const participantsList = present.flatMap((ch) => branchByChar.get(ch)!.map((b) => b.pillarLabel));
    results.push({
      category: "branch-punishment",
      label: group.label,
      participants: participantsList,
      chars: present.join("-"),
      meaning: `${group.meaning}, centered on ${areas(participantsList)}.`,
    });
  }

  if (branchByChar.has("子") && branchByChar.has("卯")) {
    const participantsList = [...branchByChar.get("子")!, ...branchByChar.get("卯")!].map((b) => b.pillarLabel);
    results.push({
      category: "branch-punishment",
      label: "Punishment (Tactlessness)",
      participants: participantsList,
      chars: "子-卯",
      meaning: `A pattern of friction from bluntness or a lack of tact between ${areas(participantsList)}.`,
    });
  }

  for (const ch of SELF_PUNISH_BRANCHES) {
    const list = branchByChar.get(ch);
    if (list && list.length >= 2) {
      results.push({
        category: "branch-punishment",
        label: "Self-Punishment",
        participants: list.map((b) => b.pillarLabel),
        chars: `${ch}-${ch}`,
        meaning: `A self-created strain around ${areas(list.map((b) => b.pillarLabel))} — difficulty that tends to come from one's own choices rather than outside circumstance.`,
      });
    }
  }

  return results;
}
