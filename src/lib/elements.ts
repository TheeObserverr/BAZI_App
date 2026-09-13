export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Polarity = "Yang" | "Yin";

export interface StemInfo {
  char: string;
  pinyin: string;
  element: Element;
  polarity: Polarity;
}

export interface BranchInfo {
  char: string;
  pinyin: string;
  element: Element;
  zodiac: string;
}

export const STEMS: Record<string, StemInfo> = {
  "甲": { char: "甲", pinyin: "Jiǎ", element: "Wood", polarity: "Yang" },
  "乙": { char: "乙", pinyin: "Yǐ", element: "Wood", polarity: "Yin" },
  "丙": { char: "丙", pinyin: "Bǐng", element: "Fire", polarity: "Yang" },
  "丁": { char: "丁", pinyin: "Dīng", element: "Fire", polarity: "Yin" },
  "戊": { char: "戊", pinyin: "Wù", element: "Earth", polarity: "Yang" },
  "己": { char: "己", pinyin: "Jǐ", element: "Earth", polarity: "Yin" },
  "庚": { char: "庚", pinyin: "Gēng", element: "Metal", polarity: "Yang" },
  "辛": { char: "辛", pinyin: "Xīn", element: "Metal", polarity: "Yin" },
  "壬": { char: "壬", pinyin: "Rén", element: "Water", polarity: "Yang" },
  "癸": { char: "癸", pinyin: "Guǐ", element: "Water", polarity: "Yin" },
};

export const BRANCHES: Record<string, BranchInfo> = {
  "子": { char: "子", pinyin: "Zǐ", element: "Water", zodiac: "Rat" },
  "丑": { char: "丑", pinyin: "Chǒu", element: "Earth", zodiac: "Ox" },
  "寅": { char: "寅", pinyin: "Yín", element: "Wood", zodiac: "Tiger" },
  "卯": { char: "卯", pinyin: "Mǎo", element: "Wood", zodiac: "Rabbit" },
  "辰": { char: "辰", pinyin: "Chén", element: "Earth", zodiac: "Dragon" },
  "巳": { char: "巳", pinyin: "Sì", element: "Fire", zodiac: "Snake" },
  "午": { char: "午", pinyin: "Wǔ", element: "Fire", zodiac: "Horse" },
  "未": { char: "未", pinyin: "Wèi", element: "Earth", zodiac: "Goat" },
  "申": { char: "申", pinyin: "Shēn", element: "Metal", zodiac: "Monkey" },
  "酉": { char: "酉", pinyin: "Yǒu", element: "Metal", zodiac: "Rooster" },
  "戌": { char: "戌", pinyin: "Xū", element: "Earth", zodiac: "Dog" },
  "亥": { char: "亥", pinyin: "Hài", element: "Water", zodiac: "Pig" },
};

export const ELEMENT_COLOR: Record<Element, string> = {
  Wood: "#3f7d3f",
  Fire: "#c0392b",
  Earth: "#a9762f",
  Metal: "#8a8f98",
  Water: "#2a5f8f",
};

export function stemInfo(char: string): StemInfo {
  return STEMS[char];
}

export function branchInfo(char: string): BranchInfo {
  return BRANCHES[char];
}

export function ganZhiElements(ganZhi: string): { stem: StemInfo; branch: BranchInfo } | null {
  if (!ganZhi || ganZhi.length < 2) return null;
  const stem = STEMS[ganZhi[0]];
  const branch = BRANCHES[ganZhi[1]];
  if (!stem || !branch) return null;
  return { stem, branch };
}

export const TEN_GODS: Record<string, string> = {
  "比肩": "Friend",
  "劫财": "Rob Wealth",
  "食神": "Eating God",
  "伤官": "Hurting Officer",
  "偏财": "Indirect Wealth",
  "正财": "Direct Wealth",
  "七杀": "Seven Killings",
  "偏官": "Seven Killings",
  "正官": "Direct Officer",
  "偏印": "Indirect Seal",
  "正印": "Direct Seal",
  "日主": "Day Master",
};

export function tenGodLabel(char: string): string {
  return TEN_GODS[char] ?? char;
}

const ELEMENT_ORDER: Element[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

/** The element that generates (produces/"mothers") the given element in the five-element cycle. */
export function generatorOf(element: Element): Element {
  const i = ELEMENT_ORDER.indexOf(element);
  return ELEMENT_ORDER[(i + 4) % 5];
}
