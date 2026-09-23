export interface SymbolicStar {
  name: string;
  chineseName: string;
  foundIn: string[];
  meaning: string;
}

interface NamedChar {
  pillarLabel: string;
  char: string;
}

const NOBLEMAN: Record<string, string[]> = {
  "甲": ["丑", "未"],
  "戊": ["丑", "未"],
  "庚": ["丑", "未"],
  "乙": ["子", "申"],
  "己": ["子", "申"],
  "丙": ["酉", "亥"],
  "丁": ["酉", "亥"],
  "辛": ["寅", "午"],
  "壬": ["卯", "巳"],
  "癸": ["卯", "巳"],
};

const ACADEMIC_STAR: Record<string, string> = {
  "甲": "巳", "乙": "午", "丙": "申", "丁": "酉", "戊": "申",
  "己": "酉", "庚": "亥", "辛": "子", "壬": "寅", "癸": "卯",
};

const YANG_BLADE: Record<string, string> = {
  "甲": "卯", "乙": "寅", "丙": "午", "丁": "巳", "戊": "午",
  "己": "巳", "庚": "酉", "辛": "申", "壬": "子", "癸": "亥",
};

const SANHE_SETS: string[][] = [
  ["申", "子", "辰"],
  ["寅", "午", "戌"],
  ["巳", "酉", "丑"],
  ["亥", "卯", "未"],
];

const PEACH_BLOSSOM: Record<string, string> = { "申子辰": "酉", "寅午戌": "卯", "巳酉丑": "午", "亥卯未": "子" };
const TRAVEL_HORSE: Record<string, string> = { "申子辰": "寅", "寅午戌": "申", "巳酉丑": "亥", "亥卯未": "巳" };
const GENERAL_STAR: Record<string, string> = { "申子辰": "子", "寅午戌": "午", "巳酉丑": "酉", "亥卯未": "卯" };
const CANOPY: Record<string, string> = { "申子辰": "辰", "寅午戌": "戌", "巳酉丑": "丑", "亥卯未": "未" };

function trineKeyFor(branch: string): string | null {
  const set = SANHE_SETS.find((s) => s.includes(branch));
  return set ? set.join("") : null;
}

function pillarsWithBranch(branches: NamedChar[], target: string): string[] {
  return branches.filter((b) => b.char === target).map((b) => b.pillarLabel);
}

export function findSymbolicStars(dayStemChar: string, branches: NamedChar[]): SymbolicStar[] {
  const stars: SymbolicStar[] = [];

  const nobleTargets = NOBLEMAN[dayStemChar] ?? [];
  const nobleFoundIn = nobleTargets.flatMap((t) => pillarsWithBranch(branches, t));
  if (nobleFoundIn.length > 0) {
    stars.push({
      name: "Nobleman",
      chineseName: "天乙贵人",
      foundIn: nobleFoundIn,
      meaning: "Tends to attract timely help from mentors, benefactors, or well-placed people exactly when it's needed.",
    });
  }

  const academicTarget = ACADEMIC_STAR[dayStemChar];
  const academicFoundIn = academicTarget ? pillarsWithBranch(branches, academicTarget) : [];
  if (academicFoundIn.length > 0) {
    stars.push({
      name: "Academic Star",
      chineseName: "文昌",
      foundIn: academicFoundIn,
      meaning: "Favors learning, exams, writing, and intellectual work — things tend to click faster in study or knowledge-based pursuits.",
    });
  }

  const bladeTarget = YANG_BLADE[dayStemChar];
  const bladeFoundIn = bladeTarget ? pillarsWithBranch(branches, bladeTarget) : [];
  if (bladeFoundIn.length > 0) {
    stars.push({
      name: "Yang Blade",
      chineseName: "羊刃",
      foundIn: bladeFoundIn,
      meaning: "A sharp, high-intensity edge — strong drive and capability, paired with a higher risk of conflict, injury, or overreach if left unchecked.",
    });
  }

  // Trine-based stars are anchored to the Year and Day branches (the two
  // most commonly used reference points); duplicates are merged.
  const referenceBranches = new Set([branches.find((b) => b.pillarLabel === "Year")?.char, branches.find((b) => b.pillarLabel === "Day")?.char].filter(Boolean) as string[]);

  const trineTables: { table: Record<string, string>; name: string; chineseName: string; meaning: string }[] = [
    { table: PEACH_BLOSSOM, name: "Peach Blossom", chineseName: "桃花", meaning: "Boosts charm and social/romantic magnetism — draws attention and romantic opportunity, for better or worse." },
    { table: TRAVEL_HORSE, name: "Travel Horse", chineseName: "驿马", meaning: "Points to a mobile, change-driven life — relocation, travel, or frequent shifts in environment or career." },
    { table: GENERAL_STAR, name: "General Star", chineseName: "将星", meaning: "Suggests a natural leadership presence and the ability to take charge within a group." },
    { table: CANOPY, name: "Canopy", chineseName: "华盖", meaning: "Associated with solitude, spirituality, and creative or intellectual depth — a tendency to think differently from the crowd or go it alone." },
  ];

  for (const { table, name, chineseName, meaning } of trineTables) {
    const targets = new Set<string>();
    for (const ref of referenceBranches) {
      const key = trineKeyFor(ref);
      if (key && table[key]) targets.add(table[key]);
    }
    const foundIn = Array.from(targets).flatMap((t) => pillarsWithBranch(branches, t));
    if (foundIn.length > 0) {
      stars.push({ name, chineseName, foundIn: Array.from(new Set(foundIn)), meaning });
    }
  }

  return stars;
}

export function describeStarsForPrompt(stars: SymbolicStar[]): string {
  if (stars.length === 0) return "None detected.";
  return stars.map((s) => `${s.name} (in ${s.foundIn.join(", ")}): ${s.meaning}`).join(" ");
}
