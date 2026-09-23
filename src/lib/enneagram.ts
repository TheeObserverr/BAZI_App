export interface StanceOption {
  key: string;
  title: string;
  description: string;
}

/** Hornevian stance groups: how someone instinctively relates to getting what they want. */
export const GROUP_ONE: StanceOption[] = [
  {
    key: "A",
    title: "Assertive",
    description:
      "You tend to move toward what you want rather than wait for it. You set the pace, speak up, and like to see results from your own effort — downtime for its own sake feels less satisfying than being productively engaged. You don't go looking for conflict, but you don't back down easily either, and you usually know your own mind.",
  },
  {
    key: "B",
    title: "Withdrawn",
    description:
      "You tend to hang back and observe before engaging. A lot of your inner life happens quietly, on your own, and you don't need constant activity or company to feel okay. Asserting yourself over others doesn't come naturally, and you're comfortable letting things unfold at their own pace rather than pushing to make something happen.",
  },
  {
    key: "C",
    title: "Compliant",
    description:
      "You tend to orient around what's expected of you — by a standard, a group, or the people who depend on you. Following through matters a lot, and falling short of a commitment sits badly with you. You often put others' needs ahead of your own, sometimes to the point of neglecting your own rest or wellbeing.",
  },
];

/** Harmonic groups: how someone instinctively copes when things get hard. */
export const GROUP_TWO: StanceOption[] = [
  {
    key: "X",
    title: "Positive Outlook",
    description:
      "When things get difficult, you instinctively look for the upside or a way to keep the mood light. You'd rather stay busy or focus on what's good than dwell on what's wrong, and you like helping people around you feel okay too. The tradeoff: real problems can sit unaddressed longer than they should.",
  },
  {
    key: "Y",
    title: "Reactive",
    description:
      "Your feelings tend to be visible — people usually know when something's bothering you. You want to know clearly where you stand with others, and you'd rather react openly than swallow it quietly. You're not a fan of being told what to do; you'd rather decide for yourself once you have the full picture.",
  },
  {
    key: "Z",
    title: "Competency",
    description:
      "You'd rather stay composed and think something through than let emotion drive the moment. You hold yourself to a high, sometimes exacting standard, and prefer handling things on your own terms. Some read you as detached, but you'd call it not letting reactions get in the way of what needs doing.",
  },
];

export interface EnneagramType {
  number: number;
  name: string;
  coreDesire: string;
  coreFear: string;
  traits: string;
  atBest: string;
  watchFor: string;
}

export const ENNEAGRAM_TYPES: EnneagramType[] = [
  {
    number: 1,
    name: "The Reformer",
    coreDesire: "To be good, right, and beyond reproach",
    coreFear: "Being corrupt, defective, or wrong",
    traits: "Principled, improvement-driven, self-disciplined, and fair-minded — a natural advocate for doing things properly.",
    atBest: "Wise, discerning, and genuinely able to make things better without losing perspective.",
    watchFor: "Sliding into criticism, rigidity, or resentment when reality won't meet the standard.",
  },
  {
    number: 2,
    name: "The Helper",
    coreDesire: "To feel loved and needed",
    coreFear: "Being unwanted or unworthy of love",
    traits: "Warm, generous, and attentive to what others need, often before they ask.",
    atBest: "Unselfish and genuinely caring, able to give without keeping score.",
    watchFor: "Over-giving, difficulty naming their own needs, and quietly expecting closeness in return.",
  },
  {
    number: 3,
    name: "The Achiever",
    coreDesire: "To feel valuable and admired",
    coreFear: "Being worthless without visible success",
    traits: "Driven, adaptable, and image-conscious, with a strong pull toward efficient, visible results.",
    atBest: "Genuinely accomplished and self-assured, inspiring others without needing to perform.",
    watchFor: "Overwork, chasing status over substance, and losing touch with what they actually want.",
  },
  {
    number: 4,
    name: "The Individualist",
    coreDesire: "To be uniquely themselves and understood",
    coreFear: "Having no identity or personal significance",
    traits: "Expressive, introspective, and drawn to depth and meaning over the ordinary.",
    atBest: "Deeply creative, able to transform difficult experience into something honest and original.",
    watchFor: "Melancholy, self-absorption, and feeling perpetually different from everyone else.",
  },
  {
    number: 5,
    name: "The Investigator",
    coreDesire: "To be capable and competent",
    coreFear: "Being useless or overwhelmed by others' demands",
    traits: "Analytical, private, and driven to understand things deeply before acting.",
    atBest: "A genuinely original thinker, able to see what others miss.",
    watchFor: "Isolation, over-intellectualizing feelings, and hoarding time and energy from others.",
  },
  {
    number: 6,
    name: "The Loyalist",
    coreDesire: "To have security and support",
    coreFear: "Being without guidance or support when it matters",
    traits: "Dependable, vigilant, and quick to spot what could go wrong.",
    atBest: "Courageous and steady, a genuine anchor for people around them.",
    watchFor: "Anxiety, second-guessing, and swinging between over-caution and defiance.",
  },
  {
    number: 7,
    name: "The Enthusiast",
    coreDesire: "To stay satisfied and engaged with life",
    coreFear: "Being trapped in pain, boredom, or deprivation",
    traits: "Optimistic, spontaneous, and full of ideas and plans.",
    atBest: "Genuinely joyful and focused, channeling their energy into something worthwhile.",
    watchFor: "Scattered follow-through, and using busyness to avoid sitting with discomfort.",
  },
  {
    number: 8,
    name: "The Challenger",
    coreDesire: "To be in control of their own life",
    coreFear: "Being controlled or made vulnerable by others",
    traits: "Decisive, protective, and direct, with a strong instinct to take charge.",
    atBest: "A generous, magnanimous protector who uses strength to lift others up.",
    watchFor: "Confrontation, domination, and difficulty admitting vulnerability.",
  },
  {
    number: 9,
    name: "The Peacemaker",
    coreDesire: "Inner and outer peace",
    coreFear: "Loss of connection or being caught in conflict",
    traits: "Steady, accepting, and easy to get along with, often a natural mediator.",
    atBest: "Grounded and genuinely able to bring people together and settle real conflict.",
    watchFor: "Conflict-avoidance, inertia, and going along with things to keep the peace.",
  },
];

const CODE_TO_TYPE: Record<string, number> = {
  AX: 7,
  AY: 8,
  AZ: 3,
  BX: 9,
  BY: 4,
  BZ: 5,
  CX: 2,
  CY: 6,
  CZ: 1,
};

export function resolveType(groupOneKey: string, groupTwoKey: string): EnneagramType | null {
  const number = CODE_TO_TYPE[`${groupOneKey}${groupTwoKey}`];
  return ENNEAGRAM_TYPES.find((t) => t.number === number) ?? null;
}
