export interface DayMasterInfo {
  char: string;
  pinyin: string;
  element: string;
  polarity: string;
  nickname: string;
  summary: string;
  strengths: string[];
  watchOuts: string[];
}

export const DAY_MASTERS: DayMasterInfo[] = [
  {
    char: "甲",
    pinyin: "Jiǎ",
    element: "Wood",
    polarity: "Yang",
    nickname: "The Towering Tree",
    summary:
      "Upright, principled, and growth-oriented. Yang Wood people tend to be direct, ambitious, and natural leaders who push steadily upward like a tree reaching for light.",
    strengths: ["Strong sense of integrity and fairness", "Natural initiative and leadership", "Long-term, big-picture thinking"],
    watchOuts: ["Can be inflexible or stubborn once a course is set", "May struggle to bend or compromise under pressure", "Prone to overextending before pausing to consolidate"],
  },
  {
    char: "乙",
    pinyin: "Yǐ",
    element: "Wood",
    polarity: "Yin",
    nickname: "The Flowering Vine",
    summary:
      "Flexible, adaptive, and diplomatic. Yin Wood people bend without breaking, finding a way around obstacles rather than through them, and often build influence quietly.",
    strengths: ["Adaptability and resilience", "Diplomatic, easy to work with", "Good at cultivating relationships and resources"],
    watchOuts: ["Can be indecisive or overly accommodating", "May rely on others rather than acting independently", "Tendency to worry or overthink"],
  },
  {
    char: "丙",
    pinyin: "Bǐng",
    element: "Fire",
    polarity: "Yang",
    nickname: "The Blazing Sun",
    summary:
      "Warm, radiant, and generous with energy. Yang Fire people are expressive and confident, naturally drawing attention and energizing the people around them.",
    strengths: ["Charisma and warmth", "Optimism and enthusiasm", "Generosity and openness"],
    watchOuts: ["Can burn out from overcommitting", "May be overly direct or dramatic", "Attention can be fleeting once novelty fades"],
  },
  {
    char: "丁",
    pinyin: "Dīng",
    element: "Fire",
    polarity: "Yin",
    nickname: "The Candle Flame",
    summary:
      "Focused, warm, and perceptive. Yin Fire people give steady, concentrated light — thoughtful and precise rather than showy, often gifted at seeing what others miss.",
    strengths: ["Insight and attention to detail", "Quiet warmth and loyalty", "Skilled at focused, patient work"],
    watchOuts: ["Can be anxious or easily unsettled", "Sensitive to criticism", "May dim under sustained pressure without support"],
  },
  {
    char: "戊",
    pinyin: "Wù",
    element: "Earth",
    polarity: "Yang",
    nickname: "The Mountain",
    summary:
      "Steady, dependable, and grounded. Yang Earth people provide stability for others, are slow to change course, and carry natural authority and trustworthiness.",
    strengths: ["Reliability and follow-through", "Calm under pressure", "Strong practical judgment"],
    watchOuts: ["Can be rigid or resistant to change", "May come across as unyielding or blunt", "Slow to open up emotionally"],
  },
  {
    char: "己",
    pinyin: "Jǐ",
    element: "Earth",
    polarity: "Yin",
    nickname: "The Fertile Field",
    summary:
      "Nurturing, patient, and accommodating. Yin Earth people quietly support growth in others, are highly adaptable, and excel at maintaining harmony.",
    strengths: ["Patience and nurturing care for others", "Practical, detail-oriented follow-through", "Excellent mediator and team player"],
    watchOuts: ["Can be overly self-sacrificing", "May avoid necessary confrontation", "Tendency toward self-doubt"],
  },
  {
    char: "庚",
    pinyin: "Gēng",
    element: "Metal",
    polarity: "Yang",
    nickname: "The Raw Sword",
    summary:
      "Decisive, disciplined, and justice-driven. Yang Metal people cut straight to the point, value fairness, and are willing to take a hard stand when needed.",
    strengths: ["Decisiveness and courage", "Strong sense of justice", "Discipline and follow-through under pressure"],
    watchOuts: ["Can be blunt or confrontational", "May struggle with tact", "Prone to being overly critical of self and others"],
  },
  {
    char: "辛",
    pinyin: "Xīn",
    element: "Metal",
    polarity: "Yin",
    nickname: "The Polished Jewel",
    summary:
      "Refined, precise, and image-conscious. Yin Metal people value quality and aesthetics, are sharp observers, and prefer elegance over force.",
    strengths: ["Attention to detail and refinement", "Strong aesthetic sense and standards", "Sharp, discerning judgment"],
    watchOuts: ["Can be overly sensitive to criticism or perceived slights", "May prioritize appearances over substance", "Prone to holding grudges"],
  },
  {
    char: "壬",
    pinyin: "Rén",
    element: "Water",
    polarity: "Yang",
    nickname: "The Rushing River",
    summary:
      "Adventurous, resourceful, and free-flowing. Yang Water people move confidently through change, think broadly, and are drawn to exploration and new ideas.",
    strengths: ["Adaptability and resourcefulness", "Broad, unconventional thinking", "Natural social intelligence"],
    watchOuts: ["Can lack follow-through or focus", "May take on too many directions at once", "Restlessness can undermine stability"],
  },
  {
    char: "癸",
    pinyin: "Guǐ",
    element: "Water",
    polarity: "Yin",
    nickname: "The Quiet Rain",
    summary:
      "Intuitive, gentle, and perceptive. Yin Water people work subtly, sensing undercurrents others miss, and often carry quiet emotional depth and empathy.",
    strengths: ["Strong intuition and emotional insight", "Adaptability without conflict", "Deep empathy and reflective thinking"],
    watchOuts: ["Can be overly private or hard to read", "May absorb others' moods or stress", "Prone to indecision when overwhelmed"],
  },
];

export function findDayMaster(char: string): DayMasterInfo | undefined {
  return DAY_MASTERS.find((d) => d.char === char);
}
